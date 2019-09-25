import {join, normalize} from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';

import {parseName} from '@schematics/angular/utility/parse-name';
// import {paths} from '@schematics/angular/utility/paths';
import { ProjectType, WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { constants } from './constants';
import * as ts from 'typescript';
import { tsSource, tsSourceExists, tsSourcePathExists } from '../ts/source';
import * as parse from '../ts/parse';
import * as parsei from '../ts/parse-import';
import * as imports from '../common/imports/imports';

function relativeProjectPath(project: WorkspaceProject<ProjectType.Application | ProjectType.Library>) {
  const buildPath = buildDefaultPath(project);
  return buildPath.substring(1);
}

function setClassName(options: any) {
  let end = 0;
  if (options.isService) {
    end = options.name.indexOf(constants.serviceFileExtension);
  }
  if (options.isComponent) {
    end = options.name.indexOf(constants.componentFileExtension);
  }
  options.className = options.name.substring(0, end);
  // console.log('-- set class name', options.className);
}

export function addImportsAndLibraries(options: any): void {
  const sourcePath = tsSourceExists(options.sourcePath) ? options.sourcePath : null;
  if (!sourcePath) {
    // console.log('-- source[path] doesnt exist:', options.sourcePath);
    return;
  }
  const srcNode: ts.Node = tsSource(options.sourcePath);
  const importStatements: any[] = parse.findImportStatements(srcNode);
  options.libraries = [];
  options.imports = [];
  importStatements.forEach((i) => {
    const details: parsei.ImportDetails = parsei.importDetails(i);
    // console.log('-- add import, lib', details.originalImport, details.lib);
    imports.addReferencedLibraries(options.libraries, details.lib);
    options.imports.push({ originalImport: details.originalImport });
  });
  options.imports = options.imports.concat(imports.requiredTestImports(options.libraries));
}

// Search the workspace (package.json) to determine the options path, file name and file type (service, component, etc)
export function setupOptions(host: Tree, options: any): Tree {
  const workspace: WorkspaceSchema = getWorkspace(host);

  if (!options.project) {
    options.project = workspace.defaultProject
      ? workspace.defaultProject
      : Object.keys(workspace.projects)[0];
  }
  // const project: WorkspaceProject<ProjectType> = workspace.projects[options.project];
  let project: WorkspaceProject<ProjectType.Application | ProjectType.Library> = getProject(workspace, options.project);

  const nameExists = tsSourceExists(options.name + '.ts');
  // console.log('-- options name, exists?', options.name, nameExists);
  if (options.path === undefined) {
    if (nameExists) {
      options.path = '';
    } else {
      options.path = relativeProjectPath(project);
      // console.log('-- options def path', options.path);
    }
  }

  const parsedPath = parseName(options.path, options.name);
  // console.log('- p, n, newP, newN', options.path, options.name, parsedPath.name, parsedPath.path.substring(1));
  options.name = parsedPath.name;
  options.path = parsedPath.path.substring(1);
  options.sourcePath = join(normalize(options.path), options.name + '.ts');
  options.outputPath = './public';
  options.isService = options.name.endsWith(constants.serviceFileExtension);
  options.isComponent = options.isService ? false : options.name.endsWith(constants.componentFileExtension);
  setClassName(options);
  // console.log('-- setup options', JSON.stringify(options, null, 4));

  if (!options.imports && !options.libraries) {
    addImportsAndLibraries(options);
  }
  return host;
}
