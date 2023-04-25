import data from '../../data.json';

export default function prependAutoDetectedCountries(countries = []) {
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (tz && tz in data.tz) {
			// Using a set de-duplicates the list for us
			return Array.from(new Set([...data.tz[tz], ...countries]));
		}
	} catch (e) {
	}
	
	return countries;
}
