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
import * as parsec from '../ts/parse-class';
import * as parse from '../ts/parse';
import * as angular from '../utils/angular';
import { tsSource } from '../ts/source';

// import * as parsem from './parse-method';
// import * as parsei from './parse-import';

import {constants} from '../utils/constants';

function addMocks(node: ts.Node, options: any): void {
  // mocks and standardMocks
  const ctor: ts.Node = parsec.findClassConstructor(node);
  const paramList: parsec.ParamList = parsec.findConstructorParameters(ctor);
  console.log('-- paramList ', paramList);
  options.mocks = [];
  options.standardMocks = [];
  if (paramList.params.length > 0) {
    paramList.params.forEach((p: parsec.ParamDetails) => {
      // console.log('-- param ', p);
      if (!parse.isStandardType(p.typeReference)) {
        if (angular.Types.knownServiceType(p.typeReference)) {
          options.standardMocks.push(p);
        } else {
          options.mocks.push(p);
        }
      }
    });
  }
}

function addLets(node: ts.Node, options: any): void {
  // let declarations

  // todo: if ctor params have a store: Store<IMyType> (ngrx) then gen
  //    let mockstore: MockStore<IMyType>;
  options.lets = [];

  console.log('-- lets libaries', options.libraries);
  console.log('-- lets mocks', options.mocks);

  if (options.libraries && options.libraries.includes('redux-store')) {
	options.lets.push({decl: 'let', name: 'reduxDispatchSpy'});
	options.lets.push({decl: 'let', name: 'reduxSelectSpy'});
  }
  for (let mock of options.mocks) {
    options.lets.push({decl: 'let', name: mock.name, type: mock.typeReference});
  }
  for (let smock of options.standardMocks) {
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
  console.log('-- lets', options.lets);
}

function addBeforeEach(node: ts.Node, options: any): void {
  // top level beforeEach()
  options.beforeeach = {
    providers: [],
    imports: []
  }
  
  // todo add provideMockStore({}) for ngrx
  // and     mockStore = TestBed.get(Store);
  // spyOn(mockStore, 'dispatch')
}

export function serviceSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const node = tsSource(options.sourcePath);

    addMocks(node, options);
    addLets(node, options);
    addBeforeEach(node, options);

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
          move(options.outputPath)
        ]),
        MergeStrategy.Default
      )
    ]);

    return rule(tree, context);
  };
}
