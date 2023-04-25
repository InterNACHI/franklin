import { getAllTimezones } from 'countries-and-timezones';
import abbreviations from 'country-json/src/country-by-abbreviation.json' assert { type: 'json' };
import population from 'country-json/src/country-by-population.json' assert { type: 'json' };

export default function() {
	const timezones = getAllTimezones();
	
	const name_map = abbreviations.reduce((name_map, country) => ({
		...name_map,
		[country.country]: country.abbreviation,
	}), {});
	
	const population_map = population.reduce((population_map, country) => ({
		...population_map,
		[name_map[country.country]]: country.population,
	}), {});
	
	return Object.values(timezones)
		.filter(tz => tz.countries.length)
		.reduce((result, tz) => ({
			...result,
			[tz.name]: tz.countries.sort((a, b) => {
				return (population_map[a] || 0) > (population_map[b] || 0)
					? -1
					: 0;
			}),
		}), {});
}
