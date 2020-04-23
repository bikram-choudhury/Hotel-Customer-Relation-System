import { createAction, props } from '@ngrx/store';
import { Category, Item } from '../../application.types';

export const getItemCategories = createAction(
    '[Category] fetch categories',
);

export const saveItemCategories = createAction(
    '[Category] save categories',
    props<{ payload: Category[] }>()
);

export const getItems = createAction(
    '[Items] fetch items',
);

export const saveItems = createAction(
    '[Items] save items',
    props<{ payload: Item[] }>()
);