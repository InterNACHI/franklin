import createId from './createId.mjs';

export default function(props) {
	props = setDefault(props, 'createId', createId);
	
	return props;
}

function setDefault(props, name, defaultImplementation) {
	if (!(name in props)) {
		props[name] = defaultImplementation;
	}
	
	return props;
}
