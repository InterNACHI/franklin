import React from 'react';
import createId from '../helpers/createId.mjs';
import getClassNames from '../helpers/getClassNames.mjs';
import getConfigurableComponents from '../helpers/getConfigurableComponents.mjs';
import useValues from '../helpers/useValues.mjs';
import getAutoComplete from '../helpers/getAutoComplete.mjs';
import Country from '../models/Country.mjs';

const AddressContext = React.createContext();

export function Address(props) {
	const {
		name = 'address',
		defaultCountry = 'US',
		onChange = noop => noop,
		enforceRequired = true,
		validate = true,
	} = props;
	
	const components = getConfigurableComponents(props.components);
	const classNames = getClassNames(props);
	const [values, setValue] = useValues(defaultCountry, props.value, onChange);
	const country = Country.find(values.country);
	const countryId = createId(name, 'country', 'select');
	
	const context = {
		name,
		enforceRequired,
		validate,
		country: Country.find(values.country),
		classNames: getClassNames(props),
		components: getConfigurableComponents(props.components),
	};
	
	const { Grid, GridRow } = components;
	
	return (
		<AddressContext.Provider value={ context }>
			<Grid className={ context.classNames.grid }>
				
				{/* Country Select Box */ }
				<GridRow className={ context.classNames.gridRow }>
					<SelectColumn
						components={ components }
						classNames={ classNames }
						name={ `${ name }[country]` }
						value={ values.country }
						options={ Country.forSelection() }
						label={ country.labels.country }
						required={ true }
						id={ countryId }
						onChange={ value => setValue('country', value) }
					/>
				</GridRow>
				
				{/* Dynamic Grid */ }
				{ country.grid.map((row, index) => <Row
					key={ index }
					name={ name }
					row={ row }
					classNames={ classNames }
					components={ components }
					country={ country }
					values={ values }
					setValue={ setValue }
				/>) }
			</Grid>
		</AddressContext.Provider>
	);
}

function Row(props) {
	const { name, row, components, classNames, country, values, setValue } = props;
	const { GridRow } = components;
	
	return (
		<GridRow className={ classNames.gridRow }>
			{ row.map(field => <Column
				key={ field }
				components={ components }
				classNames={ classNames }
				country={ country }
				inputName={ name }
				name={ field }
				value={ values[field] }
				onChange={ value => setValue(field, value) }
			/>) }
		</GridRow>
	);
}

function Column(props) {
	const { inputName, name, value, components, classNames, country, onChange } = props;
	const { administrative_areas } = country;
	const label = country.getLabel(name);
	
	if ('administrative_area' === name && administrative_areas.length) {
		const options = administrative_areas.map(administrative_area => {
			const option = { label: administrative_area.name, value: administrative_area.code };
			if (administrative_area.latin_name !== null && administrative_area.latin_name !== administrative_area.name) {
				option.label += ` – ${ administrative_area.latin_name }`;
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
			required={ country.isRequired(name) }
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
		required={ country.isRequired(name) }
		onChange={ value => onChange(value) }
		pattern={ country.getPattern(name) }
		title={ country.getDescription(name) }
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
		pattern,
		title,
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
					pattern,
					required,
					title,
					autoCorrect: "off",
					autoComplete: getAutoComplete(name),
					spellCheck: "false",
					"aria-required": required,
					onChange: e => onChange(e.target.value),
				} }
			/>
		</GridColumn>
	);
}
