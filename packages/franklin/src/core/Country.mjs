import { expand, expandFlags, COUNTRY, FIELDS } from '../helpers/mappers.mjs';

export class Country {
	code = '';
	name = '';
	grid = [];
	labels = {};
	required = {};
	subdivisions = [];
	
	constructor(compressed) {
		const expanded = expand(compressed, COUNTRY);
		
		this.code = expanded.code;
		this.name = expanded.name;
		
		this.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
		
		this.labels = expand(expanded.labels, FIELDS);
		this.required = expandFlags(expanded.required, FIELDS);
		
		this.subdivisions = expanded.subdivisions.map(([code, name, latinName]) => {
			name = name || code;
			return { code, name, latinName };
		});
	}
}

export default Country;
