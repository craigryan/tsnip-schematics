import * as ts from 'typescript';
import * as parsec from '../ts/parse-class';
import * as parsem from '../ts/parse-method';
import * as parse from '../ts/parse';
import * as angular from '../utils/angular';

// Service specific class processor

export function serviceClass(node: ts.Node, options: any): void {
  // const ctor: ts.Node = parsec.findClassConstructor(node);
  // const paramList: parsec.ParamList = parsec.findConstructorParameters(ctor);

  options.class = {
  };
}

