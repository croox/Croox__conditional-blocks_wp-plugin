<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

use croox\wde\utils\Arr;

/**
 * Test condition for type `ccobo.currentUser`
 *
 * Same in js:
 * @see src/js/ccobo_editor/types/type_currentUser.js `ccobo.test.ccobo.currentUser`
 *
 * @param bool		$result		Should initial be false
 * @param array		$item		The Condtion, contains props
 * @return bool					True will hide the Block
 */
function ccobo_type_currentUser( $result, $item ) {
	$current_user = wp_get_current_user();
	if ( ! $current_user || 0 === $current_user->ID )
		return $result;

	$key = Arr::get( $item, array('props','key') );
	$val = Arr::get( $item, array('props',$key) );

	// Map js keys to php WP_User properties.
	// See WP_REST_Users_Controller::prepare_item_for_response
	$key_php = Arr::get( array(
		'id'	=> 'ID',
		'name'	=> 'display_name',
		'slug'	=> 'user_nicename',
	), $key );

	return $key_php
		? $current_user->$key_php == $val
		: $result;
}
add_filter( 'ccobo.test.ccobo.currentUser', 'ccobo_type_currentUser', 10, 2 );
