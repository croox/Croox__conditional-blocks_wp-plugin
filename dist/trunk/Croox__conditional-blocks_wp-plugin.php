<?php
/*
	Plugin Name: Croox Conditional Blocks
	Plugin URI: https://github.com/croox/Croox__conditional-blocks_wp-plugin
	Description: Hide Blocks conditionally
	Version: 0.0.5
	Author: croox
	Author URI: https://github.com/croox
	License: GNU General Public License v2 or later
	License URI: http://www.gnu.org/licenses/gpl-2.0.html
	Text Domain: ccobo
	Domain Path: /languages
	Tags: gutenberg,block,condition,if
	GitHub Plugin URI: https://github.com/croox/Croox__conditional-blocks_wp-plugin
	Release Asset: true
*/
?><?php
/**
 * Croox Conditional Blocks Plugin init
 *
 * @package Croox__conditional-blocks_wp-plugin
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

include_once( dirname( __FILE__ ) . '/vendor/autoload.php' );

function ccobo_init() {

	$init_args = array(
		'version'		=> '0.0.5',
		'slug'			=> 'Croox__conditional-blocks_wp-plugin',
		'name'			=> 'Croox Conditional Blocks',
		'prefix'		=> 'ccobo',
		'textdomain'	=> 'ccobo',
		'project_kind'	=> 'plugin',
		'FILE_CONST'	=> __FILE__,
		'db_version'	=> 0,
		'wde'			=> array(
			'generator-wp-dev-env'	=> '0.16.0',
			'wp-dev-env-grunt'		=> '0.11.1',
			'wp-dev-env-frame'		=> '0.11.0',
		),
		'deps'			=> array(
			'php_version'	=> '5.6.0',		// required php version
			'wp_version'	=> '5.0.0',			// required wp version
			'plugins'    	=> array(
				/*
				'woocommerce' => array(
					'name'              => 'WooCommerce',               // full name
					'link'              => 'https://woocommerce.com/',  // link
					'ver_at_least'      => '3.0.0',                     // min version of required plugin
					'ver_tested_up_to'  => '3.2.1',                     // tested with required plugin up to
					'class'             => 'WooCommerce',               // test by class
					//'function'        => 'WooCommerce',               // test by function
				),
				*/
			),
			'php_ext'     => array(
				/*
				'xml' => array(
					'name'              => 'Xml',                                           // full name
					'link'              => 'http://php.net/manual/en/xml.installation.php', // link
				),
				*/
			),
		),
	);

	// see ./classes/Ccobo.php
	return ccobo\Ccobo::get_instance( $init_args );
}
ccobo_init();

?>