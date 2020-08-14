<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

use croox\wde\utils\Arr;

/**
 * Test condition for type `ccobo.true`
 *
 * Same in js:
 * @see src/js/ccobo_editor/types/type_true.js `ccobo.test.ccobo.true`
 *
 * @param bool		$result		Should initial be false
 * @param array		$item		The Condtion, contains props
 * @return bool					True will hide the Block
 */
function ccobo_type_true( $result, $item ) {
    return true;
}
add_filter( 'ccobo.test.ccobo.true', 'ccobo_type_true', 10, 2 );
