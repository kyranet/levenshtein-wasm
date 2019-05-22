// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com>. All rights reserved. MIT license.
// This is a derivative work of https://github.com/sindresorhus/leven in AssemblyScript.

/* global memory, load, store, sizeof */
/* eslint-disable prefer-const, @typescript-eslint/restrict-plus-operands */

import 'allocator/arena';
// @ts-ignore
export { memory };

export function levenshtein(left: string, right: string): usize {
	let leftLength: usize = left.length;
	let rightLength: usize = right.length;

	// Perform suffix suffix trimming
	while (leftLength > 0 && (left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength))) {
		--leftLength;
		--rightLength;
	}

	// Perform prefix trimming
	let start: usize = 0;
	while (start < leftLength && (left.charCodeAt(start) === right.charCodeAt(start))) {
		++start;
	}

	leftLength -= start;
	if (leftLength === 0) {
		return rightLength;
	}
	rightLength -= start;

	let bCharCode: u16;
	let result: usize;
	let temp: u16;
	let temp2: u16;
	let i: u16 = 0;
	let j: u16 = 0;

	let ptr: usize = memory.allocate(leftLength);
	while (i < leftLength) {
		store<u16>(ptr + (i * sizeof<u16>()), ++i as u16);
	}

	while (j < rightLength) {
		bCharCode = right.charCodeAt(start + j) as u16;
		temp = j++;
		result = j;
		i = 0;

		for (i = 0; i < leftLength; ++i) {
			temp2 = bCharCode === left.charCodeAt(start + i) ? temp : temp + 1;
			temp = load<u16>(ptr + (i * sizeof<u16>()));
			result = temp > result
				? temp2 > result
					? result + 1
					: temp2
				: temp2 > temp
					? temp + 1
					: temp2;
			store<u16>(ptr + (i * sizeof<u16>()), result as u16);
		}
	}

	memory.free(ptr);
	return result!;
}
