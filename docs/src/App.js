import React, { useState } from 'react';
import { Address } from '@internachi/franklin';
import tested_countries from './tested-countries.json';
import Flag from 'react-country-flag';
import Docs from './Docs.js';

export default function App() {
	const [data, setData] = useState(() => {
		try {
			return JSON.parse(new URLSearchParams(document.location.search).get('address') || '{}');
		} catch (e) {
			return {};
		}
	});
	
	const feedback_requested = -1 !== tested_countries.indexOf(data.country);
	
	return (
		<div className="min-h-screen flex flex-col">
			<div className="container mx-auto py-12">
				
				<div className="md:flex">
					<div className="md:w-1/2 p-8 md:text-right text-white">
						<h1 className="tracking-tight font-extrabold sm:leading-none text-5xl lg:text-7xl xl:text-8xl">
							Franklin.
						</h1>
						
						<p className="text-2xl my-8 text-indigo-100 opacity-90">
							An open source international address input made for the modern web.
						</p>
						
						<a href="https://github.com/internachi/franklin"
					   className="bg-black rounded-xl p-4 text-white inline-flex items-center text-xl lg:text-3xl">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="h-8 md:h-12 fill-current mr-4">
							<path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
						</svg>
						Check it out on GitHub
					</a>
					
					<div className="my-12">
						<p className="text-base font-semibold opacity-70">
							We rely on community feedback! So far, Franklin has been confirmed in:
						</p>
						
						<div className="space-x-2">
							{ tested_countries.map(country_code =>
								<Flag key={ country_code } countryCode={ country_code } style={ { fontSize: 20 } } />
							) }
						</div>
					</div>
				
				</div>
					<div className="md:w-1/2 mx-4 md:mx-0">
					<form action="" method="get" className="bg-white rounded p-8">
						<Address
							asJSON={true}
							value={ data }
							onChange={ value => setData(value) }
							classNames={ {
								select: "block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
								grid: "space-y-2",
								gridRow: "flex space-x-2",
								gridColumn: "flex-1",
								label: "block",
								input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							} }
						/>
						
						<div className="my-6">
							<button className="inline-flex font-bold items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-gray-900 hover:text-white bg-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type="submit">
								Submit (not saved anywhere - use to test validation)
							</button>
						</div>
						
						<div className="mt-12 pt-6 border-t border-gray-100 space-y-4" style={ { display: feedback_requested ? 'none' : 'block' } }>
							<p>
								<span className="font-semibold">We haven't confirmed that Franklin works in your country yet. </span>
								If you have a moment, we'd really appreciate your feedback!
							</p>
							<div className="flex space-x-2">
								<a
									className="inline-flex font-bold items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-green-900 hover:text-white bg-green-100 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
									href="https://github.com/InterNACHI/franklin/discussions"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4 fill-current mr-2">
										<path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
									</svg>
									This looks right!
								</a>
								<a
									className="inline-flex items-center px-3 py-2 font-bold border border-transparent hover:shadow-sm text-sm leading-4 font-medium rounded-md text-red-900 hover:text-white bg-transparent hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									href={`https://github.com/InterNACHI/franklin/issues/new?assignees=&labels=&template=address-format-issue.md&title=%5B${data.country}%5D+Address+Format+Issue`}
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="h-4 fill-current mr-2">
										<path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
									</svg>
									Report an issue
								</a>
							</div>
						</div>
					
					</form>
					<div className="bg-black opacity-90 rounded p-8 mt-4">
						<pre
							className="text-white font-mono opacity-90"
							children={ JSON.stringify(data, null, 2) }
						/>
					</div>
				</div>
				</div>
				
			</div>
			
			<div className="bg-white flex-1">
				<div className="container mx-auto py-12">
					<Docs />
				</div>
			</div>
		</div>
	);
}
