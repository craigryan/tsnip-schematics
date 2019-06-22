import * as ts from 'typescript';
import * as fs from 'fs';

export function tsSource(filename: string): ts.Node {
  let buffer = fs.readFileSync(filename);
  return ts.createSourceFile(filename, buffer.toString('utf-8'), ts.ScriptTarget.Latest, true);
}

export function showTree(node: ts.Node, indent: string = '    '): void {

    console.log(indent + ts.SyntaxKind[node.kind]);
    
    if (node.getChildCount() === 0) {
        console.log(indent + '    Text: ' + node.getText());
    }

    for (let child of node.getChildren()) {
        showTree(child, indent + '    ');
    }
}
