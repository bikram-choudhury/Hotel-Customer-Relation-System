import { Injectable } from '@angular/core';
import { ApiService } from './api.sesrvice';
import { Category, Item, Cart, RequestBodyForSignIn, RequestBodyForSignUp } from '../application.types';
import { Observable } from 'rxjs';

@Injectable()
export class ApplicationService {
    private URL: string = 'http://localhost:3000/api';

    constructor(private _api: ApiService) { }

    fetchCategories(): Observable<Category[]> {
        return this._api.get(this.URL, 'categories');
    }
    fetchItems(): Observable<Item[]> {
        return this._api.get(this.URL, 'items');
    }
    submitCartItems(payload: Cart[]): Observable<boolean> {
        return this._api.post(this.URL, 'cart', payload, null, { 'Authentication-Required': 'true' });
    }
    validateUser(payload: RequestBodyForSignIn): Observable<boolean> {
        return this._api.post(this.URL, 'auth/signin', payload);
    }
    createUser(payload: RequestBodyForSignUp): Observable<boolean> {
        return this._api.post(this.URL, 'auth/signup', payload);
    }
}