import { Injectable } from '@angular/core';
import { ApiService } from './api.sesrvice';
import { Resolve } from '@angular/router';

@Injectable({
    'providedIn': 'root'
})
export class OrderDetailsService implements Resolve<any>{

    private URL: string = 'http://localhost:3000/api';
    constructor(private _api: ApiService) { }

    resolve() {
        return this._api.get(this.URL, 'cart', null, { 'Authentication-Required': 'true' });
    }
}