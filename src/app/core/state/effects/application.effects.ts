import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Category, Item, RequestBodyForSignIn, Token, RequestBodyForSignUp } from '../../application.types';
import { ApplicationService } from '../../services/application.service';
import { getApplicationData } from '../actions/application.action';
import { getItemCategories, getItems, saveItemCategories, saveItems } from '../actions/item.action';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { submitCartItems, handleCartItemSubmitSuccess, handleCartItemSubmitError } from '../actions/cart.action';
import { validateUser, setTokens, createUser } from '../actions/auth.action';


@Injectable()
export class ApplicationEffects {
    constructor(
        private _actions$: Actions,
        private _applicationService: ApplicationService
    ) { }

    getApplicationData$ = createEffect(() => this._actions$.pipe(
        ofType(getApplicationData.type),
        switchMap(_ => {
            return forkJoin(
                this._applicationService.fetchCategories(),
                this._applicationService.fetchItems()
            )
        }),
        mergeMap(([categoryResponse, itemResponse]: any) => {
            const categories: Category[] = categoryResponse.body;
            const items: Item[] = itemResponse.body;
            return [
                saveItemCategories({ payload: categories }),
                saveItems({ payload: items })
            ]
        })
    ));

    getItemCategories$ = createEffect(() => this._actions$.pipe(
        ofType(getItemCategories.type),
        switchMap(_ => {
            return this._applicationService.fetchCategories().pipe(
                map(categories => {
                    return saveItemCategories({ payload: categories });
                }),
                catchError(_ => EMPTY)
            )
        })
    ));

    getItems$ = createEffect(() => this._actions$.pipe(
        ofType(getItems.type),
        switchMap(_ => {
            return this._applicationService.fetchItems().pipe(
                map(items => {
                    return saveItems({ payload: items });
                }),
                catchError(_ => EMPTY)
            )
        })
    ));

    submitCartItems$ = createEffect(() => this._actions$.pipe(
        ofType(submitCartItems.type),
        switchMap(({ payload }) => {
            return this._applicationService.submitCartItems(payload).pipe(
                map(_ => {
                    return handleCartItemSubmitSuccess();
                }),
                catchError(error => of(handleCartItemSubmitError(error)))
            )
        })
    ))

    validateUser$ = createEffect(() => this._actions$.pipe(
        ofType(validateUser.type),
        switchMap(({ payload }: { payload: RequestBodyForSignIn }) => {
            return this._applicationService.validateUser(payload).pipe(
                map((response: any) => {
                    const tokens: Token = response;
                    return setTokens({
                        payload: {
                            accessToken: tokens.accessToken,
                            tokenType: tokens.tokenType
                        }
                    });
                }),
                catchError(error => EMPTY)
            )
        })
    ))
    createUser$ = createEffect(() => this._actions$.pipe(
        ofType(createUser.type),
        switchMap(({ payload }: { payload: RequestBodyForSignUp }) => {
            return this._applicationService.createUser(payload).pipe(
                map((response: any) => {
                    const tokens: Token = response;
                    return setTokens({
                        payload: {
                            accessToken: tokens.accessToken,
                            tokenType: tokens.tokenType
                        }
                    });
                }),
                catchError(error => EMPTY)
            )
        })
    ))
}