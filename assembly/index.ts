import 'allocator/arena';
// @ts-ignore
export { memory };

export function levenshtein(a: string, b: string): u32 {
  if (a === b) return <u32>0;

  let la: usize = a.length;
  let lb: usize = b.length;

  while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
    la--;
    lb--;
  }

  let offset: u32 = 0;

  while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) offset++;

  la -= offset;
  lb -= offset;

  if (la === 0 || lb < 3) return <u32>lb;

  let x: u32 = 0;
  let y: u32 = 0;
  let d0: u32;
  let d1: u32;
  let d2: u32;
  let d3: u32;
  let dd: u32;
  let dy: u32;
  let ay: u32;
  let bx0: u32;
  let bx1: u32;
  let bx2: u32;
  let bx3: u32;

  let length: u32 = (la - y) * 2;
  let ptr: u32 = memory.allocate(length);

  let i: u32 = 0;
  while (i < length) {
    store<u16>(ptr + <u16>(i++), y + 1);
    store<u16>(ptr + <u16>(i++), a.charCodeAt(<u32>offset + y++));
  }

  while (<u16>(x + 3) < lb) {
    d0 = x;
    d1 = x + 1;
    d2 = x + 2;
    d3 = x + 3;

    bx0 = b.charCodeAt(offset + d0);
    bx1 = b.charCodeAt(offset + d1);
    bx2 = b.charCodeAt(offset + d2);
    bx3 = b.charCodeAt(offset + d3);

    x += 4;
    dd = x;
    for (y = 0; y < length; y += 2) {
      dy = load<u16>(ptr + y);
      ay = load<u16>(ptr + y + 1);
      d0 = min(dy, d0, d1, bx0, ay);
      d1 = min(d0, d1, d2, bx1, ay);
      d2 = min(d1, d2, d3, bx2, ay);
      dd = min(d2, d3, dd, bx3, ay);
      store<u16>(ptr + <u16>y, dd);
      d3 = d2;
      d2 = d1;
      d1 = d0;
      d0 = dy;
    }
  }

  while (<usize>x < lb) {
    bx0 = b.charCodeAt(<u32>(offset + (d0 = x)));
    dd = ++x;
    for (y = 0; y < length; y += 2) {
      dy = load<u16>(ptr + <u16>y);
      dd = dy < d0 || dd < d0
        ? dy > dd ? dd + 1 : dy + 1
        : bx0 === load<u16>(ptr + <u16>(y + 1))
          ? d0
          : d0 + 1;
      store<u16>(ptr + <u16>y, dd);
      d0 = dy;
    }
  }

  memory.free(ptr);
  return dd!;
}


function min(d0: u32, d1: u32, d2: u32, bx: u32, ay: u32): u32 {
  return d0 < d1 || d2 < d1
    ? d0 > d2
      ? d2 + 1
      : d0 + 1
    : bx === ay
      ? d1
      : d1 + 1;
}
