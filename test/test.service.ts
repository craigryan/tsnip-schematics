import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

interface ApiResponse {
  stringValue: string
}

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl: string;

  constructor(private http: HttpClient, private url: string) {
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
}
