import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicationStore } from '../application.types';
import { Logout } from 'src/app/core/state/actions/auth.action';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
    accessToken: string;
    tokenType: string;
    constructor(private _store: Store<ApplicationStore>) {
        this._store.select('auth').subscribe(allTokens => {
            this.accessToken = allTokens.accessToken;
            this.tokenType = allTokens.tokenType;
        });
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isTokenRequired = request.headers.get('Authentication-Required') === 'true';
        if (isTokenRequired) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${this.tokenType} ${this.accessToken}`
                }
            });
        }
        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 401) {
                    this._store.dispatch(Logout());
                }
                return EMPTY;
            })
        )
    }
}