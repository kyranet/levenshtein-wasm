# Levenshtein Wasm

<div align="center">
	<p>
		<a href="https://www.npmjs.com/package/levenshtein-wasm">
			<img src="https://img.shields.io/npm/v/levenshtein-wasm.svg?maxAge=3600" alt="NPM version" />
		</a>
		<a href="https://www.npmjs.com/package/levenshtein-wasm">
			<img src="https://img.shields.io/npm/dt/levenshtein-wasm.svg?maxAge=3600" alt="NPM downloads" />
		</a>
		<a href="https://dev.azure.com/kyranet/kyranet.public/_build/latest?definitionId=1&branchName=master">
			<img src="https://dev.azure.com/kyranet/kyranet.public/_apis/build/status/kyranet.levenshtein-wasm?branchName=master" alt="Build status" />
		</a>
		<a href="https://lgtm.com/projects/g/kyranet/levenshtein-wasm/alerts/">
			<img src="https://img.shields.io/lgtm/alerts/g/kyranet/levenshtein-wasm.svg?logo=lgtm&logoWidth=18" alt="Total alerts">
		</a>
		<a href="https://dependabot.com">
			<img src="https://api.dependabot.com/badges/status?host=github&repo=kyranet/levenshtein-wasm" alt="Dependabot Status">
		</a>
		<a href="https://www.patreon.com/kyranet">
			<img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" />
		</a>
	</p>
	<p>
		<a href="https://nodei.co/npm/levenshtein-wasm/"><img src="https://nodei.co/npm/levenshtein-wasm.png?downloads=true&stars=true" alt="npm installnfo" /></a>
	</p>
</div>

🚀 Experimental Wasm library made using [AssemblyScript](https://github.com/AssemblyScript) to convert strict
[TypeScript](https://www.typescriptlang.org/) into fast and optimized [Web Assembly](https://webassembly.org/) binaries.

## Examples

`levenshtein-wasm` only exports a function, named `levenshtein`, which takes two strings and returns its
[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance):

```javascript
const { levenshtein } = require('levenshtein-wasm');
// const levenshtein = require('levenshtein-wasm').levenshtein;
// import { levenshtein } from 'levenshtein-wasm';

console.log(levenshtein('cat', 'cow'));
// -> 2
```

## Contributing

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request!

## Author

**levenshtein-wasm** © [kyranet](https://github.com/kyranet), released under the
[MIT](https://github.com/kyranet/levenshtein-wasm/blob/master/LICENSE) License.
Authored and maintained by kyranet.

> Github [kyranet](https://github.com/kyranet) - Twitter [@kyranet_](https://twitter.com/kyranet_)
