import get from './get.mjs';

export default async function(country) {
	const data = await get(country.toUpperCase());
	
	return data;
}
