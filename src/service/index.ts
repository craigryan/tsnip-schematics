import {
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
// import {constants} from '../utils/constants';

export function serviceSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const node = tsSource('.' + options.path + '/' + options.name);
    console.log('-- service schema');

    // service stuff

    return tree;
  };
}
