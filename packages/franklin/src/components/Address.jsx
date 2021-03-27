import React from 'react';
import createId from '../core/defaults/createId.mjs';
import getClassNames from '../helpers/getClassNames.mjs';
import getConfigurableComponents from '../helpers/getConfigurableComponents.mjs';
import useValues from '../helpers/useValues.mjs';
import getAutoComplete from '../helpers/getAutoComplete.mjs';
import Country from '../core/Country.mjs';

export function Address(props) {
	const {
		name = 'address',
		defaultCountry = 'US',
		onChange = noop => noop,
	} = props;
	
	const components = getConfigurableComponents(props.components);
	const classNames = getClassNames(props);
	const [values, setValue] = useValues(defaultCountry, props.value, onChange);
	// const country = countries[values.country];
	// const countryId = createId(name, 'country', 'select');
	
	// FIXME:
	const country = Country.find(values.country);
	return <div>Hello</div>;
	
	const { Grid, GridRow } = components;
	
	return (
		<Grid className={ classNames.grid }>
			
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
	const { GridRow, GridColumn } = components;
	
	const columns = Object.entries(row)
		.filter(([_, enabled]) => enabled)
		.map(([key]) => key);
	
	return (
		<GridRow className={ classNames.gridRow }>
			{ columns.map(columnName => <Column
				key={ columnName }
				components={ components }
				classNames={ classNames }
				country={ country }
				inputName={ name }
				name={ columnName }
				value={ values[columnName] }
				onChange={ value => setValue(columnName, value) }
			/>) }
		</GridRow>
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
				option.label += ` – ${subdivision.latinName}`;
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
					value,
					autoCorrect: "off",
					autoComplete: getAutoComplete(name),
					spellCheck: "false",
					required: required[name],
					"aria-required": required[name],
					onChange: e => onChange(e.target.value),
				} }
			/>
		</GridColumn>
	);
}
