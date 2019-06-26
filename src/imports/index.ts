import {
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
// import {constants} from '../utils/constants';

export function importsSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    console.log('-- imports schema');

    // imports stuff

    return tree;
  };
}
