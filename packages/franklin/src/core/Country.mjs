import { expand, COUNTRY, FIELDS, expandFields } from '../helpers/mappers.mjs';
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
		this.labels = expand(expanded.labels, FIELDS, data.labels)
		this.required = expandFields(data.required[expanded.required]);
		
		console.log(this);
		
		// FIXME:
		/*
		this.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
		
		this.labels = expand(expanded.labels, FIELDS);
		
		
		this.subdivisions = expanded.subdivisions.map(([code, name, latinName]) => {
			name = name || code;
			return { code, name, latinName };
		});
		*/
	}
}

export default Country;

function expandGrid(grid) {
	// FIXME
	return null;
}

function expandCountry(compressed) {
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
