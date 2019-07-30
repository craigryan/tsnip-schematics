import {join, normalize} from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';

import {parseName} from '@schematics/angular/utility/parse-name';
// import {paths} from '@schematics/angular/utility/paths';
import { WorkspaceSchema, WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';

import { constants } from './constants';
import * as ts from 'typescript';
import { tsSource, tsSourceExists, tsSourcePathExists } from '../ts/source';
import * as parse from '../ts/parse';
import * as parsei from '../ts/parse-import';
import { ImportMaps } from './import-maps';

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

function addRequiredTestImports(options: any): void {
  options.libraries.forEach((lib: string) => {
    switch (lib) {
    case 'commonhttp':
      options.imports.push(
        {imports: '{HttpClientTestingModule, HttpTestingController}', from: '@angular/common/http/testing'}
      );
      break;
    case 'redux':
      options.imports.push(
        {imports: '{MockNgRedux, NgReduxTestingModule}', from: '@angular-redux/store/lib/testing'}
      );
      break;
    case 'forms':
      options.imports.push(
        {imports: '{FormsModule, ReactiveFormsModule}', from: '@angular/forms'}
      );
      break;
    case 'ngrx':
      options.imports.push(
        {imports: '{ provideMockStore, MockStore }', from: '@ngrx/store/testing'}
      );
      break;
    }
  });
}

function addReferencedLibraries(libs: Array<string>, details: parsei.ImportDetails): void {
  const libraries: Array<string> = [];
  ImportMaps.addLibraries(libraries, details.lib);
  libraries.forEach((lib) => {
    if (!libs.includes(lib)) {
      libs.push(lib);
    }
  });
}

export function addImportsAndLibraries(options: any): void {
  let sourcePath = tsSourceExists(options.sourcePath) ? options.sourcePath : null;
  if (!sourcePath) {
    // console.log('-- source[path] doesnt exist:', options.sourcePath);
    return;
  }
  let srcNode: ts.Node = tsSource(options.sourcePath);
  const imports: Array<any> = parse.findImportStatements(srcNode);
  options.imports = [];
  options.libraries = [];
  imports.forEach((i) => {
    const details: parsei.ImportDetails = parsei.importDetails(i);
    // console.log('-- add import, lib', details.originalImport, details.lib);
    addReferencedLibraries(options.libraries, details);
    options.imports.push(details.originalImport);
  });
  addRequiredTestImports(options);
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

  if (!options.imports) {
    addImportsAndLibraries(options);
  }
  return host;
}
