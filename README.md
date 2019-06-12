# Tsnip Schematics

Schematic implementation that generates snippets of test code for various Angular 7+ constructs; services, components etc.

### Run tsnip

Running schematics searches in node_modules for packages, if not packaged yet use the relative path '.':

    $ schematics .:tsnip-schematics
    Nothing to be done. (means Tree was not modified)

(npm run build must have first been run to compile all .ts files into .js)

From another project
    $ schematics ../tsnip-schematics/src/collection.json:tsnip-schematics

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

Link this project `npm link` then use it from another cli generated application.

From the other project `npm link tsnip-schematics` to link tsnip into ./node_modules

Run the schematics with a service source file to generate specs and imports:

    $ ng g tsnip-schematics:tsnip --name=myapi.service.ts

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
