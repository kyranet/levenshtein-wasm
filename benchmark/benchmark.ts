import { Suite } from 'benchmark';
import levenshteinEditDistance = require('levenshtein-edit-distance');
import { get as fastLevenshtein } from 'fast-levenshtein';
import talisman = require('talisman/metrics/distance/levenshtein');
import leven from 'leven';
import levenshtein = require('js-levenshtein');
import { levenshtein as kyrashtein } from '../dist/index';

import { paragraphs } from './paragraphs';
import { sentences } from './sentences';
import { words } from './words';

interface BenchFunction {
	(word1: string, word2: string): number;
}

const word = new Suite('Words');
const para50 = new Suite('50 paragraphs, length max=500 min=240 avr=372.5');
const para100 = new Suite('100 sentences, length max=170 min=6 avr=57.5');

const wordBench = (fn: BenchFunction) => {
	for (let i = 0; i < words.length; i += 2) {
		const [word1, word2] = [words[i], words[i + 1]];
		fn(word1, word2);
	}
};

const paraBench = (fn: BenchFunction) => {
	for (let i = 0; i < paragraphs.length; i += 2) {
		const [para1, para2] = [paragraphs[i], paragraphs[i + 1]];
		fn(para1, para2);
	}
};

const sentenceBench = (fn: BenchFunction) => {
	for (let i = 0; i < sentences.length; i += 2) {
		const [para1, para2] = [sentences[i], sentences[i + 1]];
		fn(para1, para2);
	}
};

word
	.add('levenshtein-wasm', () => wordBench(kyrashtein))
	.add('js-levenshtein', () => wordBench(levenshtein))
	.add('talisman', () => wordBench(talisman))
	.add('levenshtein-edit-distance', () => wordBench(levenshteinEditDistance))
	.add('leven', () => wordBench(leven))
	.add('fast-levenshtein', () => wordBench(fastLevenshtein));

para50
	.add('levenshtein-wasm', () => paraBench(kyrashtein))
	.add('js-levenshtein', () => paraBench(levenshtein))
	.add('talisman', () => paraBench(talisman))
	.add('levenshtein-edit-distance', () => paraBench(levenshteinEditDistance))
	.add('leven', () => paraBench(leven))
	.add('fast-levenshtein', () => paraBench(fastLevenshtein));

para100
	.add('levenshtein-wasm', () => sentenceBench(kyrashtein))
	.add('js-levenshtein', () => sentenceBench(levenshtein))
	.add('talisman', () => sentenceBench(talisman))
	.add('levenshtein-edit-distance', () => sentenceBench(levenshteinEditDistance))
	.add('leven', () => sentenceBench(leven))
	.add('fast-levenshtein', () => sentenceBench(fastLevenshtein));

word.on('cycle', (event: any) => {
	console.log(String(event.target));
})
	.on('complete', function results(this: any) {
		console.log(`Fastest is ${this.filter('fastest').map('name')}`);

		console.log('\nRunning paragraph');
		para50.run({ async: true });
	});

para50.on('cycle', (event: any) => {
	console.log(String(event.target));
})
	.on('complete', function results(this: any) {
		console.log(`Fastest is ${this.filter('fastest').map('name')}`);

		console.log('\nRunning Sentence');
		para100.run({ async: true });
	});

para100.on('cycle', (event: any) => {
	console.log(String(event.target));
})
	.on('complete', function results(this: any) {
		console.log(`Fastest is ${this.filter('fastest').map('name')}`);
	});

console.log('Running Word');
word.run({ async: true });
