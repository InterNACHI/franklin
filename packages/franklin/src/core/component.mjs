import defaults from './defaults/index.mjs';

export default function(Fragment, useContext, useState) {
	return function(props) {
		const {
			name = 'address',
			createId
		} = defaults(props);
		
		const id = createId(name);
		
		return (
			<div key={ id } id={ id }>
				{ id }
			</div>
		);
	};
}
