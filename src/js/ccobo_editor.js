/**
 * External dependencies
 */
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
 * Wrap BlockEdit functions.
 * - Wrap in a div, half transparent if Block is hidden.
 * - Add Conditions Control to Inspector
 */
addFilter( 'editor.BlockEdit', 'ccobo.addControls', createHigherOrderComponent( BlockEdit => props => {
	const {
		attributes,
		setAttributes,
	} = props

	const ccoboConditions = Array.isArray( attributes.ccoboConditions ) ? attributes.ccoboConditions : [];
	const hidden = isHidden( ccoboConditions );

	return <Fragment>
		<div style={ { ...( hidden && { opacity: '0.25' } ) } }>
			<BlockEdit { ...props } />
		</div>

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
						items={ ccoboConditions }
						setItems={ newItems => setAttributes( { ccoboConditions: cloneDeep( newItems ) } ) }
					/>
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	</Fragment>;
}, "withCcoboControls" ) );
