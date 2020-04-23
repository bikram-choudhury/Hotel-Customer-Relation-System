import { createAction, props } from '@ngrx/store';
import { RequestBodyForSignIn, RequestBodyForSignUp, Token } from '../../application.types';

export const validateUser = createAction(
    '[Auth] validate user',
    props<{ payload: RequestBodyForSignIn }>()
);
export const createUser = createAction(
    '[Auth] create user',
    props<{ payload: RequestBodyForSignUp }>()
);

export const setTokens = createAction(
    '[Auth] set auth tokes',
    props<{ payload: Token }>()
);

export const Logout = createAction('LOGOUT');

export const showSigninSignupModal = createAction('[Auth] show user login modal');