import React from 'react';

export function DefaultSelect({ children, className, selectProps }) {
	return (
		<select className={ className } { ...selectProps }>
			{ children }
		</select>
	);
}

export default DefaultSelect;
