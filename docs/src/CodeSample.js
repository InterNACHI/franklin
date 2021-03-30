import React from 'react';
import { Prism } from 'react-syntax-highlighter';
import stripIndent from 'strip-indent';

export default function CodeSample({ code, className = '', language = 'jsx' }) {
	return (
		<Prism 
			className={`bg-gray-800 text-white rounded p-4 overflow-x-auto ${className}`}
			codeTagProps={{ style: {} }}
			language={language}
			useInlineStyles={false}
			children={stripIndent(code).trim() }
		/>
	);
}
