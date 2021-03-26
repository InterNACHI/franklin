
const memoized = {};

export function memoize(key, value)
{
	memoized[key] = memoized[key] || [];
	
	let index = memoized[key].indexOf(value);
	
	if (-1 === index) {
		index = memoized[key].length;
		memoized[key].push(value);
	}
	
	return index;
}

export function getMap(key)
{
	return memoized[key];
}
