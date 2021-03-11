import React, { useState } from 'react';
import data from '../../data.json';
import expandCountry from '../helpers/expandCountry.mjs';
import Wrapper from './Wrapper.jsx';
import DefaultLabel from './DefaultLabel.jsx';
import createId from '../core/defaults/createId.mjs';
import DefaultSelect from './DefaultSelect.jsx';
import DefaultOption from './DefaultOption.jsx';
import DefaultInput from './DefaultInput.jsx';
import getClassName from '../helpers/getClassName.mjs';

// This takes our compressed country data and converts it to a typical
// JSON structure that's easy to work with.
const countries = [...data].reduce((data, compressed) => {
	const country = expandCountry(compressed);
	data[country.code] = country;
	return data;
}, {});

// console.log(countries);

const AddressContext = React.createContext({});

export function Address(props) {
	const {
		name = 'address',
		defaultCountry = 'US',
		components: componentOverrides = {},
		value: originalValues = {},
	} = props;
	
	// All components can be overwritten by passing a new React component
	// in through the `components` prop. By default, all components have
	// as little markup as necessary.
	const {
		Grid = Wrapper,
		GridRow = Wrapper,
		GridColumn = Wrapper,
		Label = DefaultLabel,
		Select = DefaultSelect,
		Option = DefaultOption,
		Input = DefaultInput,
	} = componentOverrides;
	
	// Once we've applied the default implementations, we'll push them back
	// into a `components` object so that we can easily pass them down into children.
	const components = {
		Grid,
		GridRow,
		GridColumn,
		Label,
		Select,
		Option,
		Input,
	};
	
	// If `classNames.x` is passed into the props, we'll use that. Otherwise,
	// we default to something like `franklin__x`
	const classNames = {
		grid: getClassName('grid', props),
		gridRow: getClassName('gridRow', props),
		gridColumn: getClassName('gridColumn', props),
		label: getClassName('label', props),
		select: getClassName('select', props),
		option: getClassName('option', props),
		input: getClassName('input', props),
	};
	
	const [values, setAllValues] = useState(() => ({
		country: defaultCountry,
		address1: '',
		address2: '',
		administrative_area: '',
		locality: '',
		sublocality: '',
		postal_code: '',
		sorting_code: '',
		...originalValues,
	}));
	const setValue = (key, value) => setAllValues({...values, [key]: value });
	
	const country = countries[values.country];
	const countryId = createId(name, 'country', 'select');
	
	return (
		<Grid className={ classNames.grid }>
			
			{/* JSON representation of data */ }
			<input 
				type="hidden" 
				name={`${name}[json]`} 
				value={JSON.stringify(values)} 
			/>
			
			{/* Country Select Box */ }
			<GridRow className={ classNames.gridRow }>
				<SelectColumn
					components={ components }
					classNames={ classNames }
					name={ `${ name }[country]` }
					value={ values.country }
					options={ Object.values(countries).map(country => ({ label: country.name, value: country.code })) }
					label={ country.labels.country }
					required={ true }
					id={ countryId }
					onChange={ value => setValue('country', value) }
				/>
			</GridRow>
			
			{/* Dynamic Grid */ }
			{ country.grid.map((row, index) => <Row
				key={ `row-${ index }` }
				name={ name }
				row={ row }
				classNames={ classNames }
				components={ components }
				country={ country }
				values={ values }
				setValue={ setValue }
			/>) }
		</Grid>
	);
}

function Row(props) {
	const { name, row, components, classNames, country, values, setValue } = props;
	const { GridColumn, Select, Input } = components;
	
	const columns = Object.entries(row)
		.filter(([_, enabled]) => enabled)
		.map(([key]) => key);
	
	return (
		<div className={ classNames.gridRow }>
			{ columns.map(columnName => (
				<GridColumn key={columnName} className={ classNames.gridColumn }>
					<Column
						components={ components }
						classNames={ classNames }
						country={ country }
						inputName={ name }
						name={ columnName }
						value={ values[columnName] }
						onChange={ value => setValue(columnName, value) }
					/>
				</GridColumn>
			)) }
		</div>
	);
}

function Column(props) {
	const { inputName, name, value, components, classNames, country, onChange } = props;
	const { labels, required, subdivisions } = country;
	const label = labels[name];
	
	if ('administrative_area' === name && subdivisions.length) {
		const options = subdivisions.map(subdivision => {
			const option = { label: subdivision.name, value: subdivision.code };
			if (subdivision.latinName !== null && subdivision.latinName !== subdivision.name) {
				option.label += ` (${subdivision.latinName})`;
			}
			return option;
		});
		
		options.unshift({ label: '--', value: '' });
		
		return <SelectColumn
			components={ components }
			classNames={ classNames }
			name={ `${ inputName }[${name}]` }
			value={ value }
			label={ label }
			id={ createId(name, name, 'select') }
			required={ required[name] }
			onChange={ value => onChange(value) }
			options={ options }
		/>;
	}
	
	const id = createId(name, name, 'input');
	return <InputColumn
		components={ components }
		classNames={ classNames }
		name={ `${ inputName }[${ name }]` }
		value={ value }
		label={ label }
		id={ createId(name, name, 'select') }
		required={ required[name] }
		onChange={ value => onChange(value) }
	/>;
}

function SelectColumn(props) {
	const {
		components,
		classNames,
		name,
		value,
		label,
		id,
		required,
		onChange,
		options,
	} = props;
	
	const {
		GridColumn,
		Label,
		Select,
		Option,
	} = components;
	
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
						optionProps={ { value: option.value } }
						className={ classNames.option }
						label={ option.label }
					/>
				) }
			</Select>
		</GridColumn>
	);
}

function InputColumn(props) {
	const {
		components,
		classNames,
		name,
		value,
		label,
		id,
		required,
		onChange,
	} = props;
	
	const {
		GridColumn,
		Label,
		Input,
	} = components;
	
	return (
		<GridColumn className={ classNames.gridColumn }>
			<Label
				label={ label }
				required={ required }
				labelProps={ { htmlFor: id } }
				className={ classNames.label }
			/>
			<Input
				key={ name }
				className={ classNames.input }
				inputProps={ {
					id,
					name,
					autoCorrect: "off",
					autoComplete: autoComplete(name),
					spellCheck: "false",
					required: required[name],
					"aria-required": required[name],
					onChange: e => onChange(e.target.value),
				} }
			/>
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
