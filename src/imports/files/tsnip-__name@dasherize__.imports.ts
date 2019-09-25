<%# Imports determined to be requiried based on original imports found in the source under test %>
import {TestBed, inject, fakeAsync, ComponentFixture, async} from '@angular/core/testing';
import {DebugElement, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

<%# Imports present in the source under test, include these in the test .spec.ts also %>

<% if (imports) { %>
<%   for (let rimport of imports) { %>
    <%     if (rimport.from) { %>
import <%= rimport.imports %> from <%= rimport.from %>;
<%     } else { %>
<%        if (rimport.originalImport) { %>
<%= rimport %>;
<%        } else { %>
import <%= rimport %>;
<%        } %>
<%     } %>
<%   } %>
<% } %>

import { <%= classify(className) %>Service } from './<%= dasherize(name) %>';
