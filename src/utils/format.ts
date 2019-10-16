import {
  Rule,
  Tree,
  FileEntry
} from '@angular-devkit/schematics';

const prettier = require('prettier');

/*
 * Rule to apply 'prettier' code formatting on generated typescript source under 'matchingPath'
 */
export function format(matchingPath: string): Rule {
  return (tree: Tree) => {
    tree.visit((path: string, entry: FileEntry) => {
      if (!entry) {
        return;
      }
      if (path.startsWith(matchingPath) && path.endsWith('.ts')) {
        const generatedContent = entry.content.toString();
        const newContent = prettier.format(generatedContent, { parser: 'typescript' });
        tree.overwrite(path, newContent);
      }
    });
  };
}
