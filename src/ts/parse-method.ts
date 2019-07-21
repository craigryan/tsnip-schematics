import * as ts from 'typescript';
// import * as ast from '@schematics/angular/utility/ast-utils';
import * as parse from './parse';

// https://github.com/Microsoft/TypeScript/blob/964565e06968259fc4e6de6f1e88ab5e0663a94a/lib/typescript.d.ts#L62

export interface MethodDetails {
  name: string;
  isPrivate: boolean;
  parameters: ts.Node[] | undefined;
  returnType?: ts.Node | undefined;
}

/*
                    MethodDeclaration
                        SyntaxList (optional)
                            PublicKeyword | PrivateKeyword
                        Identifier
                            Text: getApiResponse
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Parameter
                                Identifier
                                    Text: url
                                ColonToken
                                    Text: :
                                StringKeyword
                                    Text: string
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
// Method name, params and return type
export function findMethodDeclaration(decl: ts.Node | null): MethodDetails | null {
  const mDecl: MethodDetails = {
    name: '',
    isPrivate: false,
    parameters: [],
    returnType: undefined
  };
  enum STATES { START, NAME, PARAMS, RETURN };
  let state: STATES = STATES.START;
  let expectReturn = false;

  if (decl) {
    ts.forEachChild(decl, childNode => {
      // console.log('m loop, kind', ts.SyntaxKind[childNode.kind]);
      switch (state) {
      case STATES.START:
        // console.log('m start');
        if (childNode.kind == ts.SyntaxKind.Identifier) {
          mDecl.name = childNode.getText();
          state = STATES.NAME;
          // console.log('m start name', mDecl.name);
        } else if (childNode.kind == ts.SyntaxKind.OpenParenToken) {
          // console.log('m start open paren');
          state = STATES.NAME;
        } else if (childNode.kind == ts.SyntaxKind.PrivateKeyword) {
          mDecl.isPrivate = true;
        }
        break;
      case STATES.NAME:
        // console.log('m name, kind', ts.SyntaxKind[childNode.kind]);
        if (childNode.kind === ts.SyntaxKind.Parameter) {
          // console.log('m name, param, top node');
          if (!mDecl.parameters) {
            mDecl.parameters = [];
          }
          mDecl.parameters.push(childNode);
        } else if (childNode.kind === ts.SyntaxKind.SyntaxList) {
          // TODO can this condition happen??
          // console.log('m name, syntax list, loop and look for params');
          ts.forEachChild(childNode, paramNode => {
            // console.log('  next param, kind', ts.SyntaxKind[paramNode.kind]);
            if (paramNode.kind === ts.SyntaxKind.Parameter) {
              // console.log('m name, param');
              if (!mDecl.parameters) {
                mDecl.parameters = [];
              }
              mDecl.parameters.push(paramNode);
            }
          });
          state = STATES.PARAMS;
        } else {
          // end of params
          // console.log('m name, param done');
          state = STATES.PARAMS;
        }
        break;
      case STATES.PARAMS:
        // console.log('m params');
        if (expectReturn) {
          // console.log('m params, return type node expected..');
          mDecl.returnType = childNode;
          state = STATES.RETURN;
        } else {
          if (childNode.kind === ts.SyntaxKind.ColonToken) {
            // has return type
            expectReturn = true;
          } else if (childNode.kind == ts.SyntaxKind.Block) {
            // end of return type (if any)
            state = STATES.RETURN;
          }
        }
        break;
      case STATES.RETURN:
      default:
        // console.log('m return');
        // ignore everything else
        break;
      }
    });
  }
  // console.log('m decl', mDecl);
  return mDecl;
}

export function isPrivateMethod(decl: ts.Node | null): boolean {
  if (!decl) {
    return false;
  }
  let isPrivate: boolean = false;
  // forEachChild returns major nodes. decl.getChildren returns every node type
  ts.forEachChild(decl, childNode => {
    if (childNode.kind === ts.SyntaxKind.PrivateKeyword) {
      isPrivate = true;
    }
  });
  return isPrivate;
}

// Method name, params and return type
export function findGetterDeclaration(source: ts.Node): MethodDetails | null {
  const getterDecl = parse.findFirstNode(source, ts.SyntaxKind.GetAccessor);
  const decl = findMethodDeclaration(getterDecl);
  return decl ? decl : null;
}

// Method block, used to parse familiar calls
export function findMethodBlock(source: ts.Node): ts.Node | null {
  return parse.findFirstNode(source, ts.SyntaxKind.Block);
}
