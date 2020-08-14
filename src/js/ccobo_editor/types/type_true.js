
/**
 * Wordpress dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

// Declare new type.
const newType = {
	name: 'ccobo.true',
	label: 'true',
	defaultProps: {},
};

// Add new type.
addFilter( 'ccobo.types', 'test.types.' + newType.name, types => [
	...types,
	newType,
] );

// Test the condition.
// Same in php, see: src/inc/fun/ccobo_type_true.php `ccobo_type_true`
addFilter( 'ccobo.test.' + newType.name, 'ccobo.test.' + newType.name, ( result, item ) => true );

// // Render Control.
// // Not needed, nothing to control
// addFilter( 'ccobo.component.' + newType.name, 'ccobo.component.' + newType.name, createHigherOrderComponent( Control => ( {
// 	item,
// 	updateItem,
// } ) => <></> ) );
