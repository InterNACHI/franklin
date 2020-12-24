#!/usr/bin/env node --no-warnings

import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';
import { compress, extract } from '../src/mappers.mjs';

async function run() {
	// const countries = await getCountries();
	// const CA = await getCountry('CA');
	// console.log(CA);
	
	const input = {
		locality: 'City',
		administrative_area: 'Province',
		postal: 'Postal Code',
		sublocality: 'Suburb',
	};
	
	const compressed = compress(input, 'labels');
	
	console.log('');
	console.log('Input:');
	console.log('');
	console.log(input);
	
	console.log('');
	console.log('Compressed:');
	console.log('');
	console.log(compressed);
	
	console.log('');
	console.log('Extracted:');
	console.log('');
	console.log(extract(compressed, 'labels'));
	console.log('');
	
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
