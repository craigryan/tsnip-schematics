/**
 * Group standard imports by a common key
 */
interface ImportType {
  [lib: string]: string
};

export const StandardImports: ImportType = {
  '@angular/common/http': 'commonhttp',
  '@angular-redux/store': 'redux-store',
  '@angular-redux/.*': 'redux',
  '@angular/forms': 'forms',
  'rxjs/.*': 'redux',
  'rxjs': 'redux',
  '@ngrx/store': 'ngrx-store',
  '@ngrx/.*': 'ngrx',
  '@angular/router': 'router'
};

export class ImportMaps {

  static addLibraries(map: Array<String>, name: string): void {
    // console.log('-- imp match name', name);
	Object.keys(StandardImports)
	  .filter(key => {
		  return name.match(new RegExp(key));
	  }).forEach(key => {
		  // console.log('-- map  ' + key + ' to ' + StandardImports[key]);
		  const newKey: string = StandardImports[key];
		  if (!map.includes(newKey)) {
		    map.push(newKey);
      }
	  });
  }
}
