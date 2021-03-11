import { useState } from 'react';

export function useValues(defaultCountry = 'US', originalValues = {}) {
	const [allValues, setAllValues] = useState(() => ({
		country: defaultCountry,
		address1: '',
		address2: '',
		administrative_area: '',
		locality: '',
		sublocality: '',
		postal_code: '',
		sorting_code: '',
		...originalValues,
	}));
	
	const setValue = (key, value) => setAllValues({ ...allValues, [key]: value });
	
	return [allValues, setValue];
}

export default useValues;
