<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function ccobo_include_fun() {

	$paths = array(
		'inc/fun/ccobo_is_hidden.php',
		'inc/fun/ccobo_type_currentUser.php',
		'inc/fun/ccobo_type_true.php',
	);

	if ( count( $paths ) > 0 ) {
		foreach( $paths as $path ) {
			include_once( ccobo\Ccobo::get_instance()->dir_path . $path );
		}
	}

}

?>