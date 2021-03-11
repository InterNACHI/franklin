
// If `classNames.x` is passed into the props, we'll use that. Otherwise,
// we default to something like `franklin__x`
export function getClassNames(props)
{
	return {
		grid: getClassName('grid', props),
		gridRow: getClassName('gridRow', props),
		gridColumn: getClassName('gridColumn', props),
		label: getClassName('label', props),
		select: getClassName('select', props),
		option: getClassName('option', props),
		input: getClassName('input', props),
	};
}

export function getClassName(name, props) {
	if ('classNames' in props && name in props.classNames) {
		return props.classNames[name];
	}
	
	return `franklin__${ name }`;
}

export default getClassNames;
