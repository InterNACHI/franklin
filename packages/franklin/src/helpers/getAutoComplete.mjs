
export function getAutoComplete(name)
{
	const defaults = {
		country: 'country',
		address1: 'address-line1',
		address2: 'address-line2',
		administrative_area: 'address-level1',
		locality: 'address-level2',
		sublocality: 'address-level3',
		postal_code: 'postal-code',
		sorting_code: 'address-level4', // TODO: Verify that sorting code maps to level 4
	};
	
	return (name in defaults)
		? defaults[name]
		: '';
}

export default getAutoComplete;
