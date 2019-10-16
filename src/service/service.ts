import * as ts from 'typescript';
import * as parsec from '../ts/parse-class';
import * as parsem from '../ts/parse-method';
import * as parseb from '../ts/parse-block';
import * as parse from '../ts/parse';
import * as angular from '../utils/angular';

// Service specific class processor

export function serviceClass(fileNode: ts.Node, serviceNode: ts.Node, options: any): void {
  // const ctor: ts.Node = parsec.findClassConstructor(node);
  // const paramList: parsec.ParamList = parsec.findConstructorParameters(ctor);
  // const importNodes: ts.Node[] = parse.findImportStatements(fileNode);

  options.clazz = {
    name: '',
    methods: []
  };
  const ctorNode: ts.Node = parsec.findClassConstructor(serviceNode);
  options.clazz.name = parsec.findClassName(serviceNode);
  // const ctorDeclList: parsep.ParamDeclarationList = parsec.findConstructorParameters(ctorNode);
  const methods: ts.Node[] = parsec.findClassMethods(serviceNode, true);
  if (methods) {
    methods.forEach(method => {
      const methodDetails: parsem.MethodDetails = parsem.findMethodDeclaration(method);
      const bodyNode: ts.Node = parsem.findMethodBody(method);
      const methodCalls: parseb.MethodCall[] = parseb.findCallDetails(bodyNode);
      options.clazz.methods.push({
        calls: [],
        name: methodDetails.name
      });
    });
  }
}

/*
function methodCalls(calls: parseb.MethodCall[]): any[] {
  const mcalls = [];
  calls.forEach(call => {
    
  });
  return mcalls;
}
*/

function go(fileNode: ts.Node, options: any): void {
  // console.log('-- go import #', importNodes.length);
  // service class
  const serviceClassNode: ts.Node = parse.findClassDeclarationForDecorator(fileNode, 'Injectable');
  // console.log('-- go service class for decorator', serviceClassNode === undefined ? 'UNDEF' : 'FOUND');
  // class - ctor details & methods
  const classDeclNodes: ts.Node[] = parsec.findClassDeclarations(serviceClassNode);
  const ctorNode: ts.Node = parsec.findClassConstructor(serviceClassNode);
  const methods: ts.Node[] = parsec.findClassMethods(serviceClassNode, true);
  console.log('-- go method #', methods.length);
  // method - body calls
  const methodDetails: parsem.MethodDetails = parsem.findMethodDeclaration(methods[0]);
  console.log('-- go method 0 details name ', methodDetails.name, ' isPriv? ', methodDetails.isPrivate, ' retType ', !!methodDetails.returnType);
  const bodyNode: ts.Node = parsem.findMethodBody(methods[0]);
  const methodCalls: parseb.MethodCall[] = parseb.findCallDetails(bodyNode);
  console.log('-- go method calls #', methodCalls.length);
}

function addMethodBody(method: ts.Node, options: any): void {
  const methodDecl: parsem.MethodDetails = parsem.findMethodDeclaration(method);
  // if (options.parsed.ctorParams && options.parsed.ctorParams.params.length > 0) {
  options.methods.push({
    calls: parseb.generateMethodCalls(options.parsed.ctorParams, method, methodDecl),
    name: methodDecl.name
  });
}

function addMethods(node: ts.Node, options: any): void {
  const publicMethods: ts.Node[] = parsec.findClassMethods(node, true);
  if (publicMethods && publicMethods.length > 0) {
    options.methods = [];
    publicMethods.forEach((method: ts.Node) => {
      addMethodBody(method, options);
    });
  }
}
