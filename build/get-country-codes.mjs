import get from './get.mjs';

export default async function() {
	const country_data = await get('');
	return country_data.countries.split('~');
}
