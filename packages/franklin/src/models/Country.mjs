import { ADMINISTRATIVE_AREAS, COUNTRY, expand, expandFields, FIELDS, PATTERNS } from '../helpers/mappers.mjs';
import data from '../../data.json';

export class Country {
	code = '';
	name = '';
	grid = [];
	labels = {};
	required = [];
	administrative_areas = [];
	patterns = {};
	examples = {};
	
	static forSelection(preferred = []) {
		let countries = Object.values(data.countries)
			.map(compressed => {
				const expanded = expand(compressed, COUNTRY);
				return { label: expanded.name, value: expanded.code };
			})
			.sort((a, b) => a.label.localeCompare(b.label));
		
		if (preferred.length) {
			preferred = preferred
				.filter(country_code => country_code in data.countries)
				.map(country_code => {
					const expanded = expand(data.countries[country_code], COUNTRY);
					return { label: expanded.name, value: expanded.code, key: `${ expanded.code}-preferred` };
				});
			
			preferred.push({ label: '--------------------', value: '', disabled: true });
			
			countries = [...preferred, ...countries];
		}
		
		return countries;
	}
	
	static find(country_code) {
		return new Country(data.countries[country_code]);
	}
	
	constructor(compressed) {
		const expanded = expand(compressed, COUNTRY);
		
		this.code = expanded.code;
		this.name = expanded.name;
		
		this.grid = data.grids[expanded.grid]
			.replace('A', '1~2') // Convert "address" to address lines 1 and 2
			.split('~')
			.map(row => expandFields(row));
		
		this.labels = expand(expanded.labels, FIELDS, data.labels);
		
		this.required = expandFields(data.required[expanded.required]);
		this.required.push('address1');
		
		this.administrative_areas = expandAdministrativeAreas(expanded.administrative_areas);
		
		this.patterns = expand(expanded.patterns, PATTERNS);
		
		this.examples = expand(expanded.examples, PATTERNS);
	}
	
	isRequired(field) {
		return 'country' === field || -1 !== this.required.indexOf(field);
	}
	
	getPattern(field) {
		return this.patterns[field] || undefined;
	}
	
	getLabel(field) {
		return this.labels[field];
	}
	
	getDescription(field) {
		if (field in this.examples) {
			let description = `e.g. ${ this.examples[field][0] }`;
			
			if (this.examples[field].length > 1) {
				description += ` or ${ this.examples[field][1] }`;
			}
			
			return description;
		}
		
		return this.getLabel(field);
	}
}

export default Country;

function expandAdministrativeAreas(compressed) {
	const expanded = expand(compressed, ADMINISTRATIVE_AREAS);
	
	// Split out administrative areas by the "~" separator
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
		.sort((area1, area2) => {
			let a = (area1.latin_name || area1.name).toUpperCase();
			let b = (area2.latin_name || area2.name).toUpperCase();
			
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			}
			
			return 0;
		});
}
