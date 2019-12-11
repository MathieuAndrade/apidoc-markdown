# ApiDoc-markdown

ApiDoc markdown creates a documentation from API descriptions in your source code.

> It uses apidoc to convert inline documentation comments into json schema and later convert it to markdown.

Uses the [apidoc-core](https://github.com/apidoc/apidoc-core) library.

Documentation: [apidocjs.com](http://apidocjs.com)

## Installation

```bash
$ npm install -g apidoc-markdown
```

## Usage

Add some apidoc comments anywhere in your source code:

```javascript
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
```

Now generate the documentation from `src/` into `doc/`.

```bash
$ apidoc-markdown -i src/ -o doc/
```

### Most important cli commands
```bash
-f --file-filters <file-filters>         RegEx-Filter to select files that should be parsed (multiple -f can be used). (default: [])
-e, --exclude-filters <exclude-filters>  RegEx-Filter to select files / dirs that should not be parsed (many -e can be used). (default: [])
-i, --input <input>                      Input/source dirname. (default: [])
-o, --output <output>                    Output dirname. (default: "./doc/")
-t, --template <template>                Template to use for output files. Can be a path or a template type available. (default: "default.md")
-d, --data                               Return data files. (default: false)
-c, --config <config>                    Path to directory containing config file (apidoc.json). (default: "./")
-v, --verbose                            Verbose debug output.
--debug                                  Show debug messages.
```
> Available templates can be found in templates directory.

## Support

Please [create a new issue](https://github.com/MathieuAndrade/apidoc-markdown/issues/new/choose) if you have a suggestion/question or if you found a problem/bug.

## Contributing

ApiDoc-markdown is a collaborative project. Pull requests are welcome. Please see the [CONTRIBUTING](https://github.com/MathieuAndrade/apidoc-markdown/blob/master/CONTRIBUTING.md) file.

## Todo
 - [ ] Improve gitbook template
 - [ ] Write Automated tests
 - [ ] Create a index file with all links of routes
 - [ ] Write a example
 - [ ] One file per route feature

 Don't hesitate to suggest any feature you would like by creating an [issue](https://github.com/MathieuAndrade/apidoc-markdown/issues) or a [pull request](https://github.com/MathieuAndrade/apidoc-markdown/pulls).

## License
[The MIT license](./LICENSE)

## Thanks 

- At apiDoc for the awesome apiDoc-core module
- At `` rigwild`` for its huge work on the [apiDoc-markdown](https://github.com/rigwild/apidoc-markdown) module
