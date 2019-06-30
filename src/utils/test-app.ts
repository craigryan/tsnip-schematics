import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'path';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export function createTestApp(baseRunner: SchematicTestRunner, appOptions = {}): Observable<UnitTestTree> {
  return baseRunner
    .runExternalSchematicAsync('@schematics/angular', 'workspace', {
      name: 'workspace',
      version: '6.0.0',
      newProjectRoot: '',
    })
    .pipe(
      switchMap(workspaceTree => baseRunner.runExternalSchematicAsync(
        '@schematics/angular', 'application',
        {...appOptions}, workspaceTree)),
    );
}
