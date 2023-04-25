#!/usr/bin/env node --no-warnings

import { Buffer } from 'buffer';
import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import getCountryCodes from './get-country-codes.mjs';
import getCountry from './get-country.mjs';
import { getLabelMap } from './i18n.mjs';
import { getMap } from './memoize-strings.mjs';
import getTimezones from './get-timezones.mjs';

(async function run() {
	console.log('');
	console.log('Building optimized JSON...');
	
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
			
			countries[country_code] = await country.compress();
		}
		
		const data = {
			countries,
			tz: getTimezones(),
			labels: getLabelMap(),
			grids: getMap('grid'),
			required: getMap('required'),
		};
		
		stats(data);
		
		const filename = write(data);
		
		console.log(`Wrote to ${ filename }`);
		console.log('');
		
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();

function stats(data) {
	const compressed_bytes = Buffer.byteLength(JSON.stringify(data), 'utf8');
	const compressed_kb = Math.round(compressed_bytes / 1000);
	
	console.log('');
	console.log(`Total Countries: ${ Object.keys(data.countries).length }`);
	console.log(`Size before gzip: ${ compressed_kb } K`);
	console.log('');
}

function write(data) {
	const filename = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'franklin', `data.json`);
	
	writeFileSync(filename, JSON.stringify(data));
	
	return filename;
}
