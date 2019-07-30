// import {Subject} from 'rxjs/Subject';
// import {IAppState} from '../store/store'; // HINT

import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MockNgRedux} from '@angular-redux/store/lib/testing';

import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {select} from '@angular-redux/store';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import * as ts from 'typescript';

import {TestConstants} from './test.constants';
import { TestService } from './test.service';

describe('TestService', () => {

  let service: TestService;

  const tokenUrl: string = 'http://localhost:8080/api/token';

  let httpMock: HttpTestingController;
//  let logHitSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TestService,
        {
          provide: testConstants.url,
          useValue: tokenUrl
        }
      ],
      declarations: []
    });

    MockNgRedux.reset();
  });

  beforeEach(() => {
    service = TestBed.get(TestService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('and getApiResponse', () => {

    it('should http get', () => {
      const searchEnabled: Subject<boolean> = MockNgRedux.getSelectorStub<IAppState, boolean>('searchEnabled');
      searchEnabled.next(true);

      const apiResponse = {
        stringValue: 'result'
      };

      service.getApiResponse(true).subscribe((result) => {
        expect(result).toBeTruthy();
      });

      .... TODO httpMock.expectOne(tokenUrl).flush(tokenResponse);

      const searchReq = httpMock.expectOne(req => req.method === 'GET' && req.url === searchUrl);
      searchReq.flush(searchResponse);

      expect(searchReq.request.headers.keys().length).toEqual(1);
      expect(searchReq.request.headers.keys()).toContain('x-stuff');
      expect(searchReq.request.headers.get('x-stuff')).toBe('api');
    });

    it('should handle getApiResponse failure', () => {

      service.lookup(address).subscribe((resp) => {
          expect(resp).toBeUndefined();
        },
        (err: HttpErrorResponse) => {
          expect(err.error.type).toEqual('something failed!!');
        }
      );

      httpMock.expectOne(tokenUrl).flush(tokenResponse);

      const searchReq = httpMock.expectOne(req => req.method === 'GET' && req.url === searchUrl);
      searchReq.error(new ErrorEvent('something failed!!'));

      expect(lookupReq.request.headers.keys().length).toEqual(1);
      expect(lookupReq.request.headers.keys()).toContain('token');
      expect(lookupReq.request.headers.get('token')).toBe('1234');
    });

  });

  describe('and storeResult', () => {
    it('should http post', () => {
      // Given
      logHitSpy = spyOn(service, 'logHit').and.returnValue(Observable.of('success'));
      // When
      // Then
      service.hit('a hit').subscribe((response: string) => {
        expect(response).toEqual('success');
      });
      expect(logHitSpy).toHaveBeenCalledWith('a hit');
    });

    it('should fail http post ', () => {
      logHitSpy = spyOn(service, 'logHit').and.returnValue(Observable.throw('ERROR'));
      service.hit('a hit').subscribe(
        (response: string) => { },
        error => {
          expect(error).toEqual([
            {
              message: 'log failed',
              type: 'ERROR',
              closable: false
            }
          ]);
        }
      );
    });
  });

});
