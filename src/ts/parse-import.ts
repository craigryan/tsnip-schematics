import {
  ExternalModuleReference,
  Identifier,
  NamedImports,
  ImportDeclaration,
  ImportEqualsDeclaration,
  NamespaceImport,
  StringLiteral,
} from 'typescript';
import * as ts from 'typescript';

export enum ImportType {
  NAMED = "NAMED",
  NAMESPACE = "NAMESPACE",
  EXTERNAL = "EXTERNAL",
  STRING = "STRING"
};

export interface ImportDetails {
  originalImport: string;
  importType?: ImportType;
  lib: string;
  specifiers?: string;
  alias?: string
};

// Import x from y, return x and y details
export function importDetails(importNode: ImportDeclaration | ImportEqualsDeclaration): ImportDetails {
  let details: ImportDetails = {
    originalImport: importNode.getText(),
    lib: '',
    importType: null,
    specifiers: null,
    alias: null
  };
  if (ts.isImportDeclaration(importNode)) {
    if (importNode.importClause && ts.isNamespaceImport(importNode.importClause.namedBindings)) {
      namespaceImport(details, importNode);
    } else if (importNode.importClause && (ts.isNamedImports(importNode.importClause.namedBindings) || importNode.importClause.name)) {
      namedImport(details, importNode);
    } else if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
      stringImport(details, importNode);
    }
  } else if (ts.isExternalModuleReference(importNode.moduleReference)) {
    externalModuleImport(details, importNode.name.text, importNode.moduleReference);
  }
  return details;
}

// import {a, b} from 'foo'
function namedImport(details: ImportDetails, node: ImportDeclaration) {
  details.importType = ImportType.NAMED;
  const lib = node.moduleSpecifier as StringLiteral;
  details.lib = lib.text;
  if (node.importClause.name) {
    details.alias = node.importClause.name.text;
  }
  if (node.importClause.namedBindings) {
    const bindings = node.importClause.namedBindings as NamedImports;
    const specifiers: Array<string> = [];
    bindings.elements.map(o => {
        let spec: string, alias: string;
        if (o.propertyName && o.name) {
          spec = o.propertyName.text;
          alias = o.name.text;
          if (spec === 'default') {
            details.alias = alias;
          } else {
            specifiers.push(spec + ' as ' + alias);
          }
        } else {
          spec = o.name.text;
          specifiers.push(spec);
        }
      }
    );
    details.specifiers = specifiers.join(', ');
  }
}

// Whole NS with alias, eg:
//  import * as foobar from 'foobar';
function namespaceImport(details: ImportDetails, node: ImportDeclaration) {
  details.importType = ImportType.NAMESPACE;
  const lib = node.moduleSpecifier as StringLiteral;
  const id = (node.importClause.namedBindings as NamespaceImport).name as Identifier;
  details.lib = lib.text;
  details.alias = id.text;
}

// String eg:
//  import 'rxjs/stuff';
function stringImport(details: ImportDetails, node: ImportDeclaration) {
  details.importType = ImportType.STRING;
  const lib = node.moduleSpecifier as StringLiteral;
  details.lib = lib.text;
}

// Equals import, eg:
//  import foobar = require('foobar')
function externalModuleImport(details: ImportDetails, name: string, node: ExternalModuleReference) {
  details.importType = ImportType.EXTERNAL;
  details.alias = name;
  const lib = node.expression as Identifier;
  details.lib = lib.text;
}

