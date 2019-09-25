import * as ts from 'typescript';
import * as parse from './parse';
import * as parsem from './parse-method';
import * as parsep from './parse-params';
import * as source from './source';

export interface MethodCall {
  // call is this.someService.calc(..)
  isThis: boolean;     // true
  className: string;   // someService
  methodName: string;  // calc
  params: any[];
}
  
export function generateMethodCalls(ctorParams: parsep.ParamDeclarationList, method: ts.Node, details: parsem.MethodDetails): MethodCall[] {
  // const extStatements: ts.Node[] = findExternalStatements(details.body);
  const statements: ts.Node[] = findAllStatements(details.body);
  const calls: MethodCall[] = [];
  // ctorParams build list of 'this.foo' from private params to mark externals that are called
  // via 'this.foo'. All non- 'this.' prefixed calls will also be external.

  /* Interested in finding external calls:
   * - in conditionals. 'if (callExternal(10) > 3) ...' or while etc
   * - function calls. 'const val = callExternal(10) + stuff;' or:
   * -   straight calls. 'callExternal(10);'
   * - returns. 'return http.post(...);'
   */
  // filter calls on each.
  return calls;
}

export function findCallDetails(bodyNode: ts.Node): MethodCall[] {
  const calls: ts.Node[] = parse.findNodes(bodyNode, ts.SyntaxKind.CallExpression);
  // const returns: ts.Node[] = parse.findNodes(bodyNode, ts.SyntaxKind.ReturnStatement);
  const mcalls: MethodCall[] = [];
  calls.forEach((call: ts.CallExpression) => {
    mcalls.push(callDetails(call));
  });
  return mcalls;
}

export function callDetails(call: ts.CallExpression): MethodCall {
  const m: MethodCall = {
    isThis: false,
    className: null,
    methodName: null,
    params: []
  };
  const exp = call.expression;
  // const args = call.arguments;
  if (ts.isPropertyAccessExpression(exp)) {
    const callChain: string[] = [];
    getCallChain(callChain, exp as ts.PropertyAccessExpression);
    m.isThis = callChain.length > 0 && callChain[0] === 'this';
    const candm = getClassAndMethodName(callChain);
    m.className = candm.className;
    m.methodName = candm.methodName;
    // TODO actual params
    // m.params = args;
  } else if (ts.isIdentifier(exp)) {
    m.className = exp.getText();
    // args could be ArrowFunction etc like map((x) =>...)
  }
  return m;
}

function getClassAndMethodName(callChain: string[]): any {
  const candm = {
    className: null as string, methodName: null as string
  };
  if (callChain.length > 0) {
    if (callChain[0] === 'this') {
      if (callChain.length > 1) {
        if (callChain.length > 2) {
          candm.className = callChain[1];
          candm.methodName = callChain.slice(2).join('.');
        } else {
          candm.methodName = callChain[1];
        }
      }
    } else {
      candm.className = callChain[0];
      if (callChain.length > 1) {
        candm.methodName = callChain.slice(1).join('.');
      }
    }
  }
  return candm;
}

function getCallChain(callChain: string[], exp: ts.PropertyAccessExpression): void {
  if (exp.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
    // a.b.c(..)
    getCallChain(callChain, exp.expression as ts.PropertyAccessExpression);
    callChain.push(exp.name.getText());
  } else {
    if (exp.expression.kind === ts.SyntaxKind.ThisKeyword) {
      // this.func() or this.http.get()
      callChain.push('this');
    } else if (exp.expression.kind === ts.SyntaxKind.Identifier) {
      // console.log(..)
      callChain.push(exp.expression.getText());
    }
    callChain.push(exp.name.getText());
  }
}

export function findAllStatements(method: ts.Node): ts.Node[] {
  const ifNodes: ts.Node[] = findStatements(method, ts.SyntaxKind.CallExpression, ts.SyntaxKind.IfStatement);
  console.log('-- if nodes ', ifNodes.length);
  const expressionNodes: ts.Node[] = findStatements(method, ts.SyntaxKind.CallExpression, ts.SyntaxKind.ExpressionStatement);
  console.log('-- exp nodes ', expressionNodes.length);
  const returnNodes: ts.Node[] = findStatements(method, ts.SyntaxKind.CallExpression, ts.SyntaxKind.ReturnStatement);
  console.log('-- return nodes ', returnNodes.length);
  return [
    ...ifNodes, ...expressionNodes, ...returnNodes
  ];
}

export function findStatements(bodyNode: ts.Node, type: ts.SyntaxKind, withinType: ts.SyntaxKind = null): ts.Node[] {
  if (!withinType) {
    return parse.findNodes(bodyNode, type);
  }
  const containingNodes: ts.Node[] = parse.findNodes(bodyNode, withinType);
  const nodes: ts.Node[] = [];
  console.log('--- contained nodes length', containingNodes.length);
  if (containingNodes && containingNodes.length > 0) {
    containingNodes.forEach((node: ts.Node) => {
      console.log('--- contained');
      source.showTree(node);
      const statements: ts.Node[] = findStatements(node, type);
      if (statements && statements.length > 0) {
        nodes.concat(statements);
      }
    });
  }
  return nodes;
}

/*
export function findExternalStatements(bodyNode: ts.Node): ts.Node[] {
  return parse.findNodes(bodyNode, ts.SyntaxKind.PropertyDeclaration); // ???
}
*/
