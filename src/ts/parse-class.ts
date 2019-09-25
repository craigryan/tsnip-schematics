import * as ts from 'typescript';
// import * as ast from '@schematics/angular/utility/ast-utils';

import * as parse from './parse';
import * as parsem from './parse-method';
import * as parsep from './parse-params';

/*
 * Class parsing - decorators, property declarations, constructor, methods
 */

/*
            ClassDeclaration
                SyntaxList
                    Decorator
                        AtToken
                            Text: @
                        CallExpression
                            Identifier
                                Text: Injectable
                            OpenParenToken
                                Text: (
                            SyntaxList
                                ObjectLiteralExpression
                                    FirstPunctuation
                                        Text: {
                                    SyntaxList
                                        PropertyAssignment
                                            Identifier
                                                Text: providedIn
                                            ColonToken
                                                Text: :
                                            StringLiteral
                                                Text: 'root'
                                    CloseBraceToken
                                        Text: }
                            CloseParenToken
                                Text: )
*/
export function findClassDecorator(classNode: ts.Node): ts.Node | null {
  return parse.findFirstNode(classNode, ts.SyntaxKind.Decorator);
}

/*
                ClassKeyword
                    Text: class
                Identifier
                    Text: MyapiService
*/
export function findClassName(classNode: ts.Node): string {
  let name;
  ts.forEachChild(classNode, childNode => {
    if (childNode.kind === ts.SyntaxKind.Identifier) {
      name = childNode.getText();
    }
  });
  return name;
}

/*
                ClassKeyword
                    Text: class
                Identifier
                    Text: MyapiService
                FirstPunctuation
                    Text: {
                SyntaxList
                    PropertyDeclaration
                        SyntaxList
                            PrivateKeyword
                                Text: private
                        Identifier
                            Text: apiUrl
                        ColonToken
                            Text: :
                        StringKeyword
                            Text: string
                        SemicolonToken
                            Text: ;
*/
export function findClassDeclarations(classNode: ts.Node): ts.Node[] {
  return parse.findNodes(classNode, ts.SyntaxKind.PropertyDeclaration);
}

/*
                    Constructor
                        ConstructorKeyword
                            Text: constructor
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Parameter
                                SyntaxList
                                    PrivateKeyword
                                        Text: private
                                Identifier
                                    Text: http
                                ColonToken
                                    Text: :
                                TypeReference
                                    Identifier
                                        Text: HttpClient
                            CommaToken
                                Text: ,
                            Parameter
                                SyntaxList
                                    PrivateKeyword
                                        Text: private
                                Identifier
                                    Text: url
                                ColonToken
                                    Text: :
                                StringKeyword
                                    Text: string
                        CloseParenToken
                            Text: )
*/
export function findClassConstructor(source: ts.Node): ts.Node | null {
  return parse.findFirstNode(source, ts.SyntaxKind.Constructor);
}

export function findConstructorParameters(ctor: ts.Node): parsep.ParamDeclarationList {
  const paramList: parsep.ParamDeclarationList = {
    params: []
  };
  enum STATES { PARAMS, END };
  let state: STATES = STATES.PARAMS;

  if (ctor) {
    ts.forEachChild(ctor, childNode => {
      console.log('cp loop, kind', ts.SyntaxKind[childNode.kind]);
      switch (state) {
      case STATES.PARAMS:
        console.log('cp params, kind', ts.SyntaxKind[childNode.kind]);
        if (childNode.kind === ts.SyntaxKind.Parameter) {
          console.log('cp params, param, top node');
          paramList.params.push(parsep.paramDeclaration(childNode));
        } else {
          // end of params
          console.log('cp name, param done');
          state = STATES.END;
        }
        break;
      case STATES.END:
      default:
        console.log('cp return');
        // ignore everything else
        break;
      }
    });
  }
  // console.log('m decl', mDecl);
  return paramList;
}

/*
                    MethodDeclaration
                        Identifier
                            Text: getApiResponse
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Text: 
                        CloseParenToken
                            Text: )
                        ColonToken
                            Text: :
                        TypeReference
                            Identifier
                                Text: Observable
                            FirstBinaryOperator
                                Text: <
                            SyntaxList
                                StringKeyword
                                    Text: string
                            GreaterThanToken
                                Text: >
*/
export function findClassMethods(source: ts.Node, publicOnly: boolean): ts.Node[] {
  const allMethods: ts.Node[] = parse.findNodes(source, ts.SyntaxKind.MethodDeclaration);
  if (!publicOnly) {
    return allMethods || [];
  }
  let publicMethods = [];
  if (allMethods) {
    for (const method of allMethods) {
      if (!parsem.isPrivateMethod(method)) {
        publicMethods.push(method);
      }
    }
  }
  return publicMethods;
}
