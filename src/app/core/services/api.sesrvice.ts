import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
    apiHeaders: { [key: string]: string } = {
        'Content-Type': 'application/json',
        'Authentication-Required': 'false',
    };
    private defaultAPIRequestHeaders = {
        headers: new HttpHeaders(this.apiHeaders) // add more common headers as required
    };

    constructor(private http: HttpClient) { }

    private formatErrors(error: any) {
        // to be used to format errors to have common format, depends on API contracts
        return throwError(error);
    }

    get(
        url: string,
        path: string,
        params: HttpParams = new HttpParams(),
        headers = {}
    ): Observable<any> {
        const requestHeaders = { ...this.apiHeaders, ...headers };
        const defaultHeaders = {
            headers: new HttpHeaders(requestHeaders)
        };
        return this.http
            .get(`${url}/${path}`, { params, headers: defaultHeaders.headers, observe: 'response' })
            .pipe(catchError(this.formatErrors));
    }

    put(url: string, path: string, body = {}, options = {}, headers = {}): Observable<any> {
        const requestHeaders = { ...this.apiHeaders, ...headers };
        this.defaultAPIRequestHeaders = {
            headers: new HttpHeaders(requestHeaders) // add more common headers as required
        };
        const apiOptions = { ...this.defaultAPIRequestHeaders, ...options };
        return this.http
            .put(`${url}/${path}`, JSON.stringify(body), apiOptions)
            .pipe(catchError(this.formatErrors));
    }

    patch(url: string, path: string, body = {}, options = {}, headers = {}): Observable<any> {
        const requestHeaders = { ...this.apiHeaders, ...headers };
        this.defaultAPIRequestHeaders = {
            headers: new HttpHeaders(requestHeaders) // add more common headers as required
        };
        const apiOptions = { ...this.defaultAPIRequestHeaders, ...options };
        return this.http
            .patch(`${url}/${path}`, JSON.stringify(body), apiOptions)
            .pipe(catchError(this.formatErrors));
    }

    post(url: string, path: string, body = {}, options = {}, headers = {}): Observable<any> {
        const requestHeaders = { ...this.apiHeaders, ...headers };
        this.defaultAPIRequestHeaders = {
            headers: new HttpHeaders(requestHeaders) // add more common headers as required
        };
        const apiOptions = { ...this.defaultAPIRequestHeaders, ...options };
        return this.http
            .post(`${url}/${path}`, JSON.stringify(body), apiOptions)
            .pipe(catchError(this.formatErrors));
    }

    delete(url: string, path: string): Observable<any> {
        const defaultHeaders = this.defaultAPIRequestHeaders;
        return this.http
            .delete(`${url}/${path}`, {
                headers: defaultHeaders.headers
            })
            .pipe(catchError(this.formatErrors));
    }
}
