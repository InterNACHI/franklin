import { expand, expandFlags, COUNTRY, FIELDS, LABELS, SUBDIVISION } from './mappers.mjs';

export default function Country(compressed) {
		const expanded = expand(compressed, COUNTRY);
		
		expanded.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
		expanded.subdivisions = expanded.subdivisions.map(row => expandFlags(row, SUBDIVISION));
		expanded.labels = expand(expanded.labels, LABELS);
		expanded.required = expandFlags(expanded.required, FIELDS);
		
		return expanded;
}
