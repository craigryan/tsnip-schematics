import {
  Rule,
  SchematicContext,
  Tree,
  template,
  move,
  apply,
  chain,
  mergeWith,
  url,
  MergeStrategy,
  schematic
} from '@angular-devkit/schematics';

import {join, Path, strings, normalize} from '@angular-devkit/core';

import * as ts from 'typescript';
import * as parse from '../ts/parse';
import * as parsec from '../ts/parse-class';
import * as parsem from '../ts/parse-method';
import * as parsep from '../ts/parse-params';
import * as parseb from '../ts/parse-block';

import * as angular from '../utils/angular';
import { format } from '../utils/format';
import { tsSource } from '../ts/source';

// import * as parsem from './parse-method';
// import * as parsei from './parse-import';

import {constants} from '../utils/constants';
import * as service from './service';

function addParsed(node: ts.Node, options: any): void {
  const ctor: ts.Node = parsec.findClassConstructor(node);
  const paramList: parsep.ParamDeclarationList = parsec.findConstructorParameters(ctor);
  // parsed holds helper references not required for code generation
  options.parsed = {
    ctor: parse.cleanNode(ctor),
    ctorParams: paramList
  };
}

function addMocks(node: ts.Node, options: any): void {
  // mocks and standardMocks
  options.mocks = [];
  options.standardMocks = [];
  if (options.parsed && options.parsed.ctorParams && options.parsed.ctorParams.params && options.parsed.ctorParams.params.length > 0) {
    for (const p of options.parsed.ctorParams.params) {
      p.node = parse.cleanNode(node);
      if (!parse.isStandardType(p.typeReference)) {
        if (angular.Types.knownServiceType(p.typeReference)) {
          options.standardMocks.push(p);
        } else {
          options.mocks.push(p);
        }
      }
    }
  }
}

function addLets(node: ts.Node, options: any): void {
  // let declarations

  // todo: if ctor params have a store: Store<IMyType> (ngrx) then gen
  //    let mockstore: MockStore<IMyType>;
  options.lets = [];

//  console.log('-- lets libaries', options.libraries);
//  console.log('-- lets mocks', options.mocks);

  if (options.libraries && options.libraries.includes('redux-store')) {
  	options.lets.push({decl: 'let', name: 'reduxDispatchSpy'});
	  options.lets.push({decl: 'let', name: 'reduxSelectSpy'});
  }
  for (const mock of options.mocks) {
    options.lets.push({decl: 'let', name: mock.name, type: mock.typeReference});
  }
  for (const smock of options.standardMocks) {
    switch (smock.typeReference) {
    case 'HttpClient':
      options.lets.push({decl: 'let', name: 'httpMock', type: 'HttpTestingController'});
      break;
    case 'Router':
      options.lets.push({decl: 'let', name: 'router', type: 'Router'});
      break;
    default:
      break;
    }
  }
  // console.log('-- lets', options.lets);
}

function addBeforeAndAfterEach(node: ts.Node, options: any): void {
  // top level beforeEach()
  // -- lets libaries [ 'commonhttp', 'redux-store', 'redux' ]
  options.beforeeach = {
    calls: [],
    imports: [],
    providers: []
  };
  options.aftereach = {
    calls: []
  };
  
  for (const smock of options.standardMocks) {
    switch (smock.typeReference) {
    case 'HttpClient':
      options.beforeeach.imports.push('HttpClientTestingModule');
      options.beforeeach.imports.push('HttpClientModule');
      options.beforeeach.calls.push('httpMock = TestBed.get(HttpTestingController);');
      options.aftereach.calls.push('httpMock.verify()');
      break;
    }
  }

  for (const lib of options.libraries) {
    switch (lib) {
    case 'redux-store':
      options.beforeeach.imports.push('NgReduxTestingModule');
      options.beforeeach.calls.push('reduxDispatchSpy = spyOn(MockNgRedux.mockInstance, \'dispatch\')');
      options.beforeeach.calls.push('reduxSelectSpy = spyOn(MockNgRedux.mockInstance, \'select\')');
      options.beforeeach.calls.push('MockNgRedux.reset()');
      break;
    }
  }

  for (const mock of options.mocks) {
	  options.beforeeach.providers.push(
      {provide: mock.typeReference, useClass: 'Mock' + mock.typeReference}
    );
  }

  // todo add provideMockStore({}) for ngrx
  // and     mockStore = TestBed.get(Store);
  // spyOn(mockStore, 'dispatch')
}

export function serviceSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fileNode = tsSource(options.sourcePath);
    const serviceNode: ts.Node = parse.findClassDeclarationForDecorator(fileNode, 'Injectable');

    addParsed(serviceNode, options);
    addMocks(serviceNode, options);
    addLets(serviceNode, options);
    addBeforeAndAfterEach(serviceNode, options);
    service.serviceClass(fileNode, serviceNode, options);

    const rule = chain([
      schematic(constants.importsSchematic, options),
      mergeWith(
        apply(url('./files'), [
          (tree: Tree, _context: SchematicContext) => {
            const x = {
              ...strings, ...options
            };
            // console.log('--- service options', x);
            return tree;
          },
          template({
            ...strings, ...options
          }),
          move(options.outputPath),
          format(options.outputPath)
        ]),
        MergeStrategy.Default
      )
    ]);

    return rule(tree, context);
  };
}
