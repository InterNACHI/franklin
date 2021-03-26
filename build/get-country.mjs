import get from './get.mjs';
import Country from './Country.mjs';

let defaults = null;

export default async function getCountry(country_code) {
	const data = await get(country_code.toUpperCase());
	
	if (null === defaults && 'ZZ' !== country_code) {
		defaults = await get('ZZ');
	}
	
	return new Country({
		...defaults,
		...data,
	});
}
