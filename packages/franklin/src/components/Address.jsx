import React, { useContext } from 'react';
import createId from '../helpers/createId.mjs';
import getClassNames from '../helpers/getClassNames.mjs';
import getConfigurableComponents from '../helpers/getConfigurableComponents.mjs';
import useValues from '../helpers/useValues.mjs';
import getAutoComplete from '../helpers/getAutoComplete.mjs';
import Country from '../models/Country.mjs';
import prependAutoDetectedCountries from '../helpers/autodetect.js';

const AddressContext = React.createContext({});

export function Address(props) {
	const {
		name = 'address',
		onChange = noop => noop,
		enforceRequired = true,
		validate = true,
		asJSON = false,
		autodetect = true,
	} = props;
	
	// This may be mutated by the auto-detection process
	let {
		defaultCountry = null,
		preferredCountries = [],
	} = props;
	
	if (autodetect) {
		preferredCountries = prependAutoDetectedCountries(preferredCountries);
	}
	
	// Ensure we have a default country somehow
	defaultCountry = defaultCountry || preferredCountries[0] || 'US';
	
	const components = getConfigurableComponents(props.components);
	const classNames = getClassNames(props);
	const [values, setValue] = useValues(defaultCountry, props.value, onChange);
	const country = Country.find(values.country);
	
	const context = {
		name,
		enforceRequired,
		validate,
		country,
		classNames,
		components,
		values,
		setValue,
		createId: (field, element = '') => createId(name, field, element),
		createName: asJSON
			? () => undefined
			: (field) => `${ name }[${ field }]`,
	};
	
	const { Grid, GridRow } = components;
	
	return (
		<AddressContext.Provider value={ context }>
			
			<JsonValue enabled={ asJSON } />
			
			<Grid className={ classNames.grid }>
				
				{/* Country Select Box */ }
				<GridRow className={ classNames.gridRow }>
					<SelectColumn
						name="country"
						value={ values.country }
						options={ Country.forSelection(preferredCountries) }
						onChange={ value => setValue('country', value) }
					/>
				</GridRow>
				
				{/* Dynamic Grid */ }
				{ country.grid.map((row, index) => <Row
					key={ index }
					row={ row }
				/>) }
			
			</Grid>
		
		</AddressContext.Provider>
	);
}

function JsonValue({ enabled }) {
	const { name, values } = useContext(AddressContext);
	
	if (!enabled) {
		return null;
	}
	
	return <input type="hidden" name={ name } value={ JSON.stringify(values) } />;
}

function Row({ row }) {
	const {
		components,
		classNames,
		values,
		setValue,
	} = useContext(AddressContext);
	
	const { GridRow } = components;
	
	return (
		<GridRow className={ classNames.gridRow }>
			{ row.map(field => <Column
				key={ field }
				name={ field }
				value={ values[field] }
				onChange={ value => setValue(field, value) }
			/>) }
		</GridRow>
	);
}

function Column(props) {
	const { name, value, onChange } = props;
	const { country } = useContext(AddressContext);
	const { administrative_areas } = country;
	
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
			name={ name }
			value={ value }
			onChange={ value => onChange(value) }
			options={ options }
		/>;
	}
	
	return <InputColumn
		name={ name }
		value={ value }
		onChange={ value => onChange(value) }
	/>;
}

function SelectColumn(props) {
	const {
		name,
		value,
		onChange,
		options,
	} = props;
	
	const {
		components,
		classNames,
		country,
		createId,
		createName
	} = useContext(AddressContext);
	
	const {
		GridColumn,
		Label,
		Select,
		Option,
	} = components;
	
	const id = createId(name);
	
	return (
		<GridColumn className={ classNames.gridColumn }>
			<Label
				label={ country.getLabel(name) }
				required={ country.isRequired(name) }
				labelProps={ { htmlFor: id } }
				className={ classNames.label }
			/>
			<Select
				selectProps={ {
					id,
					value,
					name: createName(name),
					onChange: e => onChange(e.target.value),
				} }
				className={ classNames.select }
			>
				{ Object.values(options).map(option =>
					<Option
						key={ option.key || option.value }
						optionProps={ { value: option.value, disabled: true === option.disabled } }
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
		name,
		value,
		onChange,
	} = props;
	
	const {
		enforceRequired,
		validate,
		components,
		classNames,
		country,
		createId,
		createName
	} = useContext(AddressContext);
	
	const {
		GridColumn,
		Label,
		Input,
	} = components;
	
	const id = createId(name);
	const required = enforceRequired && country.isRequired(name);
	
	return (
		<GridColumn className={ classNames.gridColumn }>
			<Label
				label={ country.getLabel(name) }
				required={ required }
				labelProps={ { htmlFor: id } }
				className={ classNames.label }
			/>
			<Input
				key={ name }
				className={ classNames.input }
				inputProps={ {
					id,
					name: createName(name),
					value,
					pattern: validate
						? country.getPattern(name)
						: null,
					required,
					title: country.getDescription(name),
					autoCorrect: "off",
					autoComplete: getAutoComplete(name),
					spellCheck: "false",
					"aria-required": required,
					onChange: e => onChange(e.target.value),
					onBlur: () => {
						const trimmed = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
						if (trimmed !== value) {
							onChange(trimmed);
						}
					}
				} }
			/>
		</GridColumn>
	);
}
