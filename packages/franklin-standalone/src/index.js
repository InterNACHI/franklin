import { render, h } from 'preact';
import { Address } from '@internachi/franklin';

window.Franklin = function(target, props) {
	if ('string' === typeof target || target instanceof String) {
		target = document.querySelector(target);
	}
	
	render(h(Address, props), target);
};
