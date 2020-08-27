<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

use croox\wde\utils\Arr;

/**
 * Test condition for type `ccobo.dateTimeNow`
 *
 * Same in js:
 * @see src/js/ccobo_editor/type_dateTimeNow.js `ccobo.test.ccobo.dateTimeNow`
 *
 * @param bool		$result		Should initial be false
 * @param array		$item		The Condition, contains props
 * @return bool					True will hide the Block
 */
function ccobo_type_dateTimeNow( $result, $item ) {
	$compare = Arr::get( $item, array('props','compare') );
	$timestamp = Arr::get( $item, array('props','timestamp') );
	$timestamp_now = date_timestamp_get( date_create() );
	return '<' === $compare
		? $timestamp_now < $timestamp
		: $timestamp_now > $timestamp;
}
add_filter( 'ccobo.test.ccobo.dateTimeNow', 'ccobo_type_dateTimeNow', 10, 2 );
