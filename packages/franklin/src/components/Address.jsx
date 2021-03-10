import React, { Fragment, useContext, useState } from 'react';
import data from '../../data.json';
import expandCountry from '../helpers/expandCountry.mjs';
import { useId } from '../helpers/useId.mjs';
import Wrapper from './Wrapper.jsx';
import DefaultLabel from './DefaultLabel.jsx';
import createId from '../core/defaults/createId.mjs';
import DefaultSelect from './DefaultSelect.jsx';
import DefaultOption from './DefaultOption.jsx';

const countries = [...data].reduce((data, compressed) => {
	const country = expandCountry(compressed);
	data[country.code] = country;
	return data;
}, {});

const AddressContext = React.createContext({});

export function Address(props) {
	const {
		name = 'address',
		defaultCountry = 'US',
		components = {},
	} = props;
	
	const {
		grid:Grid = Wrapper,
		GridRow = Wrapper,
		GridColumn = Wrapper,
		Label = DefaultLabel,
		Select = DefaultSelect,
		Option = DefaultOption,
	} = components;
	
	const classNames = {
		grid: getClassName('grid', props),
		gridRow: getClassName('gridRow', props),
		gridColumn: getClassName('gridColumn', props),
		label: getClassName('label', props),
		select: getClassName('select', props),
		option: getClassName('option', props),
		input: getClassName('input', props),
	};
	
	const [countryCode, setCountryCode] = useState(defaultCountry);
	const country = countries[countryCode];
	
	const countryId = createId(name, 'country', 'select');
	
	return (
		<Grid className={ classNames.grid }>
			
			{/* Country Select Box */ }
			<GridRow className={ classNames.gridRow }>
				<SelectColumn
					GridColumn={ GridColumn }
					Label={ Label }
					Select={ Select }
					classNames={ classNames }
					name={ `${ name }[country]` }
					value={ countryCode }
					options={ Object.values(countries).map(country => ({ label: country.name, value: country.code })) }
					label={ country.labels.country }
					required={ true }
					id={ countryId }
					onChange={ value => setCountryCode(value) }
				/>
			</GridRow>
			
			{/* Dynamic Grid */ }
			{ country.grid.map(row => (
				<GridRow className={ classNames.gridRow }>
					<GridColumn className={ classNames.gridColumn }>
					</GridColumn>
				</GridRow>
			)) }
		</Grid>
	);
}

function SelectColumn(props) {
	const {
		GridColumn,
		Label,
		Select,
		classNames,
		name,
		value,
		label,
		id,
		required,
		onChange,
		options,
	} = props;
	
	return (
		<GridColumn className={ classNames.gridColumn }>
			<Label
				label={ label }
				required={ required }
				labelProps={ { htmlFor: id } }
				className={ classNames.label }
			/>
			<Select
				selectProps={ {
					id: id,
					value: value,
					name: name,
					onChange: e => onChange(e.target.value),
				} }
				className={ classNames.select }
			>
				{ Object.values(options).map(option =>
					<Option
						key={ option.value }
						optionProps={ { value } }
						className={ classNames.option }
						label={ option.label }
					/>
				) }
			</Select>
		</GridColumn>
	);
}

/*
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
					<option
						style={ { color: 'rgba(0, 0, 0, 0.3)' } }
						className={ classNames.option } value=""
					/>
				) }
				{ subdivisions.map(subdivision => (
					<option className={ classNames.option } value={ subdivision.code } key={ subdivision.code }>
						{ subdivision.name }
						{ subdivision.latinName ? ` (${ subdivision.latinName })` : null }
					</option>
				)) }
			</select>
		</div>
	);
}
*/

function autoComplete(name) {
	const defaults = {
		country: 'country',
		address1: 'address-line1',
		address2: 'address-line2',
		administrative_area: 'address-level1',
		locality: 'address-level2',
		sublocality: 'address-level3',
		postal_code: 'postal-code',
		sorting_code: 'address-level4', // TODO: Verify that sorting code maps to level 4
	};
	
	if (name in defaults) {
		return defaults[name];
	}
	
	return '';
}
