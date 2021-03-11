# Franklin

[Try out the demo](https://internachi.github.io/franklin/)

Franklin is a universal address input for the modern web. It is a **work-in-progress
project** and should not be used or relied on in any way yet!

Franklin does not apply any styling to your components by default. You can target each
element by a class name like `franklin__label` or apply your own CSS classes if you're
using something like [Tailwind](https://tailwindcss.com/).

## 🚨 Feedback Encouraged 🚨

If you live in a country where you regularly have to fight with address inputs, we'd love
your feedback. Please [try out the demo](https://internachi.github.io/franklin/) and 
[submit an issue](https://github.com/InterNACHI/franklin/issues) or 
[join a discussion](https://github.com/InterNACHI/franklin/discussions) if you find something
that doesn't work as you would expect!

## Packages

### `@internachi/franklin`

Franklin is implemented in React, and `@internachi/franklin` publishes the React component
for use in your project.

### `@internachi/franklin-standalone`

You can also install `@internachi/franklin-standalone` if you're not using React. This bundles
[preact](https://preactjs.com/) and publishes a `Franklin()` method that can be used:

```js
Franklin(document.getElementById("address"), {
	// Apply some basic Tailwind CSS to the elements
	classNames: {
		container: 'antialiased',
		select: 'block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
		grid: 'space-y-2 my-4',
		gridRow: 'flex space-x-2',
		gridColumn: 'flex-1',
		label: 'block',
		input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
	}
});
```

## TODO:

- Allow for "common countries" so you can put your most common countries at top of list
- Controlled / uncontrolled inputs
- More styling control at an input-by-input level
- Explore wrapping in web component / jQuery plugin
- Allow passing IDs
- Validation

## Building

- `lerna run deploy` builds and deploys github docs
- `lerna publish` bumps version, tags, and publishes to npm
