import { createReducer, on, Action } from '@ngrx/store';
import { Cart } from '../../application.types';
import { saveItemToCart } from '../actions/cart.action';

export const initialState: Cart[] = [];

export const featureKey = 'cart';

export const cartReducer = createReducer(
    initialState,

    on(saveItemToCart, (state, { payload }) => {
        return [...payload];
    })
);

export function reducer(state: Cart[] | undefined, action: Action) {
    return cartReducer(state, action);
}