const { readFileSync } = require('fs');

const imports = {
  env: {
    abort(_, __, line, column) {
      console.error("abort called at main.ts:" + line + ":" + column);
    }
  }
};
const bytes = readFileSync(__dirname + "/build/untouched.wasm");
const mod = new WebAssembly.Module(bytes);
module.exports = new WebAssembly.Instance(mod, imports).exports;
