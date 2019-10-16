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

export function findClassDecoratorName(decoratorNode: ts.Node): string {
  const call: ts.CallExpression = parse.findFirstNode(decoratorNode, ts.SyntaxKind.CallExpression) as ts.CallExpression;
  if (call && ts.isIdentifier(call.expression)) {
    return call.expression.getText();
  }
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
export function findClassConstructor(classNode: ts.Node): ts.Node | null {
  return parse.findFirstNode(classNode, ts.SyntaxKind.Constructor);
}

export function findConstructorParameters(ctor: ts.Node): parsep.ParamDeclarationList {
  const paramList: parsep.ParamDeclarationList = {
    params: []
  };
  enum STATES { PARAMS, END };
  let state: STATES = STATES.PARAMS;

  if (ctor) {
    ts.forEachChild(ctor, childNode => {
      switch (state) {
      case STATES.PARAMS:
        if (childNode.kind === ts.SyntaxKind.Parameter) {
          paramList.params.push(parsep.paramDeclaration(childNode));
        } else {
          // end of params
          state = STATES.END;
        }
        break;
      case STATES.END:
      default:
        // ignore everything else
        break;
      }
    });
  }
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
  const publicMethods = [];
  if (allMethods) {
    for (const method of allMethods) {
      if (!parsem.isPrivateMethod(method)) {
        publicMethods.push(method);
      }
    }
  }
  return publicMethods;
}
