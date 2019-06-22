import { tsSource } from '../ts/source';
import * as parse from './parse';
import * as parsec from './parse-class';
import * as parsem from './parse-method';
import * as ts from 'typescript';

describe('Parsing', () => {

  let fileNode: ts.Node;
  const sourcePath = 'test/test.service.ts';

  beforeEach(() => {
    fileNode = tsSource(sourcePath);
  });

  describe('in source file', () => {

    it('should find imports', () => {
      const n: Array<any> = parse.findImportStatements(fileNode);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(4);
    });
    it('should find class declaration', () => {
      const n = parse.findClassDeclaration(fileNode);
      expect(n).toBeTruthy();
      expect(n.kind).toBeTruthy();
      expect(n.kind).toEqual(ts.SyntaxKind.ClassDeclaration);
    });
    it('should find class name', () => {
      const clz = parse.findClassDeclaration(fileNode);
      const name = parsec.findClassName(clz);
      expect(name).toEqual('TestService');
    });
  });
  describe('in class', () => {
    it('should find decorator', () => {
      const n = parsec.findClassDecorator(fileNode);
      expect(n).toBeTruthy();
      expect(n.kind).toBeTruthy();
      expect(n.kind).toEqual(ts.SyntaxKind.Decorator);
    });
    it('should find declarations', () => {
      const n: Array<any> = parsec.findClassDeclarations(fileNode);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(1);
      for (let decl of n) {
        expect(decl.kind).toEqual(ts.SyntaxKind.PropertyDeclaration);
      }
    });
    it('should find constructor', () => {
      const n = parsec.findClassConstructor(fileNode);
      expect(n).toBeTruthy();
      expect(n.kind).toBeTruthy();
      expect(n.kind).toEqual(ts.SyntaxKind.Constructor);
    });
    it('should find public methods', () => {
      const n: Array<any> = parsec.findClassMethods(fileNode, true);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(2);
      for (let decl of n) {
        expect(decl.kind).toEqual(ts.SyntaxKind.MethodDeclaration);
        // const n: parsem.MethodDeclaration = parsem.findMethodDeclaration(decl);
      }
    });
    it('should find public and private methods', () => {
      const n: Array<any> = parsec.findClassMethods(fileNode, false);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(3);
      for (let decl of n) {
        expect(decl.kind).toEqual(ts.SyntaxKind.MethodDeclaration);
        // const n = parsem.findMethodDeclaration(decl);
      }
    });
  });
  describe('in methods', () => {
    it('should find method declaration', () => {
      const methods: Array<any> = parsec.findClassMethods(fileNode, true);
      const firstMethod = methods[0];
      const n: parsem.MethodDeclaration = parsem.findMethodDeclaration(firstMethod);
      // console.log('t decl', n);
      expect(n).toBeTruthy();
      expect(n.name).toBeTruthy();
      expect(n.name).toEqual('getApiResponse');
      expect(n.parameters).toBeTruthy();
    });
  });
});
