// Copyright (c) AssemblyScript. All rights reserved. Apache-2.0 License.
// This is a derivative work of https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader for portability.

/* global WebAssembly, BigInt64Array, BigUint64Array */

// Runtime header offsets
const ID_OFFSET = -8;
const SIZE_OFFSET = -4;

// Runtime ids
const ARRAYBUFFER_ID = 0;
const STRING_ID = 1;

// Runtime type information
const ARRAYBUFFERVIEW = 1 << 0;
const ARRAY = 1 << 1;
const VAL_ALIGN = 1 << 5;
const VAL_SIGNED = 1 << 10;
const VAL_FLOAT = 1 << 11;
const VAL_MANAGED = 1 << 13;

// Array(BufferView) layout
const ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
const ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
const ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;
const ARRAYBUFFERVIEW_SIZE = 12;
const ARRAY_LENGTH_OFFSET = 12;
const ARRAY_SIZE = 16;

const BIGINT = typeof BigUint64Array !== 'undefined';
const THIS = Symbol('THIS');
const CHUNKSIZE = 1024;

const noop = () => {};

/** Gets a string from an U32 and an U16 view on a memory. */
function getStringImpl(U32: Uint32Array, U16: Uint16Array, ref: number) {
	let length = U32[(ref + SIZE_OFFSET) >>> 2] >>> 1;
	let offset = ref >>> 1;
	if (length <= CHUNKSIZE) return String.fromCharCode(...U16.subarray(offset, offset + length));
	const parts = [];
	do {
		const last = U16[offset + CHUNKSIZE - 1];
		const size = last >= 0xD800 && last < 0xDC00 ? CHUNKSIZE - 1 : CHUNKSIZE;
		parts.push(String.fromCharCode(...U16.subarray(offset, offset += size)));
		length -= size;
	} while (length > CHUNKSIZE);
	return parts.join('') + String.fromCharCode(...U16.subarray(offset, offset + length));
}

/** Prepares the base module prior to instantiation. */
function preInstantiate(imports: ImportsObject) {
	const baseModule: ImportsObject = {};

	function getString(memory: WebAssembly.Memory, ref: number) {
		if (!memory) return '<yet unknown>';
		const buffer = memory.buffer;
		return getStringImpl(new Uint32Array(buffer), new Uint16Array(buffer), ref);
	}

	// add common imports used by stdlib for convenience
	imports.env = imports.env || {};
	const env = imports.env;
	env.abort = env.abort || function abort(mesg, file, line, colm) {
		const memory = baseModule.memory || env.memory; // prefer exported, otherwise try imported
		throw Error(`abort: ${getString(memory, mesg)} at ${getString(memory, file)}:${line}:${colm})`);
	};
	env.trace = env.trace || function trace(mesg, n, ...args) {
		const memory = baseModule.memory || env.memory;
		console.log(`trace: ${getString(memory, mesg) + (n ? ' ' : '') + args.join(', ')}`);
	};
	imports.Math = imports.Math || Math;
	imports.Date = imports.Date || Date;

	return baseModule as Required<ImportsObject>;
}

/** Prepares the final module once instantiation is complete. */
function postInstantiate<T>(baseModule: Partial<ASUtil> & Required<ImportsObject>, instance: WebAssembly.Instance): ASUtil & T {
	const rawExports = instance.exports;
	const memory = rawExports.memory as WebAssembly.Memory;
	const table = rawExports.table as WebAssembly.Table;
	const alloc = rawExports.__alloc as (size: number, id: number) => number;
	const retain = rawExports.__retain as (ref: number) => number;
	const rttiBase = rawExports.__rtti_base as number || ~0; // oob if not present

	// Provide views for all sorts of basic values
	let buffer: ArrayBuffer;
	let I8: Int8Array;
	let U8: Uint8Array;
	let I16: Int16Array;
	let U16: Uint16Array;
	let I32: Int32Array;
	let U32: Uint32Array;
	let F32: Float32Array;
	let F64: Float64Array;
	let I64: BigInt64Array;
	let U64: BigUint64Array;

	/** Updates memory views if memory has grown meanwhile. */
	function checkMem() {
		// see: https://github.com/WebAssembly/design/issues/1210
		if (buffer !== memory.buffer) {
			buffer = memory.buffer;
			I8 = new Int8Array(buffer);
			U8 = new Uint8Array(buffer);
			I16 = new Int16Array(buffer);
			U16 = new Uint16Array(buffer);
			I32 = new Int32Array(buffer);
			U32 = new Uint32Array(buffer);
			if (BIGINT) {
				I64 = new BigInt64Array(buffer);
				U64 = new BigUint64Array(buffer);
			}
			F32 = new Float32Array(buffer);
			F64 = new Float64Array(buffer);
		}
	}
	checkMem();

	/** Gets the runtime type info for the given id. */
	function getInfo(id: number) {
		const count = U32[rttiBase >>> 2];
		if ((id >>>= 0) >= count) throw Error(`invalid id: ${id}`);
		return U32[(rttiBase + 4 >>> 2) + (id * 2)];
	}

	/** Gets the runtime base id for the given id. */
	function getBase(id: number) {
		const count = U32[rttiBase >>> 2];
		if ((id >>>= 0) >= count) throw Error(`invalid id: ${id}`);
		return U32[(rttiBase + 4 >>> 2) + (id * 2) + 1];
	}

	/** Gets the runtime alignment of a collection's values or keys. */
	function getAlign(which: number, info: number) {
		return 31 - Math.clz32((info / which) & 31); // -1 if none
	}

	/** Allocates a new string in the module's memory and returns its retained pointer. */
	function __allocString(str: string) {
		const length = str.length;
		const ref = alloc(length << 1, STRING_ID);
		checkMem();
		for (let i = 0, j = ref >>> 1; i < length; ++i) U16[j + i] = str.charCodeAt(i);
		return ref;
	}

	baseModule.__allocString = __allocString;

	/** Reads a string from the module's memory by its pointer. */
	function __getString(ref: number) {
		checkMem();
		const id = U32[ref + ID_OFFSET >>> 2];
		if (id !== STRING_ID) throw Error(`not a string: ${ref}`);
		return getStringImpl(U32, U16, ref);
	}

	baseModule.__getString = __getString;

	/** Gets the view matching the specified alignment, signedness and floatness. */
	function getView(align: number, signed: number | boolean, float: number | boolean) {
		if (float) {
			switch (align) {
				case 2: return F32;
				case 3: return F64;
			}
		} else {
			switch (align) {
				case 0: return signed ? I8 : U8;
				case 1: return signed ? I16 : U16;
				case 2: return signed ? I32 : U32;
				case 3: return signed ? I64 : U64;
			}
		}
		throw Error(`unsupported align: ${align}`);
	}

	/** Allocates a new array in the module's memory and returns its retained pointer. */
	function __allocArray(id: number, values: number[]) {
		const info = getInfo(id);
		if (!(info & (ARRAYBUFFERVIEW | ARRAY))) throw Error(`not an array: ${id} @ ${info}`);
		const align = getAlign(VAL_ALIGN, info);
		const length = values.length;
		const buf = alloc(length << align, ARRAYBUFFER_ID);
		const arr = alloc(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);
		checkMem();
		U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = retain(buf);
		U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf;
		U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length << align;
		if (info & ARRAY) U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length;
		const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);
		for (let i = 0; i < length; ++i) view[(buf >> align) + i] = values[i];
		if (info & VAL_MANAGED) for (let i = 0; i < length; ++i) retain(values[i]);
		return arr;
	}

	baseModule.__allocArray = __allocArray;

	/** Gets a view on the values of an array in the module's memory. */
	function __getArrayView(arr: number) {
		checkMem();
		const id = U32[arr + ID_OFFSET >>> 2];
		const info = getInfo(id);
		if (!(info & ARRAYBUFFERVIEW)) throw Error(`not an array: ${id}`);
		const align = getAlign(VAL_ALIGN, info);
		let buf = U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
		const length = info & ARRAY
			? U32[arr + ARRAY_LENGTH_OFFSET >>> 2]
			: U32[buf + SIZE_OFFSET >>> 2] >>> align;
		return getView(align, info & VAL_SIGNED, info & VAL_FLOAT)
			.slice(buf >>>= align, buf + length);
	}

	baseModule.__getArrayView = __getArrayView;

	/** Reads (copies) the values of an array from the module's memory. */
	function __getArray(arr: number) {
		// @ts-ignore
		return Array.from(__getArrayView(arr));
	}

	baseModule.__getArray = __getArray;

	/** Tests whether an object is an instance of the class represented by the specified base id. */
	function __instanceof(ref: number, baseId: number) {
		let id = U32[(ref + ID_OFFSET) >>> 2];
		if (id <= U32[rttiBase >>> 2]) {
			do if (id === baseId) return true;
			while ((id = getBase(id)));
		}
		return false;
	}

	baseModule.__instanceof = __instanceof;

	// Pull basic exports to baseModule so code in preInstantiate can use them
	baseModule.memory = baseModule.memory || memory;
	baseModule.table = baseModule.table || table;

	// Demangle exports and provide the usual utility on the prototype
	return demangle(rawExports, Object.defineProperties(baseModule, {
		I8: {
			get() {
				checkMem();
				return I8;
			}
		},
		U8: {
			get() {
				checkMem();
				return U8;
			}
		},
		I16: {
			get() {
				checkMem();
				return I16;
			}
		},
		U16: {
			get() {
				checkMem();
				return U16;
			}
		},
		I32: {
			get() {
				checkMem();
				return I32;
			}
		},
		U32: {
			get() {
				checkMem();
				return U32;
			}
		},
		I64: {
			get() {
				checkMem();
				return I64;
			}
		},
		U64: {
			get() {
				checkMem();
				return U64;
			}
		},
		F32: {
			get() {
				checkMem();
				return F32;
			}
		},
		F64: {
			get() {
				checkMem();
				return F64;
			}
		}
	}));
}

/** Wraps a WebAssembly function while also taking care of variable arguments. */
function wrapFunction<T extends Function>(fn: T, setargc: (args: number) => void) {
	const wrap = (...args: any[]) => {
		setargc(args.length);
		return fn(...args);
	};
	wrap.original = fn;
	return wrap;
}

/** Instantiates an AssemblyScript module using the specified imports. */
export function instantiate<T extends {}>(module: WebAssembly.Module, imports?: ImportsObject): ASUtil & T {
	return postInstantiate(
		preInstantiate(imports || (imports = {})),
		new WebAssembly.Instance(module, imports)
	);
}

/** Instantiates an AssemblyScript module from a buffer using the specified imports. */
export function instantiateBuffer<T extends {}>(buffer: Uint8Array, imports?: ImportsObject): ASUtil & T {
	return instantiate(new WebAssembly.Module(buffer), imports);
}

/** Demangles an AssemblyScript module's exports to a friendly object structure. */
export function demangle<T extends Record<string, any>>(exports: Record<string, any>, baseModule: {}): T {
	const module = baseModule ? Object.create(baseModule) : {};
	const setargc = exports.__setargc || noop;
	function hasOwnProperty(elem: Record<string, any>, prop: string) {
		return Object.prototype.hasOwnProperty.call(elem, prop);
	}
	for (const internalName in exports) {
		if (!hasOwnProperty(exports, internalName)) continue;
		const elem = exports[internalName];
		const parts = internalName.split('.');
		let curr = module;
		while (parts.length > 1) {
			const part = parts.shift()!;
			if (!hasOwnProperty(curr, part)) curr[part] = {};
			curr = curr[part];
		}
		let name = parts[0];
		const hash = name.indexOf('#');
		if (hash >= 0) {
			const className = name.substring(0, hash);
			const classElem = curr[className];
			if (typeof classElem === 'undefined' || !classElem.prototype) {
				const ctor: WrappedFunction = (...args: any[]): Record<string, any> => ctor.wrap!(ctor.prototype.constructor(0, ...args));
				ctor.prototype.valueOf = function valueOf(this: WrappedFunction) {
					return this[THIS];
				};
				ctor.wrap = thisValue => Object.create(ctor.prototype, { [THIS]: { value: thisValue, writable: false } });
				if (classElem) {
					Object.getOwnPropertyNames(classElem).forEach(name =>
						Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name)!));
				}
				curr[className] = ctor;
			}
			name = name.substring(hash + 1);
			curr = curr[className].prototype;
			if (/^(get|set):/.test(name)) {
				if (!hasOwnProperty(curr, name = name.substring(4))) {
					const getter = exports[internalName.replace('set:', 'get:')];
					const setter = exports[internalName.replace('get:', 'set:')];
					Object.defineProperty(curr, name, {
						get() { return getter(this[THIS]); },
						set(value) { setter(this[THIS], value); },
						enumerable: true
					});
				}
			} else if (name === 'constructor') {
				curr[name] = wrapFunction(elem, setargc);
			} else { // for methods
				Object.defineProperty(curr, name, {
					value(...args: any[]) {
						setargc(args.length);
						return elem(this[THIS], ...args);
					}
				});
			}
		} else if (/^(get|set):/.test(name)) {
			if (!hasOwnProperty(curr, name = name.substring(4))) {
				Object.defineProperty(curr, name, {
					get: exports[internalName.replace('set:', 'get:')],
					set: exports[internalName.replace('get:', 'set:')],
					enumerable: true
				});
			}
		} else if (typeof elem === 'function') {
			curr[name] = wrapFunction(elem, setargc);
		} else {
			curr[name] = elem;
		}
	}

	return module;
}

/** WebAssembly imports with two levels of nesting. */
interface ImportsObject extends Record<string, any> {
	env?: {
		memory?: WebAssembly.Memory;
		table?: WebAssembly.Table;
		abort?: (msg: number, file: number, line: number, column: number) => void;
		trace?: (msg: number, numArgs?: number, ...args: any[]) => void;
	};
}

interface WrappedFunction {
	(...args: any[]): any;
	prototype: {
		new?: (...args: any[]) => Record<string, any>;
		valueOf(): any;
	};
	wrap?: (thisValue: any) => Record<string, any>;
	[THIS]?: any;
}

type TypedArray
	= Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/** Utility mixed in by the loader. */
interface ASUtil {
	/** An 8-bit signed integer view on the memory. */
	readonly I8: Uint8Array;
	/** An 8-bit unsigned integer view on the memory. */
	readonly U8: Uint8Array;
	/** A 16-bit signed integer view on the memory. */
	readonly I16: Uint16Array;
	/** A 16-bit unsigned integer view on the memory. */
	readonly U16: Uint16Array;
	/** A 32-bit signed integer view on the memory. */
	readonly I32: Uint32Array;
	/** A 32-bit unsigned integer view on the memory. */
	readonly U32: Uint32Array;
	/** A 64-bit signed integer view on the memory. */
	readonly I64: any; // BigInt64Array
	/** A 64-bit unsigned integer vieww on the memory. */
	readonly U64: any; // BigUint64Array
	/** A 32-bit float view on the memory. */
	readonly F32: Float32Array;
	/** A 64-bit float view on the memory. */
	readonly F64: Float64Array;
	/** Explicit start function, if requested. */
	__start(): void;
	/** Allocates a new string in the module's memory and returns a reference (pointer) to it. */
	__allocString(str: string): number;
	/** Reads (copies) the value of a string from the module's memory. */
	__getString(ref: number): string;
	/** Allocates a new array in the module's memory and returns a reference (pointer) to it. */
	__allocArray(id: number, values: number[]): number;
	/** Reads (copies) the values of an array from the module's memory. */
	__getArray(ref: number): number[];
	/** Gets a view on the values of an array in the module's memory. */
	__getArrayView(ref: number): TypedArray;
	/** Retains a reference externally, making sure that it doesn't become collected prematurely. Returns the reference. */
	__retain(ref: number): number;
	/** Releases a previously retained reference to an object, allowing the runtime to collect it once its reference count reaches zero. */
	__release(ref: number): void;
	/** Allocates an instance of the class represented by the specified id. */
	__alloc(size: number, id: number): number;
	/** Tests whether an object is an instance of the class represented by the specified base id. */
	__instanceof(ref: number, baseId: number): boolean;
	/** Forces a cycle collection. Only relevant if objects potentially forming reference cycles are used. */
	__collect(): void;
}
