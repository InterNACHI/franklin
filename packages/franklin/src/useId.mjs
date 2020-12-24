import React from 'react';

// Adapted from https://github.com/reach/reach-ui

let serverHandoffComplete = false;
let id = 0;

const genId = () => ++id;

export function useId(idFromProps) {
	const initialId = idFromProps || (serverHandoffComplete ? genId() : null);
	
	const [id, setId] = React.useState(initialId);
	
	const useIsomorphicLayoutEffect = canUseDOM()
		? React.useLayoutEffect
		: React.useEffect;
	
	useIsomorphicLayoutEffect(() => {
		if (null === id) {
			setId(genId());
		}
	}, []);
	
	React.useEffect(() => {
		serverHandoffComplete = true;
	}, []);
	
	return id != null 
		? `frnkln-${id}`
		: undefined;
}

function canUseDOM() {
	return !!(
		typeof window !== "undefined" &&
		window.document &&
		window.document.createElement
	);
}
