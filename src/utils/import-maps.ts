/**
 * Map standard imports (such as redux) to an external module identifier used to trigger specific test imports.
 */
export const StandardImports = {
	'@angular/common/http': 'commonhttp',
	'@angular-redux/store': 'redux-store',
	'@angular-redux/.*': 'redux',
    'rxjs/.*': 'redux',
    '@angular/router': 'router'
};

export class ImportMaps {

  static addMaps(map: Array<String>, name: string): void {
	Object.keys(StandardImports)
	  .filter(key => {
		return name.match(new RegExp(key));
	  }).forEach(key => {
		// console.log('-- map  ' + key + ' to ' + StandardImports[key]);
		const newKey = StandardImports[key];
		if (!map.includes(newKey)) {
		  map.push(newKey);
		}
	  });
  }
}
