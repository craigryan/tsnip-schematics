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
import ( ImportMaps as importMaps } from '../utils/import-maps';

function getRequiredTestImports(details: parsei.ImportDetails): string[] {
}

function getReferencedLibraries(details: parsei.ImportDetails): string[] {
  const imports: Array<string> = string[];
  importMaps.addMaps(imports, details.lib);
  return imports;
}

function addRequiredImports(options: any): Rule {
  return (tree: Tree) => {
    let sourcePath = tsSourceExists(options.sourcePath) ? options.sourcePath : null;
    if (!sourcePath) {
      console.log('-- source[path] doesnt exist:', options.sourcePath);
      return tree;
    }
    let srcNode: ts.Node = tsSource(options.sourcePath);
    const imports: Array<any> = parse.findImportStatements(srcNode);
    options.imports = [];
    imports.forEach((i) => {
      const details: parsei.ImportDetails = parsei.importDetails(i);
      options.imports.push(details.originalImport);
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

    const defaultOptions = {
      libraries: getReferencedLibraries(options),
      requiredImports: getRequiredTestImports(options)
    };

    const templateOptions = {
      ...strings,
      ...defaultOptions,
      ...options
    };

    const rule = chain([
      addRequiredImports(options),
      mergeWith(
        apply(url('./files'), [
          template(templateOptions),
          move(options.outputPath),
        ]),
        MergeStrategy.Overwrite
      )
    ]);

    return rule(tree, context);
  };
}
