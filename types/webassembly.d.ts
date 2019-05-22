// Copyright (c) Microsoft. All rights reserved. Apache-2.0 License.
// Sourced from https://github.com/microsoft/TypeScript/blob/de96b412724979ad089a1e9edecb217bad91725a/src/lib/webworker.generated.d.ts#L4491-L4582
// for portability, as @types/webassembly-js-api is deprecated and tsconfig.json doesn't seem to have a library
// for WebAssembly support. Might change in the future, though.
type BufferSource = ArrayBufferView | ArrayBuffer;

declare namespace WebAssembly {
	export class Global {
		public constructor(descriptor: GlobalDescriptor, value?: any);
		public value: any;
		public valueOf(): any;
	}


	export class Instance {
		public constructor(module: Module, importObject?: any);
		public readonly exports: any;
	}

	export class Memory {
		public constructor(descriptor: MemoryDescriptor);
		public readonly buffer: ArrayBuffer;
	}

	export class Module {
		public constructor(bytes: BufferSource);
		public customSections(module: Module, sectionName: string): ArrayBuffer[];
		public exports(module: Module): ModuleExportDescriptor[];
		public imports(module: Module): ModuleImportDescriptor[];
	}

	export class Table {
		public constructor(descriptor: TableDescriptor);
		public length: number;
		public get(index: number): Function | null;
		public grow(delta: number): number;
		public set(index: number, value: Function | null): void;
	}

	interface GlobalDescriptor {
		mutable?: boolean;
		value: string;
	}

	interface MemoryDescriptor {
		initial: number;
		maximum?: number;
	}

	interface ModuleExportDescriptor {
		kind: ImportExportKind;
		name: string;
	}

	interface ModuleImportDescriptor {
		kind: ImportExportKind;
		module: string;
		name: string;
	}

	interface TableDescriptor {
		element: TableKind;
		initial: number;
		maximum?: number;
	}

	interface WebAssemblyInstantiatedSource {
		instance: Instance;
		module: Module;
	}

	type ImportExportKind = 'function' | 'table' | 'memory' | 'global';
	type TableKind = 'anyfunc';
	function compile(bytes: BufferSource): Promise<Module>;
	function instantiate(bytes: BufferSource, importObject?: any): Promise<WebAssemblyInstantiatedSource>;
	function instantiate(moduleObject: Module, importObject?: any): Promise<Instance>;
	function validate(bytes: BufferSource): boolean;
}
