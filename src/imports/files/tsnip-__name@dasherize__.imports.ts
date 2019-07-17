<%# Imports determined to be requiried based on original imports found in the source under test %>
import {TestBed, inject, fakeAsync, ComponentFixture, async} from '@angular/core/testing';
import {DebugElement, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

<%# if (libraries && libraries.includes('commonhttp')) { %>
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
<%# } %>
<%# if (libraries && libraries.includes('redux')) { %>
import {MockNgRedux, NgReduxTestingModule} from '@angular-redux/store/lib/testing';
<%# } %>
<%# if (libraries && libraries.includes('ngrx')) { %>
import { provideMockStore, MockStore } from '@ngrx/store/testing';
<%# } %>
<%# if (libraries && libraries.includes('forms')) { %>
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<%# } %>

<%# Imports present in the source under test, include these in the test .spec.ts also %>

<% if (imports) { %>
<%   for (let rimport of imports) { %>
<%= rimport %>
<%   } %>
<% } %>

import { <%= classify(className) %>Service } from './<%= dasherize(name) %>';
