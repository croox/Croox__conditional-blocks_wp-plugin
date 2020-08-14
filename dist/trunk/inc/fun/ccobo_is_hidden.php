<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

use croox\wde\utils\Arr;

function ccobo_is_hidden_reducer_some( $array, $result ) {
    foreach ( $array as $value ) {
        if( ccobo_is_hidden_reducer( $result, $value ) ) {
            return true;
        }
    }
    return false;
}

function ccobo_is_hidden_reducer_every( $array, $result ) {
    foreach ( $array as $value ) {
        if( ! ccobo_is_hidden_reducer( $result, $value ) ) {
            return false;
        }
    }
    return true;
}

function ccobo_is_hidden_reducer( $result, $condition ) {
	if ( $result )
		return $result;	// true

	$type = Arr::get( $condition, 'type', '' );
	if ( '' === $type )
		return $result;	// skip

	$not = Arr::get( $condition, array('props','not') );

	if ( 'ccobo.group' === $type ) {
		$children = Arr::get( $condition, 'children', array() );
		switch( Arr::get( $condition, array('props','relation') ) ) {
			case 'OR':
				$result = ccobo_is_hidden_reducer_some( $children, $result );
				return true === $not ? ! $result : $result;
				break;
			case 'AND':
				$result = ccobo_is_hidden_reducer_every( $children, $result );
				return true === $not ? ! $result : $result;
				break;
			default:
				return $result;
		}
	}

	$result = apply_filters( 'ccobo.test.' . $type, $result, $condition );
	return true === $not ? ! $result : $result;
}

function ccobo_is_hidden( $conditions = array() ) {
	return array_reduce( $conditions, 'ccobo_is_hidden_reducer', false );
}
