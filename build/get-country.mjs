import get from './get.mjs';
import Country, { loadTerritories } from './models/Country.mjs';

let defaults = null;

export default async function getCountry(country) {
	const data = await get(country.toUpperCase());
	
	if (null === defaults && 'ZZ' !== country) {
		defaults = await getCountry('ZZ');
	}
	
	await loadTerritories();
	
	return new Country({
		...defaults,
		...data,
	});
}
