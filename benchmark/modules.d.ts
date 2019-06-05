declare module 'talisman/metrics/distance/levenshtein' {
	export default function(left: string, right: string): number;
}

declare module 'levenshtein-edit-distance' {
	export default function(left: string, right: string): number;
}
