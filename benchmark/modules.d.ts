declare module 'talisman/metrics/distance/levenshtein' {
	function leven(left: string, right: string): number;
	export = leven;
}

declare module 'levenshtein-edit-distance' {
	function leven(left: string, right: string): number;
	export = leven;
}
