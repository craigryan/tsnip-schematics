import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import {Schema as ApplicationOptions} from '@schematics/angular/application/schema';
import {Schema as WorkspaceOptions} from '@schematics/angular/workspace/schema';
import * as path from 'path';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {createTestApp} from '../utils/test-app';

const collectionPath = path.join(__dirname, '../collection.json');

/*
Test:
  https://github.com/angular/universal/blob/master/modules/express-engine/schematics/install/index.spec.ts
Using async create util:
  https://github.com/angular/universal/blob/master/modules/express-engine/schematics/testing/test-app.ts
*/
fdescribe('imports schematic', () => {

  const appOptions: ApplicationOptions = {
    name: 'tsnip',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    skipTests: false,
    skipPackageJson: false,
  };

  let testRunner: SchematicTestRunner
  let appTree: Tree;

  beforeEach(async () => {
    testRunner = new SchematicTestRunner('tsnip-schematic', collectionPath);
    appTree = await createTestApp(testRunner, appOptions).toPromise();
  });
  describe('', () => {
  describe('with project', () => {
    it('should complete with missing tree', async() => {
      const tree = await testRunner.runSchematicAsync('imports', {name: 'test-service'}, Tree.empty());
      expect(tree).toBeTruthy();
    });
  });
});
