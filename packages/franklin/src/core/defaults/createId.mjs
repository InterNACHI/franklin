'use strict';

export default function createId(name, field = '', element = '') {
	return ['franklin', name, field, element]
		.filter(segment => '' !== segment)
		.join('-');
}
