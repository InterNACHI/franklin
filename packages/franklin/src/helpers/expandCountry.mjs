import { COUNTRY, expand, expandFlags, FIELDS } from './mappers.mjs';

export default function expandCountry(compressed) {
	const expanded = expand(compressed, COUNTRY);
	
	expanded.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
	
	expanded.subdivisions = expanded.subdivisions
		.map(([code, name, latinName = null]) => {
			name = name || code;
			return { code, name, latinName };
		}).sort((subdivision1, subdivision2) => {
			let a = (subdivision1.latinName || subdivision1.name).toUpperCase();
			let b = (subdivision2.latinName || subdivision2.name).toUpperCase();
			
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			return 0;
		});
	
	expanded.labels = expand(expanded.labels, FIELDS);
	
	expanded.required = expandFlags(expanded.required, FIELDS);
	expanded.required.address1 = true;
	
	return expanded;
}
