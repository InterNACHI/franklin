import { compress, SUBDIVISION } from '../../src/mappers.mjs';

export default class Subdivision
{
	constructor(key, name, postal_pattern) {
		this.key = key;
		this.name = name;
		this.postal_pattern = postal_pattern;
	}
	
	compress() {
		return compress({
			code: this.key,
			name: this.name,
		}, SUBDIVISION);
	}
}
