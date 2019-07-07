// import {join, JsonArray, JsonObject, normalize, Path, strings} from '@angular-devkit/core';
import {join, Path, strings, normalize} from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  template,
  move,
  apply,
  chain,
  mergeWith,
  url,
  MergeStrategy
} from '@angular-devkit/schematics';
// import {constants} from '../utils/constants';
import {getWorkspace} from '@schematics/angular/utility/config';
import * as ts from 'typescript';
import { tsSource, tsSourceExists, tsSourcePathExists } from '../ts/source';
import * as parse from '../ts/parse';
import {setupOptions} from '../utils/options';
import * as parsei from '../ts/parse-import';
import { ImportMaps } from '../utils/import-maps';

function getRequiredTestImports(details: parsei.ImportDetails): string[] {
  const imports: Array<string> = [];
  imports.push(details.originalImport);
  return imports;
}

function getReferencedLibraries(details: parsei.ImportDetails): string[] {
  const libraries: Array<string> = [];
  ImportMaps.addLibraries(libraries, details.lib);
  return libraries;
}

function addImportsAndLibraries(options: any): Rule {
  return (tree: Tree) => {
    let sourcePath = tsSourceExists(options.sourcePath) ? options.sourcePath : null;
    if (!sourcePath) {
      console.log('-- source[path] doesnt exist:', options.sourcePath);
      return tree;
    }
    let srcNode: ts.Node = tsSource(options.sourcePath);
    const imports: Array<any> = parse.findImportStatements(srcNode);
    options.imports = [];
    options.libraries = [];
    imports.forEach((i) => {
      const details: parsei.ImportDetails = parsei.importDetails(i);
      options.libraries = options.libraries.concat(getReferencedLibraries(details));
      options.imports = options.imports.concat(getRequiredTestImports(details));
    });
    return tree;
  };
}

export function importsSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);
    const workspace = getWorkspace(tree);
    const project = workspace.projects[options.project];

    console.log('-- add imports options', options);
    const rule = chain([
      addImportsAndLibraries(options),
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings, ...options
          }),
          move(options.outputPath),
        ]),
        MergeStrategy.Default
      )
    ]);

    return rule(tree, context);
  };
}
