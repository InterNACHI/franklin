import { COUNTRY, expand, expandFields, FIELDS, SUBDIVISIONS } from '../helpers/mappers.mjs';
import data from '../../data.json';

export class Country {
	code = '';
	name = '';
	grid = [];
	labels = {};
	required = {};
	subdivisions = [];
	
	static find(country_code) {
		return new Country(data.countries[country_code]);
	}
	
	constructor(compressed) {
		const expanded = expand(compressed, COUNTRY);
		
		this.code = expanded.code;
		this.name = expanded.name;
		
		this.grid = expandGrid(expanded.grid);
		
		this.labels = expand(expanded.labels, FIELDS, data.labels);
		
		this.required = expandFields(data.required[expanded.required]);
		this.required.push('address1');
		
		this.subdivisions = expandSubdivisions(expanded.subdivisions);
	}
}

export default Country;

function expandGrid(grid) {
	return data.grids[grid]
		.replace('A', '1~2') // Convert "address" to address lines 1 and 2
		.split('~')
		.map(row => expandFields(row));
}

function expandSubdivisions(compressed) {
	const expanded = expand(compressed, SUBDIVISIONS);
	
	// Split out subdivisions by the "~" separator
	Object.entries(expanded).forEach(([key, value]) => {
		expanded[key] = value
			? value.split('~')
			: [];
	});
	
	// Map into well-formed objects & sort by Latin name
	return expanded.keys
		.map((code, index) => {
			const name = expanded.names[index] || code;
			const latin_name = expanded.latin_names[index] || null;
			return { code, name, latin_name };
		})
		.sort((subdivision1, subdivision2) => {
			let a = (subdivision1.latin_name || subdivision1.name).toUpperCase();
			let b = (subdivision2.latin_name || subdivision2.name).toUpperCase();
			
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			}
			
			return 0;
		});
}
