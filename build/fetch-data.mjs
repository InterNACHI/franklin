#!/usr/bin/env node --no-warnings

import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';
import { compress, extract } from '../src/mappers.mjs';

async function run() {
	// const countries = await getCountries();
	// const CA = await getCountry('CA');
	// console.log(CA);
	
	const compressed = compress({
		'locality': 'City',
		administrative_area: 'State',
		postal: 'Zip',
		'sublocality': 'Suburb',
	}, 'labels');
	
	console.log(compressed);
	console.log(extract(compressed, 'labels'));
	
	// "zip_name_type": "postal",
	// "state_name_type": "province",
	// "locality_name_type": "city",
	// "sublocality_name_type": "suburb"
	
	// 'administrative_area',
	// 		'locality',
	// 		'sublocality',
	// 		'postal',
}

run();
