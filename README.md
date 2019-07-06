# Tsnip Schematics

Schematic implementation that generates snippets of test code for various Angular 7+ constructs; services, components etc.

## Calling the schematic

A typical call to `ng generate` includes the type being generated, eg `service` and the name for that type. To generate a service`myapi.service` the name will be `myapi`, eg:

    $ ng g service myapi

In the case of tsnip the file already exists and the type is determined from it's name, therefore the name will be specified including the type, eg `myapi.service`:

    $ ng g tsnip-schematics:tsnip --name=myapi.service
    
### Run tsnip

Running schematics searches in node_modules for packages, if not packaged yet use the relative path '.':

    $ schematics .:tsnip-schematics
    Nothing to be done. (means Tree was not modified)

(npm run build must have first been run to compile all .ts files into .js)

From another project

    $ schematics ../tsnip-schematics/src/collection.json:tsnip-schematics

### Test by running over an existing angular app

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

Link this project `npm link` then use it from another cli generated application.

From the other project `npm link tsnip-schematics` to link tsnip into ./node_modules

Run the schematics with a service source file to generate specs and imports:

    $ ng g tsnip-schematics:tsnip --name=myapi.service

Note: the name is relative to the default 'src/app' (or lib) project directory.

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
