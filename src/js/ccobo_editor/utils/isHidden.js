
/**
 * Wordpress dependencies
 */
const { applyFilters } = wp.hooks;
/**
 * Check if Block should be hidden.
 * Traverse recursive through all conditions.
 */
const hiddenReducer = ( result, condition ) => {
	if ( result )
		return result;	// true
	if ( '' === condition.type )
		return result;	// skip

	if ( 'ccobo.group' === condition.type ) {
		switch( condition.props.relation ) {
			case 'OR':
				result = [...condition.children].some( a => hiddenReducer( result, a ) );
				return true === condition.props.not ? ! result : result;
				break;
			case 'AND':
				result = [...condition.children].every( a => hiddenReducer( result, a ) );
				return true === condition.props.not ? ! result : result;
				break;
			default:
				return result;
		}
	}

	result = applyFilters( 'ccobo.test.' + condition.type, result, condition );
	return true === condition.props.not ? ! result : result;
}
const isHidden = conditions => [...conditions].reduce( hiddenReducer, false );

export default isHidden;