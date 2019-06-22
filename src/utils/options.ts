import { Tree } from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';
import {parseName} from '@schematics/angular/utility/parse-name';
// import {paths} from '@schematics/angular/utility/paths';
import { WorkspaceSchema, WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { constants } from './constants';

// Search the workspace (package.json) to determine the options path, file name and file type (service, component, etc)
export function setupOptions(host: Tree, options: any): Tree {
  const workspace: WorkspaceSchema = getWorkspace(host);

  if (!options.project) {
    options.project = workspace.defaultProject
      ? workspace.defaultProject
      : Object.keys(workspace.projects)[0];
  }
  // const project: WorkspaceProject<ProjectType> = workspace.projects[options.project];
  let project: WorkspaceProject<ProjectType.Application> = getProject(workspace, options.project);

  if (options.path === undefined) {
    options.path = buildDefaultPath(project);
  }

  // const rel = paths.
  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;
  options.isService = options.name.endsWith(constants.serviceFileExtension);
  options.isComponent = options.isService ? false : options.name.endsWith(constants.componentFileExtension);
  return host;
}
