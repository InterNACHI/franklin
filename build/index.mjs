#!/usr/bin/env node --no-warnings

import getCountryCodes from './get-country-codes.mjs';
import getInternationalizationStrings from './get-i18n-strings.mjs';
import getCountry from './get-country.mjs';
import { getLabelMap } from './i18n.mjs';
import { getMap } from './memoize-strings.mjs';

(async function run() {
	try {
		const countries = {};
		
		// These will be maps that are used for optimization
		const formats = new Set();
		const postal_code_labels = new Set();
		const administrative_area_labels = new Set();
		const locality_labels = new Set();
		const sublocality_labels = new Set();
		const required_field_configs = new Set();
		
		const country_codes = await getCountryCodes();
		
		for (const country_code of country_codes) {
			const country = await getCountry(country_code);
			
			formats.add(country.definition.fmt);
			postal_code_labels.add(country.definition.zip_name_type);
			administrative_area_labels.add(country.definition.state_name_type);
			locality_labels.add(country.definition.locality_name_type);
			sublocality_labels.add(country.definition.sublocality_name_type);
			required_field_configs.add(country.definition.require);
			
			countries[country_code] = country;
			
			console.log(await country.compress());
		}
		
		console.log(getLabelMap(), getMap('grid'), getMap('required'));
		
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();


/*

import { Buffer } from 'buffer';
import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';
import expandCountry from '@internachi/franklin/helpers/expandCountry';
import { COUNTRY, expand, expandFlags, FIELDS } from '@internachi/franklin/helpers/mappers';

async function run() {
	try {
		let countries = await getCountries();
		
		const all_compressed = [], all_expanded = [];
		const all_subdivisions = {};
		
		for (const country_code of countries) {
			const country = await getCountry(country_code);
			
			const compressed = await country.compress();
			const expanded = expandCountry(compressed);
			
			expanded.subdivisions.forEach(subdivision => {
				if (subdivision.name in all_subdivisions) {
					all_subdivisions[subdivision.code]++;
				} else {
					all_subdivisions[subdivision.code] = 1;
				}
			});
			
			all_compressed.push(compressed);
			all_expanded.push(expanded);
		}
		
		console.log(Object.keys(all_subdivisions).length);
		process.exit(5);
		
		all_compressed.sort((a, b) => a[1].localeCompare(b[1]));
		
		const expanded_bytes = Buffer.byteLength(JSON.stringify(all_expanded), 'utf8');
		const expanded_kb = Math.round(expanded_bytes / 1000);
		
		const compressed_bytes = Buffer.byteLength(JSON.stringify(all_compressed), 'utf8');
		const compressed_kb = Math.round(compressed_bytes / 1000);
		
		console.log(`Expanded:   ${ expanded_kb } K`);
		console.log(`Compressed: ${ compressed_kb } K`);
		console.log('');
		
		const filename = write(all_compressed);
		console.log(`Wrote to ${ filename }`);
		console.log('');
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
}

function write(data) {
	const filename = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'franklin', `data.json`);
	
	writeFileSync(filename, JSON.stringify(data));
	
	return filename;
}

// What we need:
//  - Country Code
//  - Country Name
//  - Grid
//  - Labels
//  - Validation
//  - Required
//  - Drop-Down Values

function debug(country) {
	const compressed = country.compress();
	const expanded = expand(compressed, COUNTRY);
	expanded.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
	console.log('Original:');
	console.log(JSON.stringify(country, null, 2));
	console.log('');
	console.log('Compressed:');
	console.log(JSON.stringify(compressed, null, 2));
	console.log('');
	console.log('Expanded:');
	console.log(JSON.stringify(expanded, null, 2));
	console.log('\n\n--------------------\n\n');
}

run();

*/
