import getTerritories from './get-territories.mjs';
import { compress, COUNTRY, FIELDS, ADMINISTRATIVE_AREAS } from '@internachi/franklin/helpers/mappers';
import { getLabel } from './i18n.mjs';
import { memoize } from './memoize-strings.mjs';

let territories = null;

export default class Country {
	constructor(definition) {
		this.definition = normalize(definition);
	}
	
	async compress() {
		return compress({
			code: this.definition.key,
			name: await getName(this.definition),
			grid: buildGrid(this.definition),
			labels: await buildLabels(this.definition),
			required: buildRequired(this.definition),
			administrative_areas: buildAdministrativeAreas(this.definition),
		}, COUNTRY);
	}
}

async function getName(definition) {
	if (null === territories) {
		territories = await getTerritories();
	}
	
	if (definition.key in territories) {
		return territories[definition.key];
	}
	
	return definition.name;
}

async function buildLabels(definition) {
	return compress({
		postal_code: await getLabel(definition.zip_name_type),
		administrative_area: await getLabel(definition.state_name_type),
		locality: await getLabel(definition.locality_name_type),
		sublocality: await getLabel(definition.sublocality_name_type),
	}, FIELDS);
}


function buildGrid(definition) {
	const fields = ['R', '1', '2', 'A', 'S', 'C', 'D', 'Z', 'X', 'n'];
	
	const grid = [...definition.fmt.matchAll(/%([a-z])/gi)]
		.reduce((grid, [_, char]) => {
			if (-1 === fields.indexOf(char)) {
				return grid;
			}
			
			return grid + char;
		}, '')
		.replace(/n+/g, '~')
		.replace(/(^~|~$)/g, '')
		.replace(/[12]+/, 'A');
	
	return memoize('grid', grid);
}

function buildRequired(definition) {
	if (!('require' in definition)) {
		return '';
	}
	
	return memoize('required', definition.require);
}

function buildAdministrativeAreas(definition) {
	// Extract data
	let { 
		sub_keys = null,
		sub_names = null,
		sub_lnames = null,
	} = definition;
	
	if (null === sub_keys) {
		return [];
	}
	
	if (sub_names === sub_keys) {
		sub_names = null;
	}
	
	if (sub_lnames === sub_names) {
		sub_lnames = null;
	}
	
	return compress({
		keys: sub_keys,
		names: sub_names,
		latin_names: sub_lnames,
	}, ADMINISTRATIVE_AREAS);
}

function normalize(definition) {
	const lists = [
		'sub_keys',
		'sub_names',
		'sub_lnames',
		'sub_isoids',
		'sub_zips',
		'sub_zipexs',
		'sub_mores',
		'languages',
	];
	
	for (let key of lists) {
		if (key in definition) {
			definition[`${ key }_list`] = definition[key].split('~');
		}
	}
	
	return definition;
}
