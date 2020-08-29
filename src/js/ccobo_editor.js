/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';

/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
	PanelBody,
	BaseControl,
} = wp.components;

/**
 * Internal dependencies
 */
import Conditions 	from './ccobo_editor/components/Conditions.jsx';
import isHidden		from './ccobo_editor/utils/isHidden';
import * as types 	from './ccobo_editor/types';
import { rootItemDefault } from './ccobo_editor/constants'

/**
 * Add `ccoboConditions` to Block attributes.
 */
addFilter( 'blocks.registerBlockType', 'ccobo.addBlockAttributes', ( settings, name ) => ( {
	...settings,
	attributes: {
		...settings.attributes,
		ccoboConditions: {
			type: 'array',
			items: { type: 'object' },
		},
	},
} ) );

/**
 * Filter BlockEdit
 * - Add Conditions Control to Inspector.
 */
addFilter( 'editor.BlockEdit', 'ccobo.addControls', createHigherOrderComponent( BlockEdit => props => {
	const {
		attributes,
		setAttributes,
	} = props

	const hidden = Array.isArray( attributes.ccoboConditions ) ? isHidden(  attributes.ccoboConditions ) : false;

	return <Fragment>
		<BlockEdit { ...props } />

		<InspectorControls>
			<PanelBody
				title={ __( 'Conditionally Display', 'ccobo' ) }
				initialOpen={ false }
				icon={ hidden ? 'hidden' : 'visibility' }
				className={ 'ccobo-controls-wrapper' }
			>
				<BaseControl
					label={ __( 'Hide if conditions are true', 'ccobo' ) }
				>
					<Conditions
						items={ Array.isArray( attributes.ccoboConditions ) ? attributes.ccoboConditions : cloneDeep([rootItemDefault]) }
						setItems={ newItems => setAttributes( { ccoboConditions: cloneDeep( newItems ) } ) }
					/>
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	</Fragment>;
}, "withCcoboControls" ) );

/**
 * Filter BlockListBlock
 * - Add className `ccobo-hidden`, if hidden.
 */
addFilter( 'editor.BlockListBlock', 'ccobo.test', createHigherOrderComponent( BlockListBlock => props => {
	const {
		attributes,
	} = props

	const hidden = Array.isArray( attributes.ccoboConditions ) ? isHidden(  attributes.ccoboConditions ) : false;

	return <BlockListBlock { ...{
		...props,
		...( hidden && { className: classnames( props.className, 'ccobo-hidden' ) } ),
	} } />;
}, "withCcoboHiddenClass" ) );