
const definitions = {
	labels: [
		'administrative_area',
		'locality',
		'sublocality',
		'postal',
	],
	fields: [
		'country',
		'address1',
		'address2',
		'admin_area',
		'locality',
		'dependent_locality',
		'postal_code',
		'sorting_code',
	],
};

const defaults = {
	labels: {
		administrative_area: 'State',
		locality: 'City',
		sublocality: 'Suburb',
		postal: 'Zip',
	},
};

export function compress(data, kind) {
	const compressed = [...definitions[kind]]
		.map((key, index) => {
			const value = data[key];
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

export function extract(data, kind) {
	return [...definitions[kind]].reduce((carry, key, index) => {
		const value = 'undefined' === typeof data[index]
			? 0
			: data[index];
		
		carry[key] = 0 === value && kind in defaults && key in defaults[kind]
			? defaults[kind][key]
			: value;
		
		return carry;
	}, {});
}
