import React from 'react';
import CodeSample from './CodeSample.js';
import { Table, TableCell, TableHeading } from './css/Table.js';

export default function Docs() {
	return (
		<div className="max-w-screen-lg mx-auto">
			<h2 className="tracking-tight font-extrabold sm:leading-none text-3xl lg:text-5xl xl:text-6xl">
				Usage
			</h2>
			
			<p className="my-6 text-xl">
				Franklin is in a very early stage of development. The API isn't fully established yet,
				so we're only documenting basic code samples for now: 
			</p>
			
			<h3 className="tracking-tight font-semibold sm:leading-none text-xl text-gray-500 mt-8 mb-2">
				Core Concepts
			</h3>
			
			<p className="text-lg">
				Franklin has two core concepts that are important to understand:
			</p>
			
			<ol className="text-lg list-decimal pl-8 my-4">
				<li className="my-4">
					<strong>The data always looks the same</strong> — because Franklin attempts to
					handle addresses for every country, you have to be prepared to accept data in many
					different formats. This means that you'll always get an "administrative area" and 
					a "postal code" even if in a particular country these are called "state" and "zip code."
				</li>
				<li className="my-4">
					<strong>The UI is based on a "renderless" grid system</strong> — Franklin doesn't bring
					any opinions about layout to the table, but it's necessarily a layout component because
					it needs to position input fields on a grid. The way we accomplish this is by ordering the
					elements for you and providing necessary props while giving you full flexibility to render
					Franklin as you see fit.
				</li>
			</ol>
			
			<h3 className="tracking-tight font-semibold sm:leading-none text-xl text-gray-500 mt-8 mb-2">
				Props
			</h3>
			
			<p className="text-lg">
				Both the React and Standalone libraries accept (mostly) the same props:
			</p>
			
			<Table className="my-4">
				<thead>
					<tr>
						<TableHeading>
							Prop
						</TableHeading>
						<TableHeading>
							Default
						</TableHeading>
						<TableHeading>
							Notes
						</TableHeading>
					</tr>
				</thead>
				<tbody>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							name
						</TableCell>
						<TableCell className="font-mono">
							"address"
						</TableCell>
						<TableCell>
							This is the name of the form inputs that are submitted to the server
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							autodetect
						</TableCell>
						<TableCell className="font-mono">
							true
						</TableCell>
						<TableCell>
							If set to true, Franklin with attempt to auto-detect the country based on the browser time zone
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							defaultCountry
						</TableCell>
						<TableCell className="font-mono">
							null
						</TableCell>
						<TableCell>
							The 2-char country code that the address field should default to. If omitted, Franklin
							will use the autodetected country, or the first item in <code className="font-mono">preferredCountries</code>, 
							or "US" as a last resort
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							preferredCountries
						</TableCell>
						<TableCell className="font-mono">
							[]
						</TableCell>
						<TableCell>
							An array of 2-char country codes that will be shown at the top of the country select list
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							onChange
						</TableCell>
						<TableCell>
							<span className="opacity-25">N/A</span>
						</TableCell>
						<TableCell>
							A callback that will receive the new address object each time form input changes
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							enforceRequired
						</TableCell>
						<TableCell>
							true
						</TableCell>
						<TableCell>
							Boolean flag to enable/disable setting the "required" attribute on address fields
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							validate
						</TableCell>
						<TableCell>
							true
						</TableCell>
						<TableCell>
							Boolean flag to enable/disable input validation
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							asJSON
						</TableCell>
						<TableCell>
							false
						</TableCell>
						<TableCell>
							When set to true, form data will contain a single JSON object with all address data.
							When set to false, each input is a separate form item.
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							value
						</TableCell>
						<TableCell className="font-mono">
							{`{}`}
						</TableCell>
						<TableCell>
							Set the value if you want Franklin to operate in <a className="underline text-blue-500" href="https://reactjs.org/docs/forms.html#controlled-components" target="_blank" rel="noopener">controlled mode</a>.
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							classNames
						</TableCell>
						<TableCell className="font-mono">
							{ `{}` }
						</TableCell>
						<TableCell>
							If set, Franklin will apply these class names to each component it renders. If not,
							default class names are applied.
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							components
						</TableCell>
						<TableCell className="font-mono">
							{ `{}` }
						</TableCell>
						<TableCell>
							<strong>React only:</strong> Franklin uses basic HTML components to render. You
							can usually customize the layout to your liking by applying class names, but if you
							need more control, you can pass custom components in instead.
						</TableCell>
					</tr>
				</tbody>
			</Table>
			
			<h3 className="tracking-tight font-semibold sm:leading-none text-xl text-gray-500 mt-8 mb-4">
				React API
			</h3>
			
			<CodeSample className="my-4" code={ `
				import { Address } from '@internachi/franklin';

				<Address 
					name="address"
					defaultCountry="US"
					onChange={ value => setAddress(value) }
					enforceRequired={ true }
					validate={ true }
					asJSON={ false }
					value={{
						country: 'US',
						address1: '1750 30th St',
						address2: 'Suite 301',
						administrative_area: 'CO',
						locality: 'Boulder',
						sublocality: '',
						postal_code: '80301',
						sorting_code: ''
					}}
					classNames={{
						select: "franklin__select",
						grid: "franklin__grid",
						gridRow: "franklin__gridRow",
						gridColumn: "franklin__gridColumn",
						label: "franklin__label",
						input: "franklin__input"
					}}
					components={{
						Grid: CustomGrid,
						GridRow: CustomGridRow,
						GridColumn: CustomGridColumn,
						Label: CustomLabel,
						Select: CustomSelect,
						Option: CustomOption,
						Input: CustomInputt
					}}
				/>
			` } />
			
			<div className="my-4 text-right">
				<a className="text-blue-500 underline" href="https://codesandbox.io/s/franklin-demo-qjgl4" target="_blank" rel="noopener">
					Try it on CodeSandbox
				</a>
			</div>
			
			<h3 className="tracking-tight font-semibold sm:leading-none text-xl text-gray-500 mt-8 mb-4">
				Standalone API
			</h3>
			
			<CodeSample className="my-4" language="html" code={ `
				<script src="https://unpkg.com/@internachi/franklin-standalone/dist/franklin-standalone.umd.js"></script>

				<div id="franklin"></div>
				
				<script>
				Franklin('#franklin', {
					name: "address",
					defaultCountry: "US",
					onChange: value => console.log(value),
					enforceRequired: true,
					validate: true,
					asJSON: false,
					value: {
						country: 'US',
						address1: '1750 30th St',
						address2: 'Suite 301',
						administrative_area: 'CO',
						locality: 'Boulder',
						sublocality: '',
						postal_code: '80301',
						sorting_code: ''
					},
					classNames: {
						select: "franklin__select",
						grid: "franklin__grid",
						gridRow: "franklin__gridRow",
						gridColumn: "franklin__gridColumn",
						label: "franklin__label",
						input: "franklin__input"
					}
				});
				</script>
			` } />
			
			<div className="my-4 text-right">
				<a className="text-blue-500 underline" href="https://codesandbox.io/s/franklin-standalone-55yh8" target="_blank" rel="noopener">
					Try it on CodeSandbox
				</a>
			</div>
			
			<h3 className="tracking-tight font-semibold sm:leading-none text-xl text-gray-500 mt-8 mb-4">
				Data Format
			</h3>
			
			<Table className="my-4">
				<thead>
					<tr>
						<TableHeading>
							Field
						</TableHeading>
						<TableHeading>
							About
						</TableHeading>
					</tr>
				</thead>
				<tbody>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							country
						</TableCell>
						<TableCell>
							2-character country code (always present)
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							address1
						</TableCell>
						<TableCell>
							Line 1 of the address (always present)
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							address2
						</TableCell>
						<TableCell>
							Line 2 of the address
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							administrative_area
						</TableCell>
						<TableCell>
							Usually represents a major subdivision of the country. In the United States,
							this is the "state." In Canada, this is the "province."
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							locality
						</TableCell>
						<TableCell>
							Usually represents a smaller subdivision of the country. In many places, this
							would be a city or town.
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							sublocality
						</TableCell>
						<TableCell>
							An even smaller subdivision of the country.
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							postal_code
						</TableCell>
						<TableCell>
							Usually used as a mail delivery code. In the United States, this is the
							"zip code."
						</TableCell>
					</tr>
					<tr>
						<TableCell className="text-blue-800 font-semibold">
							sorting_code
						</TableCell>
						<TableCell>
							Usually used as an additional mail delivery code.
						</TableCell>
					</tr>
				</tbody>
			</Table>
			
			<h3 className="tracking-tight font-semibold sm:leading-none text-xl text-gray-500 mt-8 mb-4">
				Usage with Tailwind
			</h3>
			
			<p className="text-lg">
				Franklin works particularly well with <a href="https://tailwindcss.com/" target="_blank" rel="noopener" className="text-blue-500 underline">Tailwind CSS</a>.
				You can easily style your grid and your components using Tailwind's flex classes. The example
				at the top of the page was created using (essentially) these styles:
			</p>
			
			<CodeSample className="my-4" code={ `
				import { Address } from '@internachi/franklin';

				<Address 
					classNames={{
						select: "block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
						grid: "space-y-2",
						gridRow: "flex space-x-2",
						gridColumn: "flex-1",
						label: "block",
						input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					}}
				/>
			` } />
			
		</div>
	);
}
