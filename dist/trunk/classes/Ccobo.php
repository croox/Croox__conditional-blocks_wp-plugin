<?php

namespace ccobo;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

use croox\wde\Plugin;
use croox\wde\utils\Arr;

class Ccobo extends Plugin {

	public function hooks(){
        parent::hooks();
		add_action( 'current_screen', array( $this, 'enqueue_assets_editor' ), 10 );
		add_filter( 'render_block', array( $this, 'render_block' ), 10, 2 );
	}

	public function enqueue_assets_editor( $screen ){
		if ( ! is_admin() || 'post' !== $screen->base )
			return;

		$handle = $this->prefix . '_editor';

		$this->register_script( array(
			'handle'		=> $handle,
			'deps'			=> array(
				'wp-hooks',
				'wp-data',
				'wp-i18n',
				'wp-blocks',
				'wp-dom-ready',
				'wp-edit-post',
			),
			'in_footer'		=> true,	// default false
			'enqueue'		=> true,
			// 'localize_data'	=> array(),
		) );

		$this->register_style( array(
			'handle'	=> $handle,
			'enqueue'	=> true,
		) );

	}

	public function render_block( $content, $block ) {
		$conditions = Arr::get( $block, array( 'attrs', 'ccoboConditions' ), array() );
		$hidden = ccobo_is_hidden( $conditions );
		return $hidden ? '' : $content;
	}

}