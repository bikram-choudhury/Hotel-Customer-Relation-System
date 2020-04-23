import { Action, createReducer, on } from '@ngrx/store';
import { Token } from '../../application.types';
import { setTokens } from '../actions/auth.action';

export const initialState: Token = {
    accessToken: '',
    tokenType: ''
};

export const featureKey = 'auth';

export const authReducer = createReducer(
    initialState,

    on(setTokens, (state, { payload }) => {
        return { ...payload };
    })
);

export function reducer(state: Token | undefined, action: Action) {
    return authReducer(state, action);
}