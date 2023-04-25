import { getAllTimezones } from 'countries-and-timezones';

export default function() {
	const timezones = getAllTimezones();
	
	return Object.values(timezones)
		.filter(tz => tz.countries.length)
		.reduce((result, tz) => ({
			...result,
			[tz.name]: tz.countries,
		}), {});
}
