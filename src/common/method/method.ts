export enum NameCrudType {
  GET, SAVE, UPDATE, DELETE, NONE
};

// Use parsem.MethodDetails
export interface MethodProperties {
  name: string,
  crud?: NameCrudType
  // params:
}

export function setupMethod(options: any): void {
}
