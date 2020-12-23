import get from './get.mjs';

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

let defaults = null;

export default async function getCountry(country) {
	const data = await get(country.toUpperCase());
	
	for (let key of lists) {
		if (key in data) {
			data[key] = data[key].split('~');
		}
	}
	
	if (null === defaults && 'ZZ' !== country) {
		defaults = await getCountry('ZZ');
	}
	
	// Example string: "%C:L%S:S"
	// This is field 'C' (locality) is size 'L' (long) and 'S' (admin area) is 'S' (short)
	
	return {
		...defaults,
		...data,
	};
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
