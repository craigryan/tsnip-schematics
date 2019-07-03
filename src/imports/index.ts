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

function getRequiredTestImports(details: parsei.ImportDetails): string[] {
  return ['import foo from \'bar\''];
}

function getReferencedLibraries(details: parsei.ImportDetails) {
  return ['commonhttp'];
}

function addRequiredImports(options: any): Rule {
  return (tree: Tree) => {
    let sourcePath = tsSourceExists(options.name) ? options.name : null;
    if (!sourcePath) {
      sourcePath = tsSourcePathExists(options.path, options.name) ? join(options.path, options.name) : null;
    }
    const x = join(options.path, options.name);
    if (!sourcePath) {
      console.log('-- source[path] doesnt exist: path, name', x);
      return tree;
    }
    let srcNode: ts.Node = tsSource(options.name);
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
      mergeWith(apply(url('./files'), [
        template(templateOptions),
        move(options.outputPath),
      ]), MergeStrategy.Overwrite)
    ]);

    return rule(tree, context);
  };
}
