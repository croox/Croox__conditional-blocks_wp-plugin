/**
 * Exteral dependencies
 */
import { get } from "lodash";

/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const {
	SelectControl,
	TextControl,
} = wp.components;

// Helper
let currentUser = wp.data.select( 'core' ).getCurrentUser();
const getCurrentUser = () => {
	currentUser = currentUser && currentUser.id ? currentUser : wp.data.select( 'core' ).getCurrentUser();
	return currentUser;
}

// Declare new type.
const newType = {
	name: 'ccobo.currentUser',
	label: 'currentUser',
	defaultProps: {
		key: 'id',
		id: 1,
		// name: '',
		// slug: '',
	},
};

// Add new type.
addFilter( 'ccobo.types', 'ccobo.types.' + newType.name, types => [
	...types,
	newType,
] );

// Test the condition.
// Same in php, see: src/inc/fun/ccobo_type_currentUser.php `ccobo_type_currentUser`
addFilter( 'ccobo.test.' + newType.name, 'ccobo.test.' + newType.name, ( result, item ) => {
	const currentUser = getCurrentUser();
	const key = get( item, ['props','key'] );
	return currentUser && currentUser[key] == get( item, ['props',key] );
} );

// Render Control.
addFilter( 'ccobo.component.' + newType.name, 'ccobo.component.' + newType.name, createHigherOrderComponent( Control => ( {
	item,
	updateItem,
} ) => {

	const key = get( item, ['props','key'] );

	const options = [
		{ label: __( 'ID', 'ccobo' ), value: 'id' },		// int
		{ label: __( 'Name', 'ccobo' ), value: 'name' },	// string
		{ label: __( 'Slug', 'ccobo' ), value: 'slug' },	// string
	];

	return <>
		<SelectControl
			label={ __( 'User Property', 'ccobo' ) }
			value={ key }
			options={ options }
			onChange={ val => updateItem( { key: val } ) }
		/>

		{ 'id' === key && <TextControl
			label={ __( 'ID', 'ccobo' ) }
			type="number"
			value={ get( item, ['props','id'] ) }
			onChange={ val => parseInt( val, 10 ) == val && parseInt( val, 10 ) > 0
				&& updateItem( { id: parseInt( val, 10 ) } ) }
		/> }

		{ [
			'name',
			'slug',
		].map( k => k === key ? <TextControl
			label={ [...options].find( o => k === o.value ).label }
			value={ get( item, ['props',k] ) }
			onChange={ val => updateItem( { [k]: val } ) }
		/> : '' ) }
    </>;
} ) );
