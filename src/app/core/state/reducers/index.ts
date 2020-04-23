import { ActionReducerMap, ActionReducer, Action, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ApplicationStore } from '../../application.types';
import * as items from './item.reducer';
import * as categories from './category.reducer';
import * as cart from './cart.reducer';
import * as auth from './auth.reducer';

export const reducers: ActionReducerMap<ApplicationStore> = {
    items: items.reducer,
    categories: categories.reducer,
    cart: cart.reducer,
    auth: auth.reducer
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({
        keys: [cart.featureKey, auth.featureKey],
        rehydrate: true,
        storage: sessionStorage
    })(reducer);
}

export function clearState(reducer: ActionReducer<any>) {
    return (state: ApplicationStore, action: Action) => {
        if (action.type === 'LOGOUT') {
            state = {
                ...state,
                auth: auth.initialState
            };
        }
        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer, clearState];