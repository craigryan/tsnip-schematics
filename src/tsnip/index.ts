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

export function tsnip(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);
    console.log('IN tsnip schematics2');
    const rule = chain([
      options.isService ? schematic(constants.serviceSchematic, options) : noop()
    ]);

    return rule(tree, context);
  };
}
