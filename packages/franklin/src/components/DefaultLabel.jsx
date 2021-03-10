import React from 'react';

export function DefaultLabel({ className, labelProps, label, required }) {
	return (
		<label className={ className } { ...labelProps }>
			{ label }
			{ required ? '*' : '' }
		</label>
	);
}

export default DefaultLabel;
