import React from 'react';

export function DefaultOption({ label, optionProps, className }) {
	return (
		<option className={ className } { ...optionProps }>
			{ label }
		</option>
	);
}

export default DefaultOption;
