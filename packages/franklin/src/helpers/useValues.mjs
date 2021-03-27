import { useState, useEffect } from 'react';

const empty = {
	country: '',
	address1: '',
	address2: '',
	administrative_area: '',
	locality: '',
	sublocality: '',
	postal_code: '',
	sorting_code: '',
};

export function useValues(defaultCountry = 'US', originalValues = {}, onChange = noop => noop) {
	const [allValues, setAllValues] = useState(() => ({
		...empty,
		country: defaultCountry,
		...originalValues,
	}));
	
	const setValue = (key, value) => {
		let nextValue = { ...allValues, [key]: value };
		
		if (nextValue.country !== allValues.country) {
			nextValue = { 
				...empty, 
				country: nextValue.country,
				address1: nextValue.address1,
				address2: nextValue.address2,
			};
		}
		
		setAllValues(nextValue);
		
		return nextValue;
	}
	
	useEffect(() => onChange(allValues), [allValues]);
	
	return [allValues, setValue];
}

export default useValues;
