import { tsSource } from '../ts/source';
import * as parse from './parse';
import * as parsec from './parse-class';
import * as parsem from './parse-method';
import * as parsei from './parse-import';
import * as parseb from './parse-block';
import * as parsep from './parse-params';
import * as ts from 'typescript';

fdescribe('Parsing', () => {

  let fileNode: ts.Node;
  let classNode: ts.Node;

  const sourcePath = 'test/test.service.ts';

  beforeEach(() => {
    fileNode = tsSource(sourcePath);
  });

  describe('Circular deps', () => {
    const obj = {
      a: 10,
      b: {
        b1: 5,
        bobj: {
          parent: null as object
        }
      },
      parent: null as object
    };
    
    beforeAll(() => {
      obj.b.bobj.parent = obj.b;
      obj.parent = obj;
    });
    
    it('should remove circular depends from an object', () => {
      const nocirc = parse.noCircularRefs(obj);
      expect(nocirc).toBeTruthy();
      expect(nocirc.a).toBe(10);
      expect(nocirc.b).toBeTruthy();
      expect(nocirc.b.bobj).toBeTruthy();
      expect(nocirc.b.bobj.parent).toBeDefined();
      expect(nocirc.parent).toBeDefined();
    });
  });
  
  describe('in source file', () => {

    it('should find imports now', () => {
      const n: any[] = parse.findImportStatements(fileNode);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(10);

      const i1 = n[0];
      const i2 = n[1];
      const i3 = n[2];
      const i4 = n[3];
      const i5 = n[4];
      const i6 = n[5];
      const i7 = n[6];
      const i8 = n[7];
      const i9 = n[9];
      const i10 = n[8];
      const i1Decl: parsei.ImportDetails = parsei.importDetails(i1);
      const i2Decl: parsei.ImportDetails = parsei.importDetails(i2);
      const i3Decl: parsei.ImportDetails = parsei.importDetails(i3);
      const i4Decl: parsei.ImportDetails = parsei.importDetails(i4);
      const i5Decl: parsei.ImportDetails = parsei.importDetails(i5);
      const i6Decl: parsei.ImportDetails = parsei.importDetails(i6);
      const i7Decl: parsei.ImportDetails = parsei.importDetails(i7);
      const i8Decl: parsei.ImportDetails = parsei.importDetails(i8);
      const i9Decl: parsei.ImportDetails = parsei.importDetails(i9);
      const i10Decl: parsei.ImportDetails = parsei.importDetails(i10);
      expect(i1.kind).toEqual(ts.SyntaxKind.ImportDeclaration);
      expect(i1Decl).toBeTruthy();
      expect(i2Decl).toBeTruthy();
      expect(i3Decl).toBeTruthy();
      expect(i4Decl).toBeTruthy();
      expect(i5Decl).toBeTruthy();
      expect(i6Decl).toBeTruthy();
      expect(i7Decl).toBeTruthy();
      expect(i8Decl).toBeTruthy();
      expect(i9Decl).toBeTruthy();
      expect(i10Decl).toBeTruthy();

      expect(i1Decl.originalImport).toEqual('import { Injectable, Inject } from \'@angular/core\';');
      expect(i1Decl.specifiers).toEqual('Injectable, Inject');
      expect(i1Decl.lib).toEqual('@angular/core');
      expect(i1Decl.alias).toBeNull();
      expect(i1Decl.froms).toEqual(['Injectable', 'Inject']);
      expect(i1Decl.isDependency).toBe(true);
      expect(i1Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i2Decl.specifiers).toEqual('HttpClient, HttpParams, HttpErrorResponse');
      expect(i2Decl.lib).toEqual('@angular/common/http');
      expect(i2Decl.alias).toBeNull();
      expect(i2Decl.froms).toEqual(['HttpClient', 'HttpParams', 'HttpErrorResponse']);
      expect(i2Decl.isDependency).toBe(true);
      expect(i2Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i3Decl.specifiers).toEqual('Observable, of');
      expect(i3Decl.lib).toEqual('rxjs');
      expect(i3Decl.alias).toBeNull();
      expect(i3Decl.froms).toEqual(['Observable', 'of']);
      expect(i3Decl.isDependency).toBe(true);
      expect(i3Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i4Decl.specifiers).toEqual('map');
      expect(i4Decl.lib).toEqual('rxjs/operators');
      expect(i4Decl.alias).toBeNull();
      expect(i4Decl.froms).toEqual(['map']);
      expect(i4Decl.isDependency).toBe(true);
      expect(i4Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i5Decl.specifiers).toBeNull();
      expect(i5Decl.lib).toEqual('typescript');
      expect(i5Decl.alias).toEqual('ts');
      expect(i5Decl.froms).toEqual(['typescript']);
      expect(i5Decl.isDependency).toBe(true);
      expect(i5Decl.importType).toEqual(parsei.ImportType.NAMESPACE);

      expect(i6Decl.specifiers).toBeNull();
      expect(i6Decl.lib).toEqual('rxjs/everything');
      expect(i6Decl.alias).toBeNull();
      expect(i6Decl.froms).toEqual([]);
      expect(i6Decl.isDependency).toBe(true);
      expect(i6Decl.importType).toEqual(parsei.ImportType.STRING);

      expect(i7Decl.specifiers).toEqual('aaa, bbb');
      expect(i7Decl.lib).toEqual('../my.imports');
      expect(i7Decl.alias).toBeNull();
      expect(i7Decl.froms).toEqual(['aaa', 'bbb']);
      expect(i7Decl.isDependency).toBe(false);
      expect(i7Decl.importType).toEqual(parsei.ImportType.NAMED);

      expect(i8Decl.originalImport).toEqual('import {TestConstants} from \'./test.constants\';');
      expect(i8Decl.specifiers).toEqual('TestConstants');
      expect(i8Decl.lib).toEqual('./test.constants');
      expect(i8Decl.alias).toBeNull();
      expect(i8Decl.froms).toEqual(['TestConstants']);
      expect(i8Decl.isDependency).toBe(false);
      expect(i8Decl.importType).toEqual(parsei.ImportType.NAMED);      

      expect(i9Decl.specifiers).toBeNull();
      expect(i9Decl.lib).toEqual('ext-lib');
      expect(i9Decl.alias).toEqual('ext');
      expect(i9Decl.froms).toEqual(['ext']);
      expect(i9Decl.isDependency).toBe(true);
      expect(i9Decl.importType).toEqual(parsei.ImportType.EXTERNAL);

      expect(i10Decl.specifiers).toEqual('select');
      expect(i10Decl.lib).toEqual('@angular-redux/store');
      expect(i10Decl.alias).toBeNull();
      expect(i10Decl.froms).toEqual(['select']);
      expect(i10Decl.isDependency).toBe(true);
      expect(i10Decl.importType).toEqual(parsei.ImportType.NAMED);
    });

    it('should find nth class declaration', () => {
      const n: ts.Node = parse.findNthClassDeclaration(fileNode, 0);
      const n2: ts.Node = parse.findNthClassDeclaration(fileNode, 1);
      expect(n).toBeTruthy();
      expect(n.kind).toBeTruthy();
      expect(n.kind).toEqual(ts.SyntaxKind.ClassDeclaration);
      expect(parsec.findClassName(n)).toEqual('MyType');
      expect(parsec.findClassName(n2)).toEqual('TestService');
    });
    it('should find nth class name', () => {
      const clz: ts.Node = parse.findNthClassDeclaration(fileNode, 1);
      const name = parsec.findClassName(clz);
      expect(name).toEqual('TestService');
    });
  });

  describe('in class', () => {
    beforeEach(() => {
      // TestService class node
      classNode = parse.findNthClassDeclaration(fileNode, 1);
    });

    it('should find decorator', () => {
      const n: ts.Node = parsec.findClassDecorator(classNode);
      expect(n).toBeTruthy();
      expect(n.kind).toBeTruthy();
      expect(n.kind).toEqual(ts.SyntaxKind.Decorator);
      // TODO find NV pairs, providedIn: 'root' etc
    });
    it('should find declarations', () => {
      const n: any[] = parsec.findClassDeclarations(classNode);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(3);
      for (let decl of n) {
        expect(decl.kind).toEqual(ts.SyntaxKind.PropertyDeclaration);
      }
    });
    it('should find constructor', () => {
      const n: ts.Node = parsec.findClassConstructor(classNode);
      expect(n).toBeTruthy();
      expect(n.kind).toBeTruthy();
      expect(n.kind).toEqual(ts.SyntaxKind.Constructor);
    });
    it('should find constructor parameters', () => {
      const n: ts.Node = parsec.findClassConstructor(classNode);
      const p: parsep.ParamDeclarationList = parsec.findConstructorParameters(n);
      expect(p).toBeTruthy();
      expect(p.params).toBeTruthy();
      expect(p.params.length).toBe(3);
      const p1 = p.params[0];
      const p2 = p.params[1];
      const p3 = p.params[2];
      expect(p1.name).toEqual('http');
      expect(p1.typeReference).toEqual('HttpClient');
      expect(p1.isPrivate).toBe(true);
      expect(p2.name).toEqual('myType');
      expect(p2.typeReference).toEqual('MyType');
      expect(p2.isPrivate).toBe(true);
      expect(p3.name).toEqual('url');
      expect(p3.typeReference).toEqual('string');
      expect(p3.isPrivate).toBe(false);
      expect(p3.injectedBy).toEqual('TestConstants.url');
    });
    it('should find public methods', () => {
      const n: ts.Node[] = parsec.findClassMethods(classNode, true);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(3);
      for (let decl of n) {
        expect(decl.kind).toEqual(ts.SyntaxKind.MethodDeclaration);
        // const n: parsem.MethodDeclaration = parsem.findMethodDeclaration(decl);
      }
    });
    it('should find public and private methods', () => {
      const n: Array<any> = parsec.findClassMethods(classNode, false);
      expect(n).toBeTruthy();
      expect(n.length).toEqual(5); // not including getter
      for (let decl of n) {
        expect(decl.kind).toEqual(ts.SyntaxKind.MethodDeclaration);
        const md = parsem.findMethodDeclaration(decl);
        expect(md).toBeTruthy();
        expect(md.name).toBeTruthy();
        // console.log('-- method', md.name);
      }
    });
  });
  describe('in methods', () => {
    let methods: ts.Node[];
    let firstMethod: ts.Node;

    beforeEach(() => {
      classNode = parse.findNthClassDeclaration(fileNode, 1);
      methods = parsec.findClassMethods(classNode, true);
      firstMethod = methods[0];
    });

    it('should find method declaration', () => {
      expect(firstMethod).toBeTruthy();
      const n: parsem.MethodDetails = parsem.findMethodDeclaration(firstMethod);
      expect(n).toBeTruthy();
      expect(n.name).toBeTruthy();
      expect(n.name).toEqual('getApiResponse');
      expect(n.parameters).toBeTruthy();
      expect(parsem.isPrivateMethod(firstMethod)).toBe(false);
    });

    describe('and method body', () => {
      let body: ts.Node;
      beforeEach(function() {
        body = parsem.findMethodBody(firstMethod);
        expect(body).toBeTruthy();
        expect(body.kind).toEqual(ts.SyntaxKind.Block);
      });
      
      it('should find call details', () => {
        const calls: parseb.MethodCall[] = parseb.findCallDetails(body);
        expect(calls).toBeTruthy();
        // console.log('-- body calls', calls);
        expect(calls.length).toBe(8);
        const call1: parseb.MethodCall = calls[0];
        expect(call1.isThis).toBe(false);
        expect(call1.className).toBe('console');
        expect(call1.methodName).toBe('log');
        /*
 [ { isThis: false,
    className: 'console',
    methodName: 'log',
    params: [] },
  { isThis: true,
    className: null,
    methodName: 'secretMethod',
    params: [] },
  { isThis: false, className: 'pipe', methodName: null, params: [] },
  { isThis: true, className: 'http', methodName: 'get', params: [] },
  { isThis: false, className: 'map', methodName: null, params: [] },
  { isThis: true,
    className: null,
    methodName: 'secretString',
    params: [] },
  { isThis: false, className: 'map', methodName: null, params: [] },
  { isThis: false,
    className: 'responseString',
    methodName: 'toUpperCase',
    params: [] } ]
        */
      });
    });
        
  });
});
