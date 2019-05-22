import * as test from 'tape';
import { levenshtein } from '../dist/index';

test('Basic Test', t => {
	t.plan(16);

	t.comment('Equal Strings');
	t.equal(levenshtein('hello', 'hello'), 0);

	t.comment('Substitutions');
	t.equal(levenshtein('a', 'b'), 1);
	t.equal(levenshtein('ab', 'ac'), 1);
	t.equal(levenshtein('ac', 'bc'), 1);
	t.equal(levenshtein('abc', 'axc'), 1);
	t.equal(levenshtein('xabxcdxxefxgx', '1ab2cd34ef5g6'), 6);

	t.comment('Many ops');
	t.equal(levenshtein('xabxcdxxefxgx', 'abcdefg'), 6);
	t.equal(levenshtein('javawasneat', 'scalaisgreat'), 7);
	t.equal(levenshtein('example', 'samples'), 3);
	t.equal(levenshtein('forward', 'drawrof'), 6);
	t.equal(levenshtein('sturgeon', 'urgently'), 6);
	t.equal(levenshtein('levenshtein', 'frankenstein'), 6);
	t.equal(levenshtein('distance', 'difference'), 5);
	t.equal(levenshtein('distance', 'eistancd'), 2);

	t.comment('Non-latin');
	t.equal(levenshtein('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文'), 2);

	t.comment('Long text');
	t.equal(levenshtein([
		'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate.',
		'Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus'
	].join(' '), [
		'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus.',
		'Suspendisse dapibus sapien in justo cursus'
	].join(' ')), 143);
});
