
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
	return [...definitions[kind]]
		.map((key, index) => {
			const value = data[key];
			return kind in defaults && key in defaults[kind] && value === defaults[kind][key]
				? 0
				: value;
		});
}

export function extract(data, kind) {
	return [...definitions[kind]].reduce((carry, key, index) => {
		carry[key] = 0 === data[index] && kind in defaults && key in defaults[kind]
			? defaults[kind][key]
			: data[index];
		return carry;
	}, {});
}
