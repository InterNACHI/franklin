
export default class Subdivision
{
	constructor(key, name, postal_pattern) {
		this.key = key;
		this.name = name;
		this.postal_pattern = postal_pattern;
	}
	
	export() {
		return [
			this.key,
			this.key === this.name ? null : this.name,
		];
	}
}
