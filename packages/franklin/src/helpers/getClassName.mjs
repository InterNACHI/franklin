export function getClassName(name, props)
{
	if ('classNames' in props && name in props.classNames) {
		return props.classNames[name];
	}
	
	return `franklin__${name}`;
}

export default getClassName;
