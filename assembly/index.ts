// Copyright (c) Gustaf Andersson. All rights reserved. MIT license.
// This is a derivative work of https://github.com/gustf/js-levenshtein in AssemblyScript.

/* global usize */
/* eslint-disable prefer-const, @typescript-eslint/restrict-plus-operands */

// @ts-ignore
@inline function min(d0: i32, d1: i32, d2: i32, bx: i32, ay: i32): i32 {
	return d0 < d1 || d2 < d1
		? d0 > d2
			? d2 + 1
			: d0 + 1
		: bx === ay
			? d1
			: d1 + 1;
}

export function levenshtein(a: string, b: string): usize {
	let la: usize = a.length;
	let lb: usize = b.length;

	// Perform suffix suffix trimming
	while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
		--la;
		--lb;
	}

	// Perform prefix trimming
	let offset: usize = 0;
	while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
		++offset;
	}

	la -= offset;
	lb -= offset;
	if (la === 0 || lb < 3) {
		return lb;
	}

	let x: usize = 0;
	let y: usize = 0;
	let d0: i32;
	let d1: i32;
	let d2: i32;
	let d3: i32;
	let dd: usize = usize.MAX_VALUE;
	let dy: i32;
	let ay: i32;
	let bx0: i32;
	let bx1: i32;
	let bx2: i32;
	let bx3: i32;

	let view: Int32Array = new Int32Array(la * 2);
	for (let i: i32 = 0; i < view.length; ++y) {
		view[i++] = y + 1;
		view[i++] = a.charCodeAt(offset + y);
	}

	let len: usize = view.length - 1;
	while (x < lb - 3) {
		bx0 = b.charCodeAt(offset + (d0 = x));
		bx1 = b.charCodeAt(offset + (d1 = x + 1));
		bx2 = b.charCodeAt(offset + (d2 = x + 2));
		bx3 = b.charCodeAt(offset + (d3 = x + 3));
		x += 4;
		dd = x;
		for (y = 0; y < len; y += 2) {
			dy = view[y];
			ay = view[y + 1];
			d0 = min(dy, d0, d1, bx0, ay);
			d1 = min(d0, d1, d2, bx1, ay);
			d2 = min(d1, d2, d3, bx2, ay);
			dd = min(d2, d3, dd, bx3, ay);
			view[y] = dd;
			d3 = d2;
			d2 = d1;
			d1 = d0;
			d0 = dy;
		}
	}

	while (x < lb) {
		bx0 = b.charCodeAt(offset + (d0 = x));
		dd = ++x;
		for (y = 0; y < len; y += 2) {
			dy = view[y];
			dd = min(dy, d0, dd, bx0, view[y + 1]);
			view[y] = dd;
			d0 = dy;
		}
	}

	return dd;
}
