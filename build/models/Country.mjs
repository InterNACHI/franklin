import getTerritories from '../get-territories.mjs';
import { compress, compressFlags, COUNTRY, SUBDIVISION, FIELDS } from '../../src/mappers.mjs';

let territories = null;

export default class Country {
	constructor(definition) {
		this.definition = normalize(definition);
	}
	
	async compress() {
		return compress({
			code: this.definition.key,
			name: await getName(this.definition),
			grid: buildGrid(this.definition),
			labels: buildLabels(this.definition),
			required: buildRequired(this.definition),
			subdivisions: buildSubdivisions(this.definition),
		}, COUNTRY);
	}
}

async function getName(definition) {
	if (null === territories) {
		territories = await getTerritories();
	}
	
	if (definition.key in territories) {
		return territories[definition.key];
	}
	
	return definition.name;
}

function buildLabels(definition) {
	return compress({
		sorting_code: definition.zip_name_type,
		administrative_area: definition.state_name_type,
		locality: definition.locality_name_type,
		sublocality: definition.sublocality_name_type,
	}, FIELDS);
}

function buildGrid(definition) {
	return [...definition.fmt.matchAll(/%([a-z])/gi)]
		.reduce((grid, [_, char]) => {
			const name = fieldName(char);
			
			if ('n' === char) {
				grid.push({});
			} else if ('address' === name) {
				grid[grid.length - 1].address1 = true;
				grid.push({});
				grid[grid.length - 1].address2 = true;
			} else if (name) {
				grid[grid.length - 1][name] = true;
			}
			
			return grid;
		}, [{}])
		.filter(row => Object.keys(row).length)
		.map(row => compressFlags(row, FIELDS));
}

function buildRequired(definition) {
	if (!('require' in definition)) {
		return 0;
	}
	
	const required = definition.require.split('')
		.reduce((required, char) => {
			const name = fieldName(char);
			if (name) {
				required[name] = true;
			}
			return required;
		}, {});
	
	return compressFlags(required, FIELDS);
}

function buildSubdivisions(definition) {
	// Extract data
	const { sub_keys = null, sub_names = [] } = definition;
	
	if (null === sub_keys) {
		return [];
	}
	
	return sub_keys.map((code, index) => {
		const name = 'undefined' !== typeof sub_names[index] && sub_names[index] !== sub_keys[index]
			? sub_names[index]
			: null;
		
		return compress({ code, name }, SUBDIVISION);
	});
}

function normalize(definition) {
	const lists = [
		'sub_keys',
		'sub_names',
		'sub_lnames',
		'sub_isoids',
		'sub_zips',
		'sub_zipexs',
		'sub_mores',
		'languages',
	];
	
	for (let key of lists) {
		if (key in definition) {
			definition[key] = definition[key].split('~');
		}
	}
	
	return definition;
}

function fieldName(char) {
	const fields = {
		'R': 'country',
		'1': 'address1',
		'2': 'address2',
		'A': 'address',
		'S': 'administrative_area',
		'C': 'locality',
		'D': 'sublocality',
		'Z': 'postal_code',
		'X': 'sorting_code',
	};
	
	if (char in fields) {
		return fields[char];
	}
	
	return false;
}

// function extract(country, key) {
// 	switch (key) {
// 		case 'fmt':
// 			// Get format
// 			break;
//		
// 		case 'lfmt':
// 			// The latin format string used when a country defines an alternative format for
// 			// use with the latin script, such as in China.
// 			break;
//		
// 		case 'lang':
// 			// Default language
// 			break;
//		
// 		case 'languages':
// 			// List of all languages
// 			// Separated by ~
// 			break;
//		
// 		case 'state_name_type':
// 			// Name for admin area / state
// 			break;
//		
// 		case 'locality_name_type':
// 			// Name for locality / city
// 			break;
//		
// 		case 'sublocality_name_type':
// 			// Name for sub-locality
// 			break;
//		
// 		case 'zip_name_type':
// 			break;
//		
// 		case 'require':
// 			// Which fields are required
// 			break;
//		
// 		case 'width_overrides':
// 			// Isn't in use at top-level. We'll have to see what happens with nested levels.
// 			break;
// 	}
// }
//
// const NEW_LINE = "%n";
//
// const fieldWidths = {
// 	SHORT: 'SHORT', // "S" and "N" (eventually maybe narrow)
// 	LONG: 'LONG', // "L"
// };
//
// const fields = {
// 	COUNTRY: 'R',
// 	ADDRESS_LINE_1: '1',
// 	ADDRESS_LINE_2: '2',
// 	STREET_ADDRESS: 'A',
// 	ADMIN_AREA: 'S',
// 	LOCALITY: 'C',
// 	DEPENDENT_LOCALITY: 'D',
// 	POSTAL_CODE: 'Z',
// 	SORTING_CODE: 'X',
// 	RECIPIENT: 'N',
// 	ORGANIZATION: 'O',
// };
//
// function getDefaultWidthType(field) {
// 	if (field === fields.POSTAL_CODE || field === fields.SORTING_CODE) {
// 		return fieldWidths.SHORT;
// 	}
//	
// 	return fieldWidths.LONG;
// }

// AddressField.STREET_ADDRESS gets converted on-the-fly to ADDRESS_LINE_1 and ADDRESS_LINE_2
// "require" is set to the keys that are required, i.e. "ACSZ" for US (Address, Locality, Admin Area, Postal)
// "upper" is set to the values that are upper-cased, i.e. "CS" for US (Locality and Admin Area)


// NOTES:

// Example string: "%C:L%S:S"
// This is field 'C' (locality) is size 'L' (long) and 'S' (admin area) is 'S' (short)

// sub_keys always holds the "value", and sometimes the label. If sub_names exists,
// then we use that.


// "zip_name_type": "postal",
// "state_name_type": "province",
// "locality_name_type": "city",
// "sublocality_name_type": "suburb"

// 'administrative_area',
// 		'locality',
// 		'sublocality',
// 		'postal',
