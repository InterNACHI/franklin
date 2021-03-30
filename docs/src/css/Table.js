import React from 'react';

export function Table({ children, className = '' }) {
	return (
		<div className="overflow-y-auto">
			<table className={`w-full text-left border-collapse ${className}`}>
				{ children }
			</table>
		</div>
	);
}

export function TableHeading({ children, className = '' }) {
	return (
		<th className={`text-sm font-semibold text-gray-900 bg-white py-1 pr-4 ${className}`}>
			{ children }
		</th>
	);
}

export function TableCell({ children, className = '' }) {
	return (
		<td className={`border-t py-1 pr-4 ${className}`}>
			{ children }
		</td>
	);
}
