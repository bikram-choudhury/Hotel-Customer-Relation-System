import { Action, createReducer, on } from '@ngrx/store';
import { Item } from '../../application.types';
import { saveItems } from '../actions/item.action';

export const initialState: Item[] = [];

export const featureKey = 'items';

export const itemReducer = createReducer(
    initialState,
    
    on(saveItems, (state, { payload }) => {
        return [...payload]
    })
)

export function reducer(state: Item[] | undefined, action: Action) {
    return itemReducer(state, action);
}