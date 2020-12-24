#!/usr/bin/env node --no-warnings

import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';
import getTerritories from './get-territories.mjs';

async function run() {
	const countries = await getCountries();
	const CA = await getCountry('CA');
	console.log(CA);
}

run();
