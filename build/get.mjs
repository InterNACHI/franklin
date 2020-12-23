import { get as getViaCallback } from 'https';
import { writeFile, readFile, mkdir } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = 'https://chromium-i18n.appspot.com/ssl-address/data';

export default async function(path) {
	const cached = await loadFromCache(path);
	
	if (cached) {
		return cached;
	}
	
	return await download(path);
}

function get(url) {
	return new Promise((resolve, reject) => {
		getViaCallback(url, (res) => {
			if (res.statusCode < 200 || res.statusCode >= 400) {
				return reject(new Error(`Request for ${url} resulted in a ${ res.statusCode } HTTP status.`));
			}
			resolve(res);
		}).on('error', (e) => {
			reject(e);
		});
	});
}

async function download(path) {
	let url = '' === path
		? root
		: `${ root }/${ path }`;
	
	// console.info(`Downloading ${ url } from Google...`);
	
	let res = await get(url);
	
	while (301 === res.statusCode || 302 === res.statusCode) {
		url = res.headers.location;
		res = await get(url);
	}
	
	return new Promise((resolve, reject) => {
		let data = '';
		res.on('data', chunk => data += chunk);
		res.on('end', () => {
			try {
				const parsed = JSON.parse(data);
				writeToCache(path, data);
				resolve(parsed);
			} catch (e) {
				reject(e);
			}
		});
	});
}

function loadFromCache(path) {
	return new Promise(resolve => {
		readFile(cacheFile(path), 'utf8', (err, data) => {
			if (err) {
				return resolve(false);
			}
			
			try {
				//console.info(`Loading ${ path } from cache...`);
				return resolve(JSON.parse(data));
			} catch (e) {
				resolve(false);
			}
		});
	});
}

function writeToCache(path, data) {
	const filename = cacheFile(path);
	const dir = dirname(filename);
	
	//console.log(`Creating ${ dir } and writing to ${ filename }`);
	
	return new Promise(resolve => {
		mkdir(dir, { recursive: true }, (err) => {
			if (err) {
				console.warn(err);
				return resolve(false);
			}
			
			writeFile(filename, data, (err) => {
				if (err) {
					console.warn(err);
					return resolve(false);
				}
				
				resolve(true);
			});
		});
	});
}

function cacheFile(path) {
	if ('' === path) {
		path = 'root-data';
	}
	
	const build_dir = dirname(fileURLToPath(import.meta.url));
	
	return resolve(build_dir, '..', 'data', `${ path }.json`);
}
