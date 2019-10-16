/**
 * Map standard method calls to a key used to generate expect clauses.
 */
interface CallType { [key: string]: Array<string> };

const StandardCalls: CallType = {
  'this.http.get': [
	'http.get', "toHaveBeenCalledWith('')"
  ],
  'this.http.put': [
	'http.put', 'toHaveBeenCalled()'
  ],
  'this.http.delete': [
	'http.delete', 'toHaveBeenCalled()'
  ],
  'this.http.post': [
	'http.post', "toHaveBeenCalledWith('')"
  ],
  'this.router.navigate': [
	'router.navigate', "toHaveBeenCalledWith('/')"
  ]
};

class MethodCallMaps {

  static addMaps(map: CallType, name: string) {
	// console.log('-- add call maps for ' + name);
	Object.keys(StandardCalls)
	  .filter(key => {
		return name.match(new RegExp(key));
	  }).forEach(key => {
        //			console.log('-- mapped  ' + key + ' to ' + StandardCalls[key]);
		const newKey: Array<string> = StandardCalls[key];
          /*
		if (!map.includes(newKey)) {
		  map.push(newKey);
		}
          */
	  });
  }
}

