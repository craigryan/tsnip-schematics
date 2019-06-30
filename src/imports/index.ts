// import {join, JsonArray, JsonObject, normalize, Path, strings} from '@angular-devkit/core';
import {join, Path, strings} from '@angular-devkit/core';
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
import { tsSource } from '../ts/source';
import * as parse from '../ts/parse';
import * as ts from 'typescript';
import * as parsei from '../ts/parse-import';

function getRequiredTestImports(details: parsei.ImportDetails): string[] {
  return [];
}

function addRequiredImports(options: any) {
  return (tree: Tree) => {
    let srcNode: ts.Node = tsSource(options.path);
    const imports: Array<any> = parse.findImportStatements(srcNode);
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
    console.log('-- imports schema, options: ', options);

    const workspace = getWorkspace(tree);
    const project = workspace.projects[options.project];
    const importsPath = join(project.root as Path, 'public');

    const defaultOptions = {
      requiredImports: getRequiredTestImports(options)
    };

    const templateOptions = {
      ...strings,
      ...defaultOptions,
      ...options
    };

    // imports stuff
    const rule = chain([
      addRequiredImports(options),
      mergeWith(apply(url('./files'), [
        template(templateOptions),
        move(importsPath),
      ]), MergeStrategy.Overwrite)
    ]);

    return rule(tree, context);
  };
}
