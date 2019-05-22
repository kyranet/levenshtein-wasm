const { readFileSync } = require('fs');
const { instantiateBuffer } = require('assemblyscript/lib/loader');

const imports = {
  env: {
    abort(_, __, line, column) {
      console.error("abort called at main.ts:" + line + ":" + column);
    }
  }
};

const wasmModule = instantiateBuffer(readFileSync(`${__dirname}/build/optimized.wasm`), imports);

module.exports = function levenshtein(a, b) {
  if (a.length > b.length) [a, b] = [b, a];
  return wasmModule.levenshtein(wasmModule.newString(a), wasmModule.newString(b));
};
