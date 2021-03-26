import getInternationalizationStrings from './get-i18n-strings.mjs';
import { memoize, getMap } from './memoize-strings.mjs';

export async function getLabel(key)
{
	if (!key) {
		return key;
	}
	
	let label = key;
	const strings = await getInternationalizationStrings();
	
	if ('city' === key) {
		key = 'locality_label';
	}
	
	let string_name = `i18n_${ key }`;
	if (string_name in strings) {
		label = strings[string_name];
	} else {
		label = key
			.replace(/_/g, ' ')
			.replace(/(?:^|\s)(\w)/g, letter => letter.toUpperCase());
	}
	
	return memoize('labels', label);
}

export function getLabelMap()
{
	return getMap('labels');
}
