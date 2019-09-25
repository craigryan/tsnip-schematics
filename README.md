# Tsnip Schematics

Schematic implementation that generates snippets of test code for various Angular 7+ constructs; services, components etc.

## Calling the schematic

A typical call to `ng generate` includes the type being generated, eg `service` and the name for that type. To generate a service`myapi.service` the name will be `myapi`, eg:

```bash
ng g service myapi
```

In the case of tsnip the file already exists and the type is determined from it's name, therefore the name will be specified including the type, eg `myapi.service`:

```bash
ng g tsnip-schematics:tsnip --name=myapi.service
```

## Run tsnip

Running schematics searches in node_modules for packages, if not packaged yet use the relative path '.':

```bash
schematics .:tsnip-schematics
Nothing to be done. (means Tree was not modified)
```

(npm run build must have first been run to compile all .ts files into .js)

From another project

```bash
schematics ../tsnip-schematics/src/collection.json:tsnip-schematics
```

## Test by running over an existing angular app

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

Link this project `npm link` then use it from another cli generated application.

From the other project `npm link tsnip-schematics` to link tsnip into ./node_modules

Run the schematics with a service source file to generate specs and imports:

```bash
ng g tsnip-schematics:tsnip --name=myapi.service
```

Note: the name is relative to the default 'src/app' (or lib) project directory.

## Unit Testing

```bash
npm run test
```
will run the unit tests, using Jasmine as a runner and test framework.

## Publishing

See this page for all project scripts

https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c

Get a npmjs.com login

```bash
npm adduser
npm login
```

To publish, simply do:

```bash
npm publish
```

See the published artefact, visit:

https://npmjs.com/package/tsnip-schematics

Bump new verion, then publish again

```bash
npm version patch
npm publish
```

## Template parameters

Variables recognised within the templates.

. __sourcePath__: full rel path, eg 'test/test.service.ts',
. __name__: file name less extent eg 'test.service'
. __path__: dir name eg 'test'
. __outputPath__: to store generated output in. eg './public'
. __isService__: boolean
. __isComponent__: boolean
. __className__: name of class, less suffix (eg 'test' without the 'Service')
. __libraries__: standard groups of libs [ 'commonhttp', 'redux' ] etc
  
### Services

. __mocks__ ([].name, .typeReference, .isPrivate): user mock class names less 'Mock' prefix
. __standardMocks__ (array): standard module mocks
. __imports__ (array): standard module mock libraries
. __lets__ ([].decl, .name, .type, .value): test wide let variables
. __beforeeach__ (.providers[].provide, .useClass): configureTestingModule providers
. __beforeeach__ (.imports[]): configureTestingModule imports

## AST for test.service.ts

To re-generate this output, edit src/tsnip/index.ts and uncomment showTree() code. Build/link the schematic and run 
it again in the tsnip-cli8-project

    SourceFile
        SyntaxList
            ImportDeclaration
                ImportKeyword
                    Text: import
                ImportClause
                    NamedImports
                        FirstPunctuation
                            Text: {
                        SyntaxList
                            ImportSpecifier
                                Identifier
                                    Text: Injectable
                            CommaToken
                                Text: ,
                            ImportSpecifier
                                Identifier
                                    Text: Inject
                        CloseBraceToken
                            Text: }
                FromKeyword
                    Text: from
                StringLiteral
                    Text: '@angular/core'
                SemicolonToken
                    Text: ;
            ImportDeclaration
                ImportKeyword
                    Text: import
                ImportClause
                    NamedImports
                        FirstPunctuation
                            Text: {
                        SyntaxList
                            ImportSpecifier
                                Identifier
                                    Text: HttpClient
                            CommaToken
                                Text: ,
                            ImportSpecifier
                                Identifier
                                    Text: HttpParams
                            CommaToken
                                Text: ,
                            ImportSpecifier
                                Identifier
                                    Text: HttpErrorResponse
                        CloseBraceToken
                            Text: }
                FromKeyword
                    Text: from
                StringLiteral
                    Text: '@angular/common/http'
                SemicolonToken
                    Text: ;
            ImportDeclaration
                ImportKeyword
                    Text: import
                ImportClause
                    NamedImports
                        FirstPunctuation
                            Text: {
                        SyntaxList
                            ImportSpecifier
                                Identifier
                                    Text: Observable
                            CommaToken
                                Text: ,
                            ImportSpecifier
                                Identifier
                                    Text: of
                        CloseBraceToken
                            Text: }
                FromKeyword
                    Text: from
                StringLiteral
                    Text: 'rxjs'
                SemicolonToken
                    Text: ;
            ImportDeclaration
                ImportKeyword
                    Text: import
                ImportClause
                    NamedImports
                        FirstPunctuation
                            Text: {
                        SyntaxList
                            ImportSpecifier
                                Identifier
                                    Text: map
                        CloseBraceToken
                            Text: }
                FromKeyword
                    Text: from
                StringLiteral
                    Text: 'rxjs/operators'
                SemicolonToken
                    Text: ;
            InterfaceDeclaration
                InterfaceKeyword
                    Text: interface
                Identifier
                    Text: ApiResponse
                FirstPunctuation
                    Text: {
                SyntaxList
                    PropertySignature
                        Identifier
                            Text: stringValue
                        ColonToken
                            Text: :
                        StringKeyword
                            Text: string
                CloseBraceToken
                    Text: }
            ClassDeclaration
                SyntaxList
                    Decorator
                        AtToken
                            Text: @
                        CallExpression
                            Identifier
                                Text: Injectable
                            OpenParenToken
                                Text: (
                            SyntaxList
                                ObjectLiteralExpression
                                    FirstPunctuation
                                        Text: {
                                    SyntaxList
                                        PropertyAssignment
                                            Identifier
                                                Text: providedIn
                                            ColonToken
                                                Text: :
                                            StringLiteral
                                                Text: 'root'
                                    CloseBraceToken
                                        Text: }
                            CloseParenToken
                                Text: )
                SyntaxList
                    ExportKeyword
                        Text: export
                ClassKeyword
                    Text: class
                Identifier
                    Text: MyapiService
                FirstPunctuation
                    Text: {
                SyntaxList
                    PropertyDeclaration
                        SyntaxList
                            PrivateKeyword
                                Text: private
                        Identifier
                            Text: apiUrl
                        ColonToken
                            Text: :
                        StringKeyword
                            Text: string
                        SemicolonToken
                            Text: ;
                    Constructor
                        ConstructorKeyword
                            Text: constructor
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Parameter
                                SyntaxList
                                    PrivateKeyword
                                        Text: private
                                Identifier
                                    Text: http
                                ColonToken
                                    Text: :
                                TypeReference
                                    Identifier
                                        Text: HttpClient
                            CommaToken
                                Text: ,
                            Parameter
                                SyntaxList
                                    PrivateKeyword
                                        Text: private
                                Identifier
                                    Text: url
                                ColonToken
                                    Text: :
                                StringKeyword
                                    Text: string
                        CloseParenToken
                            Text: )
                        Block
                            FirstPunctuation
                                Text: {
                            SyntaxList
                                ExpressionStatement
                                    BinaryExpression
                                        PropertyAccessExpression
                                            ThisKeyword
                                                Text: this
                                            DotToken
                                                Text: .
                                            Identifier
                                                Text: apiUrl
                                        FirstAssignment
                                            Text: =
                                        Identifier
                                            Text: url
                                    SemicolonToken
                                        Text: ;
                            CloseBraceToken
                                Text: }
                    MethodDeclaration
                        Identifier
                            Text: getApiResponse
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Parameter
                                Identifier
                                    Text: ignoreErrors
                                ColonToken
                                    Text: :
                                BooleanKeyword
                                    Text: boolean
                                FirstAssignment
                                    Text: =
                                FalseKeyword
                                    Text: false
                        CloseParenToken
                            Text: )
                        ColonToken
                            Text: :
                        TypeReference
                            Identifier
                                Text: Observable
                            FirstBinaryOperator
                                Text: <
                            SyntaxList
                                StringKeyword
                                    Text: string
                            GreaterThanToken
                                Text: >
                        Block
                            FirstPunctuation
                                Text: {
                            SyntaxList
                                VariableStatement
                                    VariableDeclarationList
                                        ConstKeyword
                                            Text: const
                                        SyntaxList
                                            VariableDeclaration
                                                Identifier
                                                    Text: url
                                                ColonToken
                                                    Text: :
                                                StringKeyword
                                                    Text: string
                                                FirstAssignment
                                                    Text: =
                                                TemplateExpression
                                                    TemplateHead
                                                        Text: `${
                                                    SyntaxList
                                                        TemplateSpan
                                                            PropertyAccessExpression
                                                                ThisKeyword
                                                                    Text: this
                                                                DotToken
                                                                    Text: .
                                                                Identifier
                                                                    Text: apiUrl
                                                            LastTemplateToken
                                                                Text: }`
                                    SemicolonToken
                                        Text: ;
                                VariableStatement
                                    VariableDeclarationList
                                        ConstKeyword
                                            Text: const
                                        SyntaxList
                                            VariableDeclaration
                                                Identifier
                                                    Text: requestArguments
                                                FirstAssignment
                                                    Text: =
                                                ObjectLiteralExpression
                                                    FirstPunctuation
                                                        Text: {
                                                    SyntaxList
                                                        PropertyAssignment
                                                            Identifier
                                                                Text: headers
                                                            ColonToken
                                                                Text: :
                                                            ObjectLiteralExpression
                                                                FirstPunctuation
                                                                    Text: {
                                                                SyntaxList
                                                                    Text: 
                                                                CloseBraceToken
                                                                    Text: }
                                                        CommaToken
                                                            Text: ,
                                                        PropertyAssignment
                                                            Identifier
                                                                Text: withCredentials
                                                            ColonToken
                                                                Text: :
                                                            TrueKeyword
                                                                Text: true
                                                    CloseBraceToken
                                                        Text: }
                                    SemicolonToken
                                        Text: ;
                                IfStatement
                                    IfKeyword
                                        Text: if
                                    OpenParenToken
                                        Text: (
                                    PropertyAccessExpression
                                        ThisKeyword
                                            Text: this
                                        DotToken
                                            Text: .
                                        Identifier
                                            Text: hasSecrets
                                    CloseParenToken
                                        Text: )
                                    Block
                                        FirstPunctuation
                                            Text: {
                                        SyntaxList
                                            ExpressionStatement
                                                CallExpression
                                                    PropertyAccessExpression
                                                        ThisKeyword
                                                            Text: this
                                                        DotToken
                                                            Text: .
                                                        Identifier
                                                            Text: secretMethod
                                                    OpenParenToken
                                                        Text: (
                                                    SyntaxList
                                                        Identifier
                                                            Text: url
                                                    CloseParenToken
                                                        Text: )
                                                SemicolonToken
                                                    Text: ;
                                        CloseBraceToken
                                            Text: }
                                ExpressionStatement
                                    BinaryExpression
                                        ElementAccessExpression
                                            PropertyAccessExpression
                                                Identifier
                                                    Text: requestArguments
                                                DotToken
                                                    Text: .
                                                Identifier
                                                    Text: headers
                                            OpenBracketToken
                                                Text: [
                                            StringLiteral
                                                Text: 'x-stuff'
                                            CloseBracketToken
                                                Text: ]
                                        FirstAssignment
                                            Text: =
                                        StringLiteral
                                            Text: 'api'
                                    SemicolonToken
                                        Text: ;
                                ReturnStatement
                                    ReturnKeyword
                                        Text: return
                                    CallExpression
                                        PropertyAccessExpression
                                            CallExpression
                                                PropertyAccessExpression
                                                    PropertyAccessExpression
                                                        ThisKeyword
                                                            Text: this
                                                        DotToken
                                                            Text: .
                                                        Identifier
                                                            Text: http
                                                    DotToken
                                                        Text: .
                                                    Identifier
                                                        Text: get
                                                FirstBinaryOperator
                                                    Text: <
                                                SyntaxList
                                                    TypeReference
                                                        Identifier
                                                            Text: ApiResponse
                                                GreaterThanToken
                                                    Text: >
                                                OpenParenToken
                                                    Text: (
                                                SyntaxList
                                                    Identifier
                                                        Text: url
                                                    CommaToken
                                                        Text: ,
                                                    Identifier
                                                        Text: requestArguments
                                                CloseParenToken
                                                    Text: )
                                            DotToken
                                                Text: .
                                            Identifier
                                                Text: pipe
                                        OpenParenToken
                                            Text: (
                                        SyntaxList
                                            CallExpression
                                                Identifier
                                                    Text: map
                                                OpenParenToken
                                                    Text: (
                                                SyntaxList
                                                    ArrowFunction
                                                        SyntaxList
                                                            Parameter
                                                                Identifier
                                                                    Text: response
                                                        EqualsGreaterThanToken
                                                            Text: =>
                                                        Block
                                                            FirstPunctuation
                                                                Text: {
                                                            SyntaxList
                                                                ReturnStatement
                                                                    ReturnKeyword
                                                                        Text: return
                                                                    PropertyAccessExpression
                                                                        Identifier
                                                                            Text: response
                                                                        DotToken
                                                                            Text: .
                                                                        Identifier
                                                                            Text: stringValue
                                                                    SemicolonToken
                                                                        Text: ;
                                                            CloseBraceToken
                                                                Text: }
                                                CloseParenToken
                                                    Text: )
                                        CloseParenToken
                                            Text: )
                                    SemicolonToken
                                        Text: ;
                            CloseBraceToken
                                Text: }
                    MethodDeclaration
                        SyntaxList
                            PublicKeyword
                                Text: public
                        Identifier
                            Text: storeResult
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Parameter
                                Identifier
                                    Text: result
                                ColonToken
                                    Text: :
                                StringKeyword
                                    Text: string
                        CloseParenToken
                            Text: )
                        ColonToken
                            Text: :
                        VoidKeyword
                            Text: void
                        Block
                            FirstPunctuation
                                Text: {
                            SyntaxList
                                VariableStatement
                                    VariableDeclarationList
                                        ConstKeyword
                                            Text: const
                                        SyntaxList
                                            VariableDeclaration
                                                Identifier
                                                    Text: body
                                                ColonToken
                                                    Text: :
                                                StringKeyword
                                                    Text: string
                                                FirstAssignment
                                                    Text: =
                                                StringLiteral
                                                    Text: '{ flag: 1 }'
                                    SemicolonToken
                                        Text: ;
                                ExpressionStatement
                                    CallExpression
                                        PropertyAccessExpression
                                            PropertyAccessExpression
                                                ThisKeyword
                                                    Text: this
                                                DotToken
                                                    Text: .
                                                Identifier
                                                    Text: http
                                            DotToken
                                                Text: .
                                            Identifier
                                                Text: post
                                        OpenParenToken
                                            Text: (
                                        SyntaxList
                                            Identifier
                                                Text: url
                                            CommaToken
                                                Text: ,
                                            Identifier
                                                Text: body
                                        CloseParenToken
                                            Text: )
                                    SemicolonToken
                                        Text: ;
                            CloseBraceToken
                                Text: }
                    GetAccessor
                        SyntaxList
                            PrivateKeyword
                                Text: private
                        GetKeyword
                            Text: get
                        Identifier
                            Text: hasSecrets
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Text: 
                        CloseParenToken
                            Text: )
                        ColonToken
                            Text: :
                        BooleanKeyword
                            Text: boolean
                        Block
                            FirstPunctuation
                                Text: {
                            SyntaxList
                                ReturnStatement
                                    ReturnKeyword
                                        Text: return
                                    TrueKeyword
                                        Text: true
                                    SemicolonToken
                                        Text: ;
                            CloseBraceToken
                                Text: }
                    MethodDeclaration
                        SyntaxList
                            PrivateKeyword
                                Text: private
                        Identifier
                            Text: secretMethod
                        OpenParenToken
                            Text: (
                        SyntaxList
                            Parameter
                                Identifier
                                    Text: url
                                ColonToken
                                    Text: :
                                StringKeyword
                                    Text: string
                        CloseParenToken
                            Text: )
                        Block
                            FirstPunctuation
                                Text: {
                            SyntaxList
                                Text: 
                            CloseBraceToken
                                Text: }
                CloseBraceToken
                    Text: }
        EndOfFileToken
            Text: 
