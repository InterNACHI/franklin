#!/usr/bin/env node --no-warnings

import { Buffer } from 'buffer';
import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';
import expandCountry from '../packages/franklin/src/country.mjs';
import { COUNTRY, expand, expandFlags, FIELDS } from '../packages/franklin/src/mappers.mjs';

async function run() {
	try {
		let countries = await getCountries();
		
		const all_compressed = [], all_expanded = [];
		
		for (const country_code of countries) {
			const country = await getCountry(country_code);
			
			const compressed = await country.compress();
			const expanded = expandCountry(compressed);
			
			all_compressed.push(compressed);
			all_expanded.push(expanded);
		}
		
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
