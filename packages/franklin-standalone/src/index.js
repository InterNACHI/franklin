import { render, h } from 'preact';
import { Address } from '@internachi/franklin';

window.Franklin = function(target, props) {
	render(h(Address, props), target);
};
