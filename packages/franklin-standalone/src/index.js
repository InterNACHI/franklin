import { render } from 'preact';
import { Address } from '@internachi/franklin';

window.Franklin = function(target, props) {
	render(<Address {...props} />, target);
};
