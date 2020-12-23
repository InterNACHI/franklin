import Subdivision from './Subdivision.mjs';

// 	"id": "data/ZZ",
// 	"fmt": "%N%n%O%n%A%n%C",
// 	"require": "AC",
// 	"upper": "C",
// 	"zip_name_type": "postal",
// 	"state_name_type": "province",
// 	"locality_name_type": "city",
// 	"sublocality_name_type": "suburb"

export default class Country
{
	constructor(definition)
	{
		Object.entries(normalize(definition)).forEach(([key, value]) => {
			this[key] = value;
		});
	}
}

function normalize(definition) {
	definition = expandLists(definition);
	definition = buildRegularExpressions(definition);
	definition = buildSubdivisions(definition);
	
	return definition;
}

function buildSubdivisions(original) {
	let { sub_keys = null, sub_names = [], sub_zips = [], ...definition } = original;
	
	if (null !== sub_keys) {
		definition.subdivisions = sub_keys.map((key, index) => {
			const name = ('undefined' !== typeof sub_names[index])
				? sub_names[index]
				: null;
			
			const postal_pattern = ('undefined' !== typeof sub_zips[index])
				? new RegExp(`^${ sub_zips[index] }`, 'i')
				: null;
			
			return new Subdivision(key, name, postal_pattern);
		});
	}
	
	return definition;
}

function buildRegularExpressions(definition) {
	if (!('zip' in definition)) {
		definition.zip = '.*';
	}
	
	definition.zip = new RegExp(`^${definition.zip}$`, 'i');
	
	return definition;
}

function expandLists(definition) {
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

function extract(country, key) {
	switch (key) {
		case 'fmt':
			// Get format
			break;
		
		case 'lfmt':
			// The latin format string used when a country defines an alternative format for
			// use with the latin script, such as in China.
			break;
		
		case 'lang':
			// Default language
			break;
		
		case 'languages':
			// List of all languages
			// Separated by ~
			break;
		
		case 'state_name_type':
			// Name for admin area / state
			break;
		
		case 'locality_name_type':
			// Name for locality / city
			break;
		
		case 'sublocality_name_type':
			// Name for sub-locality
			break;
		
		case 'zip_name_type':
			break;
		
		case 'require':
			// Which fields are required
			break;
		
		case 'width_overrides':
			// Isn't in use at top-level. We'll have to see what happens with nested levels.
			break;
	}
}

// NOTES:

// Example string: "%C:L%S:S"
// This is field 'C' (locality) is size 'L' (long) and 'S' (admin area) is 'S' (short)

// sub_keys always holds the "value", and sometimes the label. If sub_names exists,
// then we use that.
