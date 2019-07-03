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
    testRunner = new SchematicTestRunner('schematics', collectionPath);
  });

  describe('without tree', () => {
    xit('should complete with missing tree', () => {
      let caught = false;
      testRunner.runSchematicAsync('imports', {name: './test/test.service.ts'}, Tree.empty()).toPromise()
        .then(ex => {
        // unexpected
        }).catch((ex) => {
          caught = true;
        });
      expect(caught).toBe(true);
    });
  });

  describe('with tree', () => {
    beforeEach(async () => {
      appTree = await createTestApp(testRunner, appOptions).toPromise();
    });

    it('should complete with valid tree', () => {
      testRunner.runSchematicAsync('imports', {name: './test/test.service.ts'}, appTree).toPromise().then(tree => {
        const files = tree.files;
        expect(files).toBeTruthy();
        // console.log(JSON.stringify(tree.files, undefined, 2));
        // tree.readContent('/projects/schematest/src/app/app.component.ts'); 
        //expect(appComponent).toContain(`name = '${schemaOptions.name}'`); 
      });
    });
  });
});
