import * as ts from 'typescript';
import * as parse from './parse';

// Formal Parameters within a TS 'MethodDeclaration'
export interface ParamDeclaration {
  isPrivate: boolean;
  name: string;
  typeReference: string;
  injectedBy: string;
  node: ts.Node;
}

export interface ParamDeclarationList {
  params: Array<ParamDeclaration>
}

/*
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
*/
export function paramDeclaration(param: ts.Node): ParamDeclaration {
  const pDetails: ParamDeclaration = {
    isPrivate: false,
    name: null,
    typeReference: null,
    injectedBy: null,
    node: parse.cleanNode(param)
  };
  ts.forEachChild(param, pNode => {
    if (pNode.kind === ts.SyntaxKind.PrivateKeyword) {
      pDetails.isPrivate = true;
    } else if (pNode.kind === ts.SyntaxKind.Identifier) {
      pDetails.name = pNode.getText();
    } else if (pNode.kind === ts.SyntaxKind.TypeReference) {
      pDetails.typeReference = pNode.getText();
    } else if (ts.isDecorator(pNode)) {
      const dec: ts.Decorator = (pNode as ts.Decorator);
      const expr: ts.LeftHandSideExpression = dec.expression;
      const decor = expr.getText();
      if (decor.startsWith('Inject(')) {
        pDetails.injectedBy = decor.substring(7, decor.length - 1);
      }
      console.log('-- param decorators', );
    } else if (pNode.kind == ts.SyntaxKind.StringKeyword) {
      pDetails.typeReference = 'string';
    } else {
      console.log('--- param, kind', ts.SyntaxKind[pNode.kind]);
    }
  });
  console.log('--- param, details', pDetails.name, pDetails.typeReference);
  return pDetails;
}

/*
CallExpression
PropertyAccessExpression
    PropertyAccessExpression
        ThisKeyword
            Text: this
        DotToken
            Text: .
        Identifier
            Text: http
    DotToken
        Text: .
    Identifier
        Text: post
OpenParenToken
    Text: (
SyntaxList
    Identifier
        Text: url
    CommaToken
        Text: ,
    Identifier
        Text: body
CloseParenToken
    Text: )
*/

// Actual Parameters within a method call. 
// These are within a TS CallExpression between OpenParenToken and CloseParenToken
export interface ParamActual {
  isLiteral: boolean; // 'goo'
  isLocal: boolean; // local to block or this.xxx
  name: string; // 'val'
  node: ts.Node;
}

export interface ParamActualList {
  params: Array<ParamActual>
}

export function paramActual(param: ts.Node): ParamActual {
/*
  const pActual: ParamActual = {
    isPrivate: false,
    name: null,
    typeReference: null,
    injectedBy: null,
    node: param
  };
  ts.forEachChild(param, pNode => {
    if (pNode.kind === ts.SyntaxKind.PrivateKeyword) {
      pDetails.isPrivate = true;
    } else if (pNode.kind === ts.SyntaxKind.Identifier) {
      pDetails.name = pNode.getText();
    } else if (pNode.kind === ts.SyntaxKind.TypeReference) {
      pDetails.typeReference = pNode.getText();
    } else if (ts.isDecorator(pNode)) {
      const dec: ts.Decorator = (pNode as ts.Decorator);
      const expr: ts.LeftHandSideExpression = dec.expression;
      const decor = expr.getText();
      if (decor.startsWith('Inject(')) {
        pDetails.injectedBy = decor.substring(7, decor.length - 1);
      }
      console.log('-- param decorators', );
    } else if (pNode.kind == ts.SyntaxKind.StringKeyword) {
      pDetails.typeReference = 'string';
    } else {
      console.log('--- param, kind', ts.SyntaxKind[pNode.kind]);
    }
  });
  console.log('--- param, details', pDetails.name, pDetails.typeReference);
  return pDetails;
*/
  return null;
}
