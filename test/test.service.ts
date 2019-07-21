import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {select} from '@angular-redux/store';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import * as ts from 'typescript';

import {TestConstants} from './test.constants';

interface ApiResponse {
  stringValue: string
}

class MyType {
  typeName: String;
}

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
      this.secretMethod(url);
    }
    requestArguments.headers['x-stuff'] = 'api';
    if (this.searchEnabled) {
      requestArguments.headers['x-search'] = 'on';
    }
    return this.http.get<ApiResponse>(url, requestArguments)
      .pipe(
        map(response => {
          return response.stringValue;
        })
      );
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
