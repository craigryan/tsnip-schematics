// tslint:disable-next-line: ordered-imports
import { Injectable, Inject } from '@angular/core';
// tslint:disable-next-line: ordered-imports
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import * as ts from 'typescript';
// tslint:disable-next-line: ordered-imports
import 'rxjs/everything';

import {aaa, bbb} from '../my.imports';
import {TestConstants} from './test.constants';

import ext = require('ext-lib');

import {select} from '@angular-redux/store';

interface ApiResponse {
  stringValue: string
}

class MyType {
  public typeName: string;
}

// tslint:disable-next-line: max-classes-per-file
@Injectable({
  providedIn: 'root'
})
export class TestService {

  @select() readonly searchEnabled$: Observable<boolean>;

  private apiUrl: string;
  searchEnabled: boolean;

  constructor(
    private http: HttpClient,
    private myType: MyType,
    @Inject(TestConstants.url) url: string) {
    this.apiUrl = url;
  }

  getApiResponse(ignoreErrors: boolean = false): Observable<string> {
    const url: string = `${this.apiUrl}`;
    const requestArguments = {
      headers: {},
      withCredentials: true
    };
    if (this.hasSecrets) {
      console.log('calling secretMethod');
      this.secretMethod(url);
    }
    requestArguments.headers['x-stuff'] = 'api';
    if (this.searchEnabled) {
      requestArguments.headers['x-search'] = 'on';
    }
    return this.http.get<ApiResponse>(url, requestArguments)
      .pipe(
        map(response => {
          return response.stringValue || this.secretString();
        }),
        map((responseString: string) => responseString.toUpperCase())
      );
  }

  secretString(): string {
    return 'a secret;'
  }

  public storeResult(result: string): void {
    const body: string = '{ flag: 1 }';
    this.http.post(url, body);
  }

  private get hasSecrets(): boolean {
    return true;
  }

  private secretMethod(url: string) {
    // do stuff with secret params
  }

  private searchEnabledSubscribe(): Observable<boolean> {
    return this.searchEnabled$
      .first((enabled) => !!enabled).map(() => this.searchEnabled = true);
  }
}
