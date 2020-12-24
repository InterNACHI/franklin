import React, { Fragment, useContext, useState } from 'react';
import data from '../data.json';
import expandCountry from './country.mjs';
import { useId } from './useId.mjs';

// TODO:
//  - Allow for "common countries" so you can put your most common countries at top of list
//  - Controlled / uncontrolled inputs
//  - More styling control at an input-by-input level
//  - Explore wrapping in web component / jQuery plugin
//  - Allow passing IDs
//  - Validation

const defaultClassNames = {
	container: '',
	select: '',
	option: '',
	grid: '',
	gridRow: '',
	gridColumn: '',
	label: '',
	input: '',
};

const countries = data.reduce((data, compressed) => {
	const country = expandCountry(compressed);
	data[country.code] = country;
	return data;
}, {});

const AddressContext = React.createContext({});

export function Address(props) {
	let {
		defaultCountry = 'US',
		classNames = {},
	} = props;
	
	classNames = { ...defaultClassNames, ...classNames };
	
	const id = useId();
	const [countryCode, setCountryCode] = useState(defaultCountry);
	const country = countries[countryCode];
	
	const label = country.labels.country.replace(/(?:^|\s)(\w{1})/g, letter => letter.toUpperCase());
	
	return (
		<AddressContext.Provider value={ { country, classNames } }>
			<div className={ classNames.container } style={ { boxSizing: 'border-box' } }>
				<div className={ classNames.grid }>
					<div className={ classNames.gridRow }>
						<div className={ classNames.gridColumn }>
							
							<label className={ classNames.label } htmlFor={ id }>
								{ label }
							</label>
							
							<select id={ id } className={ classNames.select } value={ countryCode } onChange={ e => setCountryCode(e.target.value) }>
								{ Object.values(countries).map(country => (
									<option className={ classNames.option } key={ country.code } value={ country.code }>
										{ country.name }
									</option>
								)) }
							</select>
						
						</div>
					</div>
					
					<Grid grid={ country.grid } />
				
				</div>
				
				{/*<pre>{ JSON.stringify(country, null, 2) }</pre>*/ }
			</div>
		</AddressContext.Provider>
	);
}

function Grid({ grid }) {
	return (
		<Fragment>
			{ grid.map(row => <GridRow row={ row } />) }
		</Fragment>
	);
}

function GridRow({ row }) {
	const { classNames } = useContext(AddressContext);
	
	const columns = Object.entries(row)
		.filter(([_, enabled]) => enabled)
		.map(([key]) => key);
	
	return (
		<div className={ classNames.gridRow }>
			{ columns.map(name => <Input name={ name } />) }
		</div>
	);
}

function Input({ name }) {
	const { country, classNames } = useContext(AddressContext);
	const { labels, required, subdivisions } = country;
	const id = useId();
	
	const label = labels[name];
	
	if ('administrative_area' === name && subdivisions.length) {
		return <Subdivisions
			id={ id }
			label={ label }
			name={ name }
			required={ required[name] }
			subdivisions={ subdivisions }
		/>;
	}
	
	return (
		<div className={ classNames.gridColumn }>
			<label className={ classNames.label } htmlFor={ id }>
				{ label }
				{ required[name] ? '*' : '' }
			</label>
			<input
				className={ classNames.input }
				id={ id }
				autoCorrect="off"
				autoComplete={ autoComplete(name) }
				spellCheck="false"
				required={ required[name] }
				aria-required={ required[name] }
				key={ name }
				name={ name }
				type="text"
			/>
		</div>
	);
}

function Subdivisions({ id, name, label, required, subdivisions }) {
	const { classNames } = useContext(AddressContext);
	// const [value, setValue] = useState(required ? Object.keys(subdivisions)[0] : '');
	
	return (
		<div className={ classNames.gridColumn }>
			<label className={ classNames.label } htmlFor={ id }>
				{ label }
				{ required ? '*' : '' }
			</label>
			<select
				// value={ value }
				// onChange={ e => setValue(e.target.value) }
				className={ classNames.select }
				id={ id }
				autoCorrect="off"
				autoComplete={ autoComplete(name) }
				required={ required }
				aria-required={ required }
				key={ name }
				name={ name }
			>
				{ false === required && (
					<option style={ { color: 'rgba(0, 0, 0, 0.3)' } } className={ classNames.option } value="">
						
					</option>
				) }
				{ subdivisions.map(subdivision => (
					<option className={ classNames.option } value={ subdivision.code } key={ subdivision.code }>
						{ subdivision.name }
					</option>
				)) }
			</select>
		</div>
	);
}

function autoComplete(name) {
	const defaults = {
		country: 'country',
		address1: 'address-line1',
		address2: 'address-line2',
		administrative_area: 'address-level1',
		locality: 'address-level2',
		sublocality: 'address-level3',
		postal_code: 'postal-code',
		sorting_code: 'address-level4', // FIXME
	};
	
	if (name in defaults) {
		return defaults[name];
	}
	
	return '';
}
