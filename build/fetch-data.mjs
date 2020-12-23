#!/usr/bin/env node --no-warnings

import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';

async function run() {
	const countries = await getCountries();
	const defaults = await getCountry('ZZ');
	
	countries.forEach(async country => {
		try {
			const countryData = await getCountry(country);
			console.log(countryData);
		} catch (e) {
			console.error(e);
		}
	});
}

run();
