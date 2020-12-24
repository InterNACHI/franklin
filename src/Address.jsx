import React, { useContext, useState } from 'react';
import data from './data.json';
import expandCountry from './country.mjs';

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
	
	const [countryCode, setCountryCode] = useState(defaultCountry);
	const country = countries[countryCode];
	
	return (
		<AddressContext.Provider value={ { country, classNames } }>
			<div className={ classNames.container } style={ { boxSizing: 'border-box' } }>
				<select className={ classNames.select } value={ countryCode } onChange={ e => setCountryCode(e.target.value) }>
					{ Object.values(countries).map(country => (
						<option className={ classNames.option } key={ country.code } value={ country.code }>
							{ country.name }
						</option>
					)) }
				</select>
				<Grid grid={ country.grid } />
				{/*<pre>{ JSON.stringify(country, null, 2) }</pre>*/}
			</div>
		</AddressContext.Provider>
	);
}

function Grid({ grid }) {
	const { classNames } = useContext(AddressContext);
	return (
		<div className={ classNames.grid }>
			{ grid.map(row => <GridRow row={ row } />) }
		</div>
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
	const id = `input-${ name }`; // FIXME
	
	const label = labels[name].replace(/(?:^|\s)(\w{1})/g, letter => letter.toUpperCase());
	
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
	
	return (
		<div className={ classNames.gridColumn }>
			<label className={ classNames.label } htmlFor={ id }>
				{ label }
				{ required ? '*' : '' }
			</label>
			<select
				className={ classNames.select }
				id={ id }
				autoCorrect="off"
				autoComplete={ autoComplete(name) }
				required={ required }
				aria-required={ required }
				key={ name }
				name={ name }
			>
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
