
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

export function compress(data, kind) {
	return [...definitions[kind]].map(key => data[key]);
}

export function extract(data, kind) {
	return [...definitions[kind]].reduce((carry, key, index) => {
		carry[key] = data[index];
		return carry;
	}, {});
}
