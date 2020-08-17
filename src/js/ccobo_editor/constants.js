/**
 * Exteral dependencies
 */
import shortid from "shortid";


// Constants

export const rootItemId = "root";

export const itemDefault = {
	type: '',
	id: shortid(),
	props: {},
	children: undefined,
};

export const rootItemDefault = {
	type: 'ccobo.group',
	id: rootItemId,
	props: { relation: 'OR', },
	children: [],
};
