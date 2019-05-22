// Copyright (c) AssemblyScript. All rights reserved. Apache-2.0 License.
// This is a derivative work of https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader for portability.

/* global WebAssembly, BigInt64Array, BigUint64Array */

const hasBigInt64 = typeof BigUint64Array !== 'undefined';
const thisPtr = Symbol('');

/** Gets a string from an U32 and an U16 view on a memory. */
function getStringImpl(U32: Uint32Array, U16: Uint16Array, ptr: number) {
	const dataLength = U32[ptr >>> 2];
	let dataOffset = (ptr + 4) >>> 1;
	let dataRemain = dataLength;
	const parts = [];
	const chunkSize = 1024;
	while (dataRemain > chunkSize) {
		const last = U16[dataOffset + chunkSize - 1];
		const size = last >= 0xD800 && last < 0xDC00 ? chunkSize - 1 : chunkSize;
		const part = U16.subarray(dataOffset, dataOffset += size);
		parts.push(String.fromCharCode(...part));
		dataRemain -= size;
	}
	return parts.join('') + String.fromCharCode(...U16.subarray(dataOffset, dataOffset + dataRemain));
}

/** Prepares the base module prior to instantiation. */
function preInstantiate(imports: ImportsObject): Required<ImportsObject> {
	const baseModule: ImportsObject = {};

	function getString(memory: WebAssembly.Memory, ptr: number) {
		if (!memory) return '<yet unknown>';
		const buffer = memory.buffer;
		return getStringImpl(new Uint32Array(buffer), new Uint16Array(buffer), ptr);
	}

	// add common imports used by stdlib for convenience
	imports.env = imports.env || {};
	const env = imports.env;
	env.abort = env.abort || function abort(msg: number, file: number, line: number, column: number) {
		const memory = baseModule.memory || env.memory; // prefer exported, otherwise try imported
		throw Error(`abort: ${getString(memory, msg)} at ${getString(memory, file)}:${line}:${column}`);
	};
	env.trace = env.trace || function trace(msg: number, numArgs?: number, ...rest: any[]) {
		const memory = baseModule.memory || env.memory;
		console.log(`trace: ${getString(memory, msg)}${numArgs ? ' ' : ''}${rest.join(', ')}`);
	};
	imports.Math = imports.Math || Math;
	imports.Date = imports.Date || Date;

	return baseModule as Required<ImportsObject>;
}

/** Prepares the final module once instantiation is complete. */
function postInstantiate<T>(baseModule: Partial<ASUtil> & Required<ImportsObject>, instance: WebAssembly.Instance): ASUtil & T {
	const rawExports = instance.exports;
	const memory = rawExports.memory as WebAssembly.Memory;
	const memory_allocate = rawExports['memory.allocate'] as (size: number) => number;

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
			if (hasBigInt64) {
				I64 = new BigInt64Array(buffer);
				U64 = new BigUint64Array(buffer);
			}
			F32 = new Float32Array(buffer);
			F64 = new Float64Array(buffer);
		}
	}
	checkMem();

	/** Allocates a new string in the module's memory and returns its pointer. */
	function newString(str: string) {
		const dataLength = str.length;
		const ptr = memory_allocate(4 + (dataLength << 1));
		const dataOffset = (4 + ptr) >>> 1;
		checkMem();
		U32[ptr >>> 2] = dataLength;
		for (let i = 0; i < dataLength; ++i) U16[dataOffset + i] = str.charCodeAt(i);
		return ptr;
	}

	baseModule.newString = newString;

	/** Gets a string from the module's memory by its pointer. */
	function getString(ptr: number) {
		checkMem();
		return getStringImpl(U32, U16, ptr);
	}

	baseModule.getString = getString;

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
function wrapFunction(fn: Function, setargc: (args: number) => void) {
	const wrap = (...args: any[]) => {
		setargc(args.length);
		return fn(...args);
	};
	// adding a function to the table with `newFunction` is limited to actual WebAssembly functions,
	// hence we can't use the wrapper and instead need to provide a reference to the original
	wrap.original = fn;
	return wrap;
}

/** Instantiates an AssemblyScript module using the specified imports. */
export function instantiate<T extends {}>(module: WebAssembly.Module, imports?: ImportsObject): ASUtil & T {
	return postInstantiate<T>(
		preInstantiate(imports || (imports = {})),
		new WebAssembly.Instance(module, imports)
	);
}

/** Instantiates an AssemblyScript module from a buffer using the specified imports. */
export function instantiateBuffer<T extends {}>(buffer: Uint8Array, imports?: ImportsObject): ASUtil & T {
	return instantiate(new WebAssembly.Module(buffer), imports);
}

const noop = () => { };
interface WrappedFunction {
	(...args: any[]): any;
	prototype: {
		new?: (...args: any[]) => Record<string, any>;
	};
	wrap?: (thisValue: any) => Record<string, any>;
}

/** Demangles an AssemblyScript module's exports to a friendly object structure. */
export function demangle<T extends Record<string, any>>(exports: Record<string, any>, baseModule: {}): T {
	const module = baseModule ? Object.create(baseModule) : {};
	const setargc = exports._setargc || noop;
	function hasOwnProperty(elem: Record<string, any>, prop: string) {
		return Object.prototype.hasOwnProperty.call(elem, prop);
	}
	for (const internalName in exports) {
		if (!hasOwnProperty(exports, internalName)) continue;
		const elem = exports[internalName];
		const parts = internalName.split('.');
		let curr = module;
		while (parts.length > 1) {
			const part = parts.shift();
			if (!hasOwnProperty(curr, part!)) curr[part!] = {};
			curr = curr[part!];
		}
		let name = parts[0];
		const hash = name.indexOf('#');
		if (hash >= 0) {
			const className = name.substring(0, hash);
			const classElem = curr[className];
			if (typeof classElem === 'undefined' || !classElem.prototype) {
				const ctor: WrappedFunction = (...args: any[]): Record<string, any> => ctor.wrap!(ctor.prototype.constructor(0, ...args));
				ctor.prototype = {};
				ctor.wrap = thisValue => Object.create(ctor.prototype, { [thisPtr]: { value: thisValue, writable: false } });
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
						get: function() { return getter(this[thisPtr]); },
						set: function(value) { setter(this[thisPtr], value); },
						enumerable: true
					});
				}
			} else if (name === 'constructor') {
				curr[name] = wrapFunction(elem, setargc);
			} else { // for methods
				Object.defineProperty(curr, name, {
					value: function(...args: any[]) {
						setargc(args.length);
						return elem(this[thisPtr], ...args);
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
		trace?: (msg: number, numArgs?: number, ...rest: any[]) => void;
	};
}

/** Utility mixed in by the loader. */
interface ASUtil extends ImportsObject {
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
	/** Allocates a new string in the module's memory and returns its pointer. */
	newString(str: string): number;
	/** Gets a string from the module's memory by its pointer. */
	getString(ptr: number): string;
}
