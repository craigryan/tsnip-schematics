import {join, normalize} from '@angular-devkit/core';
import * as ts from 'typescript';
import * as fs from 'fs';

export function tsSourceExists(filename: string): boolean {
  console.log('source EXISTS?', filename);
  return filename ? fs.existsSync(filename) : false;
}

export function tsSourcePathExists(path: string, filename: string): boolean {
  if (!filename || !path) {
    return false;
  }
  const fullpath = join(normalize(path), filename);
  console.log('source PATH EXISTS?', fullpath);
  return tsSourceExists(fullpath);
}

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
