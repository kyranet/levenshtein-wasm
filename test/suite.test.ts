import * as test from 'tape';
import { levenshtein } from '../dist/index';

test('Basic Test', t => {
	t.plan(14);

	t.equal(levenshtein('a', 'b'), 1, 'a -> b');
	t.equal(levenshtein('ab', 'ac'), 1, 'ab -> ac');
	t.equal(levenshtein('ac', 'bc'), 1, 'ac -> bc');
	t.equal(levenshtein('abc', 'axc'), 1, 'abc -> axc');
	t.equal(levenshtein('kitten', 'sitting'), 3, 'kitten -> sitting');
	t.equal(levenshtein('xabxcdxxefxgx', '1ab2cd34ef5g6'), 6, 'xabxcdxxefxgx -> 1ab2cd34ef5g6');
	t.equal(levenshtein('cat', 'cow'), 2, 'cat -> cow');
	t.equal(levenshtein('xabxcdxxefxgx', 'abcdefg'), 6, 'xabxcdxxefxgx -> abcdefg');
	t.equal(levenshtein('javawasneat', 'scalaisgreat'), 7, 'javawasneat -> scalaisgreat');
	t.equal(levenshtein('example', 'samples'), 3, 'example -> samples');
	t.equal(levenshtein('sturgeon', 'urgently'), 6, 'sturgeon -> urgently');
	t.equal(levenshtein('levenshtein', 'frankenstein'), 6, 'levenshtein -> frankenstein');
	t.equal(levenshtein('distance', 'difference'), 5, 'distance -> difference');
	t.equal(levenshtein('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文'), 2, '因為我是中國人所以我會說中文 -> 因為我是英國人所以我會說英文');
});
