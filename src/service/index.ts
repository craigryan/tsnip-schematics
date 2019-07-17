import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic
} from '@angular-devkit/schematics';
import {constants} from '../utils/constants';

function addMocks(options: any): void {
  // mocks and standardMocks
}

export function serviceSchematics(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // const node = tsSource('.' + options.path + '/' + options.name);
    console.log('-- service schema');

    addMocks(options);

    const rule = chain([
      schematic(constants.importsSchematic, options),
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings, ...options
          }),
          move(options.outputPath)
        ]),
        MergeStrategy.Default
      )
    ]);

    return rule(tree, context);
  };
}
