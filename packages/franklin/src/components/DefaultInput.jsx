import React from 'react';

export function DefaultInput({ className, inputProps }) {
	return (
		<input 
			className={ className } 
			type="text" 
			{ ...inputProps } 
		/>
	);
}

export default DefaultInput;
