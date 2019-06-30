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
Test which uses asyncs:
  https://github.com/angular/universal/blob/master/modules/express-engine/schematics/install/index.spec.ts
Provide async create util used by the test:
  https://github.com/angular/universal/blob/master/modules/express-engine/schematics/testing/test-app.ts
*/
describe('imports schematic', () => {

  const appOptions: ApplicationOptions = {
    name: 'test',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    skipTests: false,
    skipPackageJson: false,
  };

  let testRunner: SchematicTestRunner
  let appTree: Tree;

  beforeEach(async () => {
    testRunner = new SchematicTestRunner('schematics', collectionPath);
  });

  describe('without tree', () => {
    it('should complete with missing tree', async() => {
      const tree = await testRunner.runSchematicAsync('imports', {name: 'test.service.ts'}, Tree.empty());
      expect(tree).toBeTruthy();
    });
  });

  describe('with tree', () => {
    beforeEach(async () => {
      appTree = await createTestApp(testRunner, appOptions).toPromise();
    });

    it('should complete with valid tree', async() => {
      const tree = await testRunner.runSchematicAsync('imports', {name: 'test.service.ts'}, appTree).toPromise();
      expect(tree).toBeTruthy();
    });
  });
});
