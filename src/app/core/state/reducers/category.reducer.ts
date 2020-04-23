import { Action, createReducer, on } from '@ngrx/store';
import { Category } from '../../application.types';
import { saveItemCategories } from '../actions/item.action';

export const initialState: Category[] = [];

export const featureKey = 'categories';

export const categoryReducer = createReducer(
    initialState,

    on(saveItemCategories, (state, { payload }) => {
        return [...payload]
    })
)

export function reducer(state: Category[] | undefined, action: Action) {
    return categoryReducer(state, action);
}