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
    appTree = await createTestApp(testRunner, appOptions).toPromise();
  });

  describe('with bad inputs', () => {
    it('should fail with missing tree', () => {
      let caught = false;
      testRunner.runSchematicAsync('imports', {name: './test/test.service.ts'}, Tree.empty()).toPromise()
        .then(ex => {
          fail('expected to fail because of empty tree');
        }).catch((ex) => {
          // expected
        });
    });
    it('should fail with missing parameters', () => {
      let caught = false;
      testRunner.runSchematicAsync('imports', {}, appTree).toPromise()
        .then(ex => {
          // unexpected
          fail('expected to fail because of missing parameters');
        }).catch((ex) => {
          // expected
        });
    });
  });

  describe('with valid inputs', () => {

    it('should generate import snippet', () => {
      testRunner.runSchematicAsync('imports', {name: 'test.service', path: './test'}, appTree).toPromise().then(tree => {
        const files = tree.files;
        expect(files).toBeTruthy();
        // const x = 
        expect(files).toContain('/public/tsnip-test.service.imports.ts');
        expect(tree.readContent('/public/tsnip-test.service.imports.ts'))
          .toContain('import {HttpClientTestingModule, HttpTestingController} from \'@angular/common/http/testing\';');
        expect(tree.readContent('/public/tsnip-test.service.imports.ts'))
          .toContain('import { TestService } from \'./test.service\';');
      });
    });
  });
});
