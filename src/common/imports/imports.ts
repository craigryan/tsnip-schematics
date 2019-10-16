import { ImportMaps } from './import-maps';

export function requiredTestImports(libraries: string[]): any[] {
  const imports: any[] = [];
  libraries.forEach((lib: string) => {
    switch (lib) {
    case 'commonhttp':
      imports.push(
        {imports: '{HttpClientTestingModule, HttpTestingController}', from: '@angular/common/http/testing'}
      );
      break;
    case 'redux':
      imports.push(
        {imports: '{MockNgRedux, NgReduxTestingModule}', from: '@angular-redux/store/lib/testing'}
      );
      break;
    case 'forms':
      imports.push(
        {imports: '{FormsModule, ReactiveFormsModule}', from: '@angular/forms'}
      );
      break;
    case 'ngrx':
      imports.push(
        {imports: '{ provideMockStore, MockStore }', from: '@ngrx/store/testing'}
      );
      break;
    }
  });
  return imports;
}

export function addReferencedLibraries(libs: string[], importedLib: string): void {
  const libraries: string[] = [];
  ImportMaps.addLibraries(libraries, importedLib);
  libraries.forEach((lib) => {
    if (!libs.includes(lib)) {
      libs.push(lib);
    }
  });
}
