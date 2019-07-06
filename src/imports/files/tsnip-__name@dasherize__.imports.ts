<%# Imports determined to be requiried based on original imports found in the source under test %>
import {TestBed, inject, fakeAsync, ComponentFixture} from '@angular/core/testing';
import {DebugElement, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

<% if (libraries && libraries.includes('commonhttp')) { %>
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
<% } %>
<% if (libraries && libraries.includes('redux')) { %>
import {MockNgRedux, NgReduxTestingModule} from '@angular-redux/store/lib/testing';
<% } %>

<%# Imports present in the source under test, include these in the test .spec.ts also %>

<% if (requiredImports) { %>
<%   for (let rimport of requiredImports) { %>
<%= rimport %>
<%   } %>
<% } %>

import { <%= classify(className) %>Service } from './<%= dasherize(name) %>';
