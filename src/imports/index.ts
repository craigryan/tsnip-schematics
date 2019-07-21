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
// import {setupOptions} from '../utils/options';

export function importsSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // setupOptions(tree, options);
    const workspace = getWorkspace(tree);
    const project = workspace.projects[options.project];

    const rule = chain([
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
