import { expand, expandFlags } from './mappers.mjs';
import data from './data.json';
import expandCountry from './country.mjs';

window.expand = expand;
window.expandFlags = expandFlags;
window.addressData = data.reduce((data, compressed) => {
	const country = expandCountry(compressed);
	data[country.code] = country;
	return data;
}, {});
