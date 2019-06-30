import { tsSource } from '../ts/source';
import * as parse from './parse';
import * as parsec from './parse-class';
import * as parsem from './parse-method';
import * as parsei from './parse-import';
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
      expect(n.length).toEqual(5);

      /*
        import { Injectable, Inject } from '@angular/core';
        import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
        import {Observable, of} from 'rxjs';
        import {map} from 'rxjs/operators';
        import * as ts from 'typescript';
      */
      const i1 = n[0];
      const i2 = n[1];
      const i3 = n[2];
      const i4 = n[3];
      const i5 = n[4];
      const i1Decl: parsei.ImportDetails = parsei.importDetails(i1);
      const i2Decl: parsei.ImportDetails = parsei.importDetails(i2);
      const i3Decl: parsei.ImportDetails = parsei.importDetails(i3);
      const i4Decl: parsei.ImportDetails = parsei.importDetails(i4);
      const i5Decl: parsei.ImportDetails = parsei.importDetails(i5);
      expect(i1.kind).toEqual(ts.SyntaxKind.ImportDeclaration);
      expect(i1Decl).toBeTruthy();
      expect(i2Decl).toBeTruthy();
      expect(i3Decl).toBeTruthy();
      expect(i4Decl).toBeTruthy();
      expect(i5Decl).toBeTruthy();

      expect(i1Decl.originalImport).toEqual('import { Injectable, Inject } from \'@angular/core\';');
      expect(i1Decl.specifiers).toEqual('Injectable, Inject');
      expect(i1Decl.lib).toEqual('@angular/core');
      expect(i1Decl.alias).toBeNull();
      expect(i1Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i2Decl.specifiers).toEqual('HttpClient, HttpParams, HttpErrorResponse');
      expect(i2Decl.lib).toEqual('@angular/common/http');
      expect(i2Decl.alias).toBeNull();
      expect(i2Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i3Decl.specifiers).toEqual('Observable, of');
      expect(i3Decl.lib).toEqual('rxjs');
      expect(i3Decl.alias).toBeNull();
      expect(i3Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i4Decl.specifiers).toEqual('map');
      expect(i4Decl.lib).toEqual('rxjs/operators');
      expect(i4Decl.alias).toBeNull();
      expect(i4Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i5Decl.specifiers).toBeNull();
      expect(i5Decl.lib).toEqual('typescript');
      expect(i5Decl.alias).toEqual('ts');
      expect(i5Decl.importType).toEqual(parsei.ImportType.NAMESPACE);
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
      const n: parsem.MethodDetails = parsem.findMethodDeclaration(firstMethod);
      expect(n).toBeTruthy();
      expect(n.name).toBeTruthy();
      expect(n.name).toEqual('getApiResponse');
      expect(n.parameters).toBeTruthy();
    });
  });
});
