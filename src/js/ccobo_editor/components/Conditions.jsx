/**
 * Exteral dependencies
 */
import {
	DragHandleComponent,
	Item,
	List,
} from 'react-sortful';
import classnames from "classnames";
import shortid from "shortid";
import { get, isInteger, cloneDeep } from "lodash";
import arrayMove from "array-move";

/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { useCallback } = wp.element;

const {
	Icon,
	Button,
	Tooltip,
	SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import {
	rootItemId,
	itemDefault,
} from '../constants'

// Helper

const findItem = ( items, identifier ) => {
	const reducer = ( acc, item ) => {
		if ( acc )
			return acc;
		if ( item.id === identifier )
			return item;
		if (  undefined != item.children && item.children.length )
			return [...item.children].reduce( reducer, acc );
		return acc;
	};
	return [...items].reduce( reducer, false );
};

const findParentItem = ( items, identifier ) => {
	const reducer = ( acc, item ) => {
		if ( acc )
			return acc;
		if ( undefined == item.children || ! item.children.length )
			return acc;
		return [...item.children].map( a => a.id ).includes( identifier )
			? item
			: [...item.children].reduce( reducer, acc );
		return acc;
	};
	return [...items].reduce( reducer, false );
};

let _conditionTypes = [];
const getConditionTypes = () => {
	_conditionTypes = _conditionTypes.length ? _conditionTypes : applyFilters( 'ccobo.types', [{
		name: 'ccobo.group',
		label: 'Group',
		defaultProps: {
			relation: 'OR',
		},
	}] );
	return _conditionTypes;
}

// Components

const DropLine = ( {
	ref,
	style,
} ) => <div
	ref={ref}
	className={'dropLine'}
	style={style}
/>;

const DragHandle = ( { isGhost } ) => {
	const children = ( <Button className={'drag-handle-icon'}/> );
	return isGhost
		? <div className={'drag-handle'}>{ children }</div>
		: <DragHandleComponent className={'drag-handle'}>{ children }</DragHandleComponent>;
};

const ItemPlaceholder = ( {
	style,
	identifier,
	isGroup,
} ) => <div
	className={ classnames( 'placeholder', ( isGroup ? 'group' : 'item' ) ) }
	style={ style }
>
	<DragHandle/>
</div>;

const GroupGhost = ( {
	item,
	className,
	children,
} ) => <div className={ classnames( 'group', className ) }>
	<DragHandle isGhost/>
	<div className={ 'heading' }>
		<Button>{ get( item, ['props','relation'], 'DROP' ) }</Button>
		<span className={'spacer'}></span>
		<Button><Icon icon="plus" /></Button>
		<Button><Icon icon="plus-alt" /></Button>
		<Button><Icon style={ { color: 'red' } } icon="no" /></Button>
	</div>
	{ children }
</div>;

const ConditionSelect = ( {
	type,
	updateItem,
} ) => {
	const conditionTypes = getConditionTypes();
	return <SelectControl
		value={ type }
		options={ [
			{ label: __( 'Choose Condition', 'ccobo' ), value: '' },
			...[...conditionTypes].filter( type => 'ccobo.group' !== type.name ).map( type => (
				{ label: type.label, value: type.name }
			) )
		] }
		onChange={ newType => updateItem( null, newType ) }
	/>;
}

const ListItem = ( {
	item,
	index,
	items,
	setItems,
} ) => {
	// handlers
	const removeItem = () => {
		const parent = findParentItem( items, item.id );
		if ( ! parent )
			return
		parent.children.splice( parent.children.findIndex( a => a.id === item.id ), 1 );
		setItems( items );
	};
	const toggleProp = key => {
		switch( key ) {
			case 'relation':
				item.props[key] = 'OR' === item.props[key] ? 'AND' : 'OR';
				break;
			default:
				item.props[key] = ! item.props[key];
		}
		setItems( items );
	};
	const addItem = () => {
		item.children.push( {...itemDefault, id: shortid()} );
		setItems( items );
	};
	const addGroup = () => {
		const conditionTypeGroup = getConditionTypes().find( a => 'ccobo.group' === a.name );
		item.children.push( {
			type: conditionTypeGroup.name,
			id: shortid(),
			props: { ...conditionTypeGroup.defaultProps },
			children: [{
				...itemDefault,
				id: shortid(),
			}],
		} );
		setItems( items );
	};
	const updateItem = ( newProps, newType ) => {
		if ( newProps ) {
			item.props = {
				...item.props,
				...newProps,
			};
		}
		if ( newType && item.type !== newType ) {
			item.type = newType;
			item.props = {
				...get( getConditionTypes().find( a => newType === a.name ), ['defaultProps'] ),
			};

		}
		setItems( items );
	};

	// group
	if ( item.children != undefined ) {
		return <Item
			key={item.id}
			identifier={item.id}
			index={index}
			isGroup
			isUsedCustomDragHandlers={ true }
			isLocked={ rootItemId === item.id }
			isLonely={ rootItemId === item.id }
		>
			<div className={'group'}>
				{ rootItemId !== item.id && <DragHandle/> }
				<div className={'heading'}>

					<Tooltip text={ __( 'Toogle Logical NOT', 'ccobo' ) }>
						<Button onClick={ () => toggleProp( 'not' ) } className={ classnames( 'toogle-not', ( item.props.not ? 'is-not' : '' ) ) }>{ '!' }</Button>
					</Tooltip>

					<Tooltip text={ __( 'Toogle Relation', 'ccobo' ) }>
						<Button onClick={ () => toggleProp( 'relation' ) }>{ item.props.relation }</Button>
					</Tooltip>

					<span className={'spacer'}></span>

					<Tooltip text={ __( 'Add Condition to Group', 'ccobo' ) }>
						<Button onClick={ addItem }><Icon icon="plus" /></Button>
					</Tooltip>

					<Tooltip text={ __( 'Add Nested Group', 'ccobo' ) }>
						<Button onClick={ addGroup }><Icon icon="plus-alt" /></Button>
					</Tooltip>

					{ rootItemId !== item.id && <Tooltip text={ __( 'Remove Group', 'ccobo' ) }>
						<Button onClick={ removeItem }><Icon style={ { color: 'red' } } icon="no" /></Button>
					</Tooltip> }

				</div>
				{ [...item.children].map( ( item, index ) => <ListItem
					key={ item.id }
					index={ index }
					item={ item }
					items={ items }
					setItems={ setItems }
				/> ) }
			</div>
		</Item>;
	}

	// no group
	const Nix = props => null;
	const ConditionInner = applyFilters( 'ccobo.component.' + item.type, Nix );
	return <Item
		key={item.id}
		identifier={item.id}
		index={index}
		isUsedCustomDragHandlers={ true }
	>
		<div className={'item'}>
			<DragHandle/>
			<div className={'heading'}>

				<Tooltip text={ __( 'Toogle Logical NOT', 'ccobo' ) }>
					<Button onClick={ () => toggleProp( 'not' ) } className={ classnames( 'toogle-not', ( item.props.not ? 'is-not' : '' ) ) }>{ '!' }</Button>
				</Tooltip>

				<span className={'spacer'}></span>

				<Tooltip text={ __( 'Remove Condition', 'ccobo' ) }>
					<Button onClick={ removeItem }><Icon style={ { color: 'red' } } icon="no" /></Button>
				</Tooltip>

			</div>

			<div className="item-inner">
				<ConditionSelect
					type={ item.type }
					updateItem={ updateItem }
				/>
			</div>

			{ ConditionInner && Nix !== ConditionInner && <div className="item-inner condition">
				<ConditionInner
					item={ item }
					updateItem={ updateItem }
				/>
			</div> }
		</div>
	</Item>;
};

export const Conditions = ( {
	items,
	setItems,
} ) => {

	const ItemGhost = ( {
		identifier,
		isGroup,
	} ) => {
		const item = findItem( items, identifier );
		const not = get( item, ['props','not'], false );
		if ( isGroup ) {
			return <GroupGhost
				item={ item }
				className={ 'ghost' }
			/>
		}
		return <div className={ classnames('item', 'ghost') }>
			<DragHandle isGhost/>
			<Button style={ { opacity: not ? '1' : '0.25' } }>{ '!' }</Button>
			<span className={'spacer'}></span>
			<Button><Icon style={ { color: 'red' } } icon="no" /></Button>
		</div>;
	};

	const GroupStacked = ( {
		identifier,
		style,
	} ) => <GroupGhost
		item={ findItem( items, identifier ) }
		className={ 'stacked' }
	>
		<div className={'dropLine'} />
	</GroupGhost>;

	const onDragEnd = useCallback( meta => {
		const {
			groupIdentifier,
			identifier,
			index,
			isGroup,
			nextGroupIdentifier,
			nextIndex,
		} = meta;

		if ( rootItemId === identifier
			|| undefined == groupIdentifier
			|| undefined == nextGroupIdentifier
			|| ( groupIdentifier === nextGroupIdentifier && index === nextIndex )
		)
			return;

		const newItems = cloneDeep( items );
		const item = findItem( newItems, identifier );
		if ( item == undefined )
			return;

		const groupItem = findItem( newItems, groupIdentifier );
		if ( groupItem == undefined || groupItem.children == undefined )
			return;

		if ( groupIdentifier === nextGroupIdentifier ) {
			groupItem.children = arrayMove(
				groupItem.children,
				index,
				isInteger( nextIndex )
					? nextIndex
					: groupItem.children.length > 0 ? groupItem.children.length : 0,
			);
		} else {
			const nextGroupItem = findItem( newItems, nextGroupIdentifier );
			if ( nextGroupItem == undefined || nextGroupItem.children == undefined )
				return;
			groupItem.children.splice( index, 1 );
			if ( nextIndex == undefined ) {
				// Inserts an item to a group which has no items.
				nextGroupItem.children.push( item );
			} else {
				// Insets an item to a group.
				nextGroupItem.children.splice( nextIndex, 0, item );
			}
		}

		setItems( newItems );
	}, [items] );

	return <List
		className={ 'ccobo-controls wrapper' }
		renderDropLine={ DropLine }
		renderGhost={ ItemGhost }
		renderPlaceholder={ ItemPlaceholder }
		renderStackedGroup={ GroupStacked }
		itemSpacing={ 12 }
		draggingCursorStyle="grabbing"
		onDragEnd={ onDragEnd }
	>
		{ [...items].map( ( item, index ) => <ListItem
			key={ item.id }
			index={ index }
			item={ item }
			items={ items }
			setItems={ setItems }
		/> ) }
	</List>;
};

export default Conditions;
