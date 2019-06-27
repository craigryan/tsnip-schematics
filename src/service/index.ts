import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic
} from '@angular-devkit/schematics';
import {constants} from '../utils/constants';

export function serviceSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // const node = tsSource('.' + options.path + '/' + options.name);
    console.log('-- service schema');

    // service stuff

    const rule = chain([
      schematic(constants.importsSchematic, options)
    ]);

    return rule(tree, context);
  };
}
