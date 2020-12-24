import { Address } from '@internachi/franklin/dist/franklin.js';

export default function App() {
	return (
		<div className="container mx-auto my-12 md:flex">
			<div className="md:w-1/2 p-8">
				<h1 className="text-right text-4xl tracking-tight font-extrabold text-white sm:leading-none lg:text-6xl xl:text-7xl">
					<span className="md:block">The ultimate</span>
					<span className="text-indigo-300 md:block">address input</span>
				</h1>
			</div>
			<div className="md:w-1/2">
				<div className="bg-white rounded p-8">
					<Address
						classNames={ {
							select: "block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
							grid: "space-y-2",
							gridRow: "flex space-x-2",
							gridColumn: "flex-1",
							label: "block",
							input: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						} }
					/>
				</div>
			</div>
		</div>
	);
}
