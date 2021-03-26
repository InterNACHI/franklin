import xml2js from 'xml2js';
import get from './get.mjs';

let strings = {};

export default async function() {
	if (0 === Object.keys(strings).length) {
		const root = 'https://raw.githubusercontent.com/google/libaddressinput/master/android/src/main/res/values';
		const path = 'address_strings.xml';
		
		const xml = await get(path, root, false);
		const data = await xml2js.parseStringPromise(xml);
		
		data.resources.string.forEach(node => {
			strings[node.$.name] = node._;
		});
	}
	
	return strings;
}
