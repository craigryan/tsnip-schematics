import * as ts from 'typescript';
import * as ast from '@schematics/angular/utility/ast-utils';

/*
 * High level parsing - imports, class nodes, decorators, and some general AST finders
 */

// Param or field declaration (name: type)
export interface DeclarationDetails {
  name: string;
  typeReference: string;
  node: ts.Node;
}

// import * as fs from 'fs';

/*
            ImportDeclaration
                ImportKeyword
                    Text: import
                ImportClause
                    NamedImports
                        FirstPunctuation
                            Text: {
                        SyntaxList
                            ImportSpecifier
                                Identifier
                                    Text: Injectable
                            CommaToken
                                Text: ,
                            ImportSpecifier
                                Identifier
                                    Text: Inject
                        CloseBraceToken
                            Text: }
                FromKeyword
                    Text: from
                StringLiteral
                    Text: '@angular/core'
                SemicolonToken
                    Text: ;
*/
export function findImportStatements(source: ts.Node): ts.Node[] {
  return ast.findNodes(source, ts.SyntaxKind.ImportDeclaration);
}

// name: type, return name and type details
export function declarationDetails(declNode: ts.Node): DeclarationDetails {
  let det: DeclarationDetails = {
    name: '',
    typeReference: '',
    node: declNode
  };
  return det;
}

/*
            ClassDeclaration
                SyntaxList
                    Decorator
                        AtToken
                            Text: @
                        CallExpression
                        ...
                SyntaxList
                    ExportKeyword
                        Text: export
                ClassKeyword
                    Text: class
                Identifier
                    Text: MyapiService
                FirstPunctuation
                    Text: {
                SyntaxList
                    PropertyDeclaration
                    ...
                    Constructor
                        ConstructorKeyword
                            Text: constructor
                        OpenParenToken
                            Text: (
                        SyntaxList
                        ...
*/
export function findClassDeclaration(source: ts.Node): ts.Node | null {
  const decl = findFirstNode(source, ts.SyntaxKind.ClassDeclaration);
  // console.log('decl node', ts.SyntaxKind[decl.kind]);
  return decl;
}

export function findFirstNode(node: ts.Node, kind: ts.SyntaxKind): ts.Node | null {
  const nodes = findNodes(node, kind, 1);
  // console.log('nodes for first', nodes.length);
  return nodes ? (nodes.length > 0 ? nodes[0] : null) : null;
}

export function findNodes(node: ts.Node, kind: ts.SyntaxKind, max = 100): ts.Node[] {
  return ast.findNodes(node, kind, max);
}

export function isStandardType(type: string): boolean {
    return isBasicType(type) || isArrayType(type) || isGenericType(type);
  }

export function isBasicType(type: string): boolean {
  return type === 'string' || type === 'number' || type === 'any' || type === 'boolean';
}

export function isArrayType(type: string): boolean {
  if (type.startsWith('Array') || type.includes('[')) {
    return true;
  }
  return false;
}

export function isGenericType(type: string): boolean {
  return type.includes('<');
}
