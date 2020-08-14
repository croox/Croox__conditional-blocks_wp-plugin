<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function ccobo_include_template_functions() {

	$paths = array(
	);

	if ( count( $paths ) > 0 ) {
		foreach( $paths as $path ) {
			include_once( ccobo\Ccobo::get_instance()->dir_path . $path );
		}
	}

}

?>