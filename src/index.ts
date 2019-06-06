import { readFileSync } from 'fs';
import { join } from 'path';
import { instantiateBuffer } from './loader';


const wasmModule = instantiateBuffer<{
	levenshtein(left: number, right: number): number;
}>(readFileSync(join(__dirname, '..', 'build', 'optimized.wasm')));

export function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	if (a.length > b.length) [a, b] = [b, a];

	const ptrB = wasmModule.__allocString(b);
	const ptrA = wasmModule.__allocString(a);
	return wasmModule.levenshtein(ptrA, ptrB);
}
