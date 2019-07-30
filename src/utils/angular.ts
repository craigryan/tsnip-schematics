/**
 * Check for standard/known Angular constructs
 */

export class Types {

  static knownServiceType(typeReference: string): boolean {
    switch (typeReference) {
	  case 'FormBuilder':
	  case 'HttpClient':
	  case 'Router':
	  case 'Route':
		  return true;
	  default:
      break;
    }
    if (typeReference.startsWith('Store<')) {
      // Store<a-type> for ngrx
      return true;
    }
	return false;
  }

}

