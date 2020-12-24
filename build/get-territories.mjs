import get from './get.mjs';

export default async function getTerritories(locale = 'en') {
	const root = 'https://raw.githubusercontent.com/unicode-org/cldr-json/master/cldr-json/cldr-localenames-full/main';
	const path = `${locale}/territories.json`;
	
	const data = await get(path, root);
	
	return data.main[locale].localeDisplayNames.territories;
}
