import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import {InvalidInputOptions} from '@angular-devkit/schematics/tools/schema-option-transform';
import {Schema as WorkspaceOptions} from '@schematics/angular/workspace/schema';
import {Schema as ApplicationOptions} from '@schematics/angular/application/schema';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

xdescribe('services schematic', () => {

  const testRunner = new SchematicTestRunner(
    'tsnip',
    collectionPath
  );

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  describe('with project', () => {

    const appOptions: ApplicationOptions = {
      name: 'tsnip',
      inlineStyle: false,
      inlineTemplate: false,
      routing: false,
      skipTests: false,
      skipPackageJson: false,
    };

    let appTree: UnitTestTree;

    beforeEach(() => {
      appTree = testRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
      appTree = testRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    });

    it('should fail with missing tree', () => {
      expect(() => testRunner.runSchematic('service', {name: 'test-service'}, Tree.empty())).toThrow();
    });

    xit('should fail with missing params', () => {
      expect(() => testRunner.runSchematic('service', {}, appTree)).toThrow();
      // toThrowError(InvalidInputOptions,
      // '');
    });

    xit('should work', () => {
      const tree = testRunner.runSchematic('service', {
        name: 'myservice'
      }, appTree);
      expect(tree.files).toEqual([]);
    });

  });

});
