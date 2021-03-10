export const LABELS = 1;
export const FIELDS = 2;
export const COUNTRY = 3;
export const SUBDIVISION = 4;

const definitions = {
	[FIELDS]: [
		'country',
		'address1',
		'address2',
		'administrative_area',
		'locality',
		'sublocality',
		'postal_code',
		'sorting_code',
	],
	[COUNTRY]: [
		'code',
		'name',
		'grid',
		'labels',
		'required',
		'subdivisions',
	],
	[SUBDIVISION]: [
		'code',
		'name',
		'latinName',
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
				? 0
				: data[key];
			
			return kind in defaults && key in defaults[kind] && value === defaults[kind][key]
				? 0
				: value;
		});
	
	// Remove empty values from the end of the array
	while (0 === compressed[compressed.length - 1]) {
		compressed.pop();
	}
	
	return compressed;
}

export function compressFlags(flags, kind) {
	return [...definitions[kind]]
		.reduce((compressed, key, index) => {
			const flag = Math.pow(2, index);
			return true === flags[key]
				? compressed | flag
				: compressed;
		}, 0);
}

export function expand(data, kind) {
	return [...definitions[kind]]
		.reduce((expanded, key, index) => {
			const value = 'undefined' === typeof data[index]
				? 0
				: data[index];
			
			expanded[key] = 0 === value && kind in defaults && key in defaults[kind]
				? defaults[kind][key]
				: value;
			
			return expanded;
		}, {});
}

export function expandFlags(flags, kind) {
	return [...definitions[kind]]
		.reduce((expanded, key, index) => {
			const flag = Math.pow(2, index);
			expanded[key] = (flags & flag) > 0;
			return expanded;
		}, {});
}
