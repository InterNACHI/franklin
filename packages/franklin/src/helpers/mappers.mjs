export const LABELS = 1;
export const FIELDS = 2;
export const COUNTRY = 3;
export const ADMINISTRATIVE_AREAS = 4;
export const PATTERNS = 5;

const definitions = {
	[FIELDS]: [
		'country',
		'address1',
		'address2',
		'administrative_area',
		'locality',
		'sublocality',
		'sorting_code',
		'postal_code',
	],
	[COUNTRY]: [
		'code',
		'name',
		'grid',
		'labels',
		'required',
		'administrative_areas',
		'patterns',
		'examples',
	],
	[ADMINISTRATIVE_AREAS]: [
		'keys',
		'names',
		'latin_names',
	],
	[PATTERNS]: [
		'postal_code',
	],
};

const defaults = {
	[FIELDS]: {
		country: 'Country',
		address1: 'Address',
		address2: 'Address Line 2',
		administrative_area: 'Province',
		locality: 'City',
		sublocality: 'Suburb',
		postal_code: 'Postal',
		sorting_code: 'Sorting Code',
	},
};

export function compress(data, kind) {
	const compressed = [...definitions[kind]]
		.map((key, index) => {
			const value = 'undefined' === typeof data[key] || null === data[key]
				? -1
				: data[key];
			
			return kind in defaults && key in defaults[kind] && value === defaults[kind][key]
				? -1
				: value;
		});
	
	// Remove empty values from the end of the array
	while (-1 === compressed[compressed.length - 1]) {
		compressed.pop();
	}
	
	return compressed;
}

export function expand(data, kind, map = []) {
	const loadCompressedValue = (index) => {
		return 'undefined' === typeof data[index]
			? -1
			: data[index];
	};
	
	const expandValue = (key, value) => {
		value = -1 === value && kind in defaults && key in defaults[kind]
			? defaults[kind][key]
			: value;
		
		// We use -1 to store nulls because it saves a few bytes
		if (-1 === value) {
			value = null;
		}
		
		return 'number' === typeof value && map.length > value
			? map[value]
			: value;
	};
	
	return [...definitions[kind]]
		.reduce((expanded, key, index) => {
			const value = loadCompressedValue(index);
			
			expanded[key] = expandValue(key, value);
			
			return expanded;
		}, {});
}

export function expandFields(chars) {
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
	
	return chars.split('').map(char => fields[char] || false);
}
