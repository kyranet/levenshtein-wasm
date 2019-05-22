const { readFileSync } = require('fs');
const { instantiateBuffer } = require('assemblyscript/lib/loader');

const wasmModule = instantiateBuffer(readFileSync(`${__dirname}/build/optimized.wasm`));

module.exports = function levenshtein(a, b) {
  if (a.length > b.length) [a, b] = [b, a];
  return wasmModule.levenshtein(wasmModule.newString(a), wasmModule.newString(b));
};
