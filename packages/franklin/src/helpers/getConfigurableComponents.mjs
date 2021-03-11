import Wrapper from '../components/Wrapper.jsx';
import DefaultLabel from '../components/DefaultLabel.jsx';
import DefaultSelect from '../components/DefaultSelect.jsx';
import DefaultOption from '../components/DefaultOption.jsx';
import DefaultInput from '../components/DefaultInput.jsx';

export function getConfigurableComponents(componentsFromProps = {})
{
	// All components can be overwritten by passing a new React component
	// in through the `components` prop. By default, all components have
	// as little markup as necessary.
	const {
		Grid = Wrapper,
		GridRow = Wrapper,
		GridColumn = Wrapper,
		Label = DefaultLabel,
		Select = DefaultSelect,
		Option = DefaultOption,
		Input = DefaultInput,
	} = componentsFromProps;
	
	// Once we've applied the default implementations, we'll push them back
	// into a `components` object so that we can easily pass them down into children.
	return {
		Grid,
		GridRow,
		GridColumn,
		Label,
		Select,
		Option,
		Input,
	};
}

export default getConfigurableComponents;
