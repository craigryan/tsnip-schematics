import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('tsnip', () => {
  it('should run tsnip schematic', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('tsnip', { name: 'test/test.server.ts' }, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
