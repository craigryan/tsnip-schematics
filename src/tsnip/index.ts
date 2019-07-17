import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
  schematic
} from '@angular-devkit/schematics';
import {setupOptions} from '../utils/options';
import {constants} from '../utils/constants';
import { tsSource, showTree } from '../ts/source';

export function tsnip(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);

    const node = tsSource(options.sourcePath);
    if (node) {
      // showTree(node);
    }
    const rule = chain([
      options.isService ? schematic(constants.serviceSchematic, options) : noop()
    ]);

    return rule(tree, context);
  };
}
