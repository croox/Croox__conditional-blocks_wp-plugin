/**
 * External dependencies
 */
import { get } from "lodash";

/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { __experimentalGetSettings } = wp.date;
const {
	SelectControl,
	BaseControl,
	TimePicker,
} = wp.components;

let settings = __experimentalGetSettings();

// options and moment.js compare function
const options = [
	{ value: '>', func: 'isAfter', label: '> ' + __( 'After', 'ccobo' ) },
	{ value: '<', func: 'isBefore', label: '< ' + __( 'Before', 'ccobo' ) },
];

// Declare new type.
const newType = {
	name: 'ccobo.dateTimeNow',
	label: __( 'Date Time Now', 'ccobo' ),
	defaultProps: {
		compare: '>',	// < >
		timestamp: moment().unix(),	// < >
	},
};

// Add new type.
addFilter( 'ccobo.types', 'ccobo.types.' + newType.name, types => [
	...types,
	newType,
] );

// Test the condition.
// Same in php, see: src/inc/fun/ccobo_type_dateTimeNow.php `ccobo_type_dateTimeNow`
addFilter( 'ccobo.test.' + newType.name, 'ccobo.test.' + newType.name, ( result, item ) => {
	let compare = get( item, ['props','compare'] );
	compare = options.find( o => compare === o.value );
	if ( undefined == compare )
		return false;
	return moment()[compare.func](
		 moment.unix( get( item, ['props','timestamp'] ) )
	)
} );

// Render Control.
addFilter( 'ccobo.component.' + newType.name, 'ccobo.component.' + newType.name, createHigherOrderComponent( Control => ( {
	item,
	updateItem,
} ) => {
	settings = null === settings ? __experimentalGetSettings() : settings;
	// To know if the current timezone is a 12 hour time with look for an "a" in the time format.
	// We also make sure this a is not escaped by a "/".
	const is12HourTime = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only the lower case a
			.replace( /\\\\/g, '' ) // Replace "//" with empty strings
			.split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
	);

	return <>
		<BaseControl
			label={ __( 'Date now', 'ccobo' ) }
			className={ 'flex-field' }
		>
			<span className='pseudo-input'>
				{ moment().format( 'DD MMM YYYY ' + ( is12HourTime ? 'hh:mm a' : 'HH:mm' ) ) }
			</span>
		</BaseControl>

		<SelectControl
			className={ 'flex-field' }
			label={ __( 'Compare', 'ccobo' ) }
			options={ options }
			onChange={ val => updateItem( { compare: val } ) }
			value={ get( item, ['props','compare'] ) }
		/>

		<BaseControl
			label={ __( 'Date to compare', 'ccobo' ) }
		>
			<TimePicker
				currentTime={ moment.unix( get( item, ['props','timestamp'] ) ).toDate() }
				onChange={ val => updateItem( { timestamp: moment( val ).unix() } ) }
				is12Hour={ is12HourTime }
			/>
		</BaseControl>
	</>;
} ) );
