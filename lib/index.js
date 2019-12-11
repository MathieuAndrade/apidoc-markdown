const _ = require('lodash');
const apidoc = require('apidoc-core');
const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');
const Markdown = require('markdown-it');
const generateMarkdownFiles = require('./generator.js')

const PackageInfo = require('./package_info');

const defaults = {
    dest: path.join(__dirname, '../doc/'),
    template: path.join(__dirname, '../templates/default.md'),
    data: false,
    debug: false,
    silent: false,
    verbose: false,
    simulate: false,
    colorize: true,
    markdown: true,
    config: './',
    apiprivate: false,
    encoding: 'utf8'
};

let app = {
    log: {},
    markdownParser: null,
    options: {}
};

// Display uncaught Exception.
process.on('uncaughtException', function (err) {
    console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

/**
 * Create the documentation
 *
 * @param  {Object} options See defaults and apidoc-core defaults for all options / `apidoc --help`
 * @returns {Mixed} true = ok, but nothing todo | false = error | Object with parsed data and project-informations.
 */
const createDoc = async (options) => {
    let api;
    const apidocPath = path.join(__dirname, '../');
    let markdownParser;
    let packageInfo;

    options = _.defaults({}, options, defaults);

    // Paths.
    options.dest = path.join(options.dest, './');
    options.template = path.join(options.template, './');

    // Line-Ending.
    if (options.lineEnding) {
        if (options.lineEnding === 'CRLF')
            options.lineEnding = '\r\n'; // win32
        else if (options.lineEnding === 'CR')
            options.lineEnding = '\r'; // darwin
        else
            options.lineEnding = '\n'; // linux
    }

    // Options.
    app.options = options;

    // Logger.
    app.log = winston.createLogger({
        transports: [
            new (winston.transports.Console)({
                level: app.options.debug ? 'debug' : app.options.verbose ? 'verbose' : 'info',
                silent: app.options.silent,
                prettyPrint: true,
                colorize: app.options.colorize,
                timestamp: false
            }),
        ]
    });

    // Markdown Parser: enable / disable / use a custom parser.
    if (app.options.markdown === true) {
        markdownParser = new Markdown({
            breaks: false,
            html: true,
            linkify: false,
            typographer: false,
            highlight: function (str, lang) {
                if (lang) {
                    return '<pre class="prettyprint lang-' + lang + '">' + str + '</pre>';
                }
                return '<pre class="prettyprint">' + str + '</code></pre>';
            }
        });
    } else if (app.options.markdown !== false) {
        // Include custom Parser @see MARKDOWN.md and test/fixtures/custom_markdown_parser.js
        if (app.options.markdown.substr(0, 2) !== '..' && ((app.options.markdown.substr(0, 1) !== '/' && app.options.markdown.substr(0, 1) !== '~') || app.options.markdown.substr(0, 1) === '.')) {
            app.options.markdown = path.join(process.cwd(), app.options.markdown);
        }
        Markdown = require(app.options.markdown); // Overwrite default Markdown.
        markdownParser = new Markdown();
    }
    app.markdownParser = markdownParser;

    try {
        packageInfo = new PackageInfo(app);

        // generator information
        const json = JSON.parse(fs.readFileSync(apidocPath + 'package.json', 'utf8'));
        apidoc.setGeneratorInfos({
            name: json.name,
            time: new Date(),
            url: json.homepage,
            version: json.version
        });
        apidoc.setLogger(app.log);
        apidoc.setMarkdownParser(markdownParser);
        apidoc.setPackageInfos(packageInfo.get());

        api = apidoc.parse(app.options);

        if (api === true) {
            app.log.info('Nothing to do.');
            return true;
        }
        if (api === false)
            return false;

        await createOutputFiles(api);

        app.log.info('Done.');
        return api;
    } catch (e) {
        app.log.error(e.message);
        if (e.stack)
            app.log.debug(e.stack);
        return false;
    }
}

/**
 * Save parsed data to files
 *
 * @param {Object[]} blocks
 * @param {Object} packageInfos
 */
const createOutputFiles = async (api) => {
    if (app.options.simulate)
        app.log.warn('!!! Simulation !!! No file or dir will be copied or created.');

    app.log.verbose('create dir: ' + app.options.dest);
    if (!app.options.simulate)
        fs.mkdirsSync(app.options.dest);

    //Write api_data
    app.log.verbose('write json file: ' + app.options.dest + 'api_data.json');
    if (!app.options.simulate && app.options.data)
        fs.writeFileSync(app.options.dest + './api_data.json', api.data + '\n');
    
    // Write api_project
    app.log.verbose('write json file: ' + app.options.dest + 'api_project.json');
    if (!app.options.simulate && app.options.data)
        fs.writeFileSync(app.options.dest + './api_project.json', api.project + '\n');

    // Write api_definitions
    app.log.verbose('write json file: ' + app.options.dest + 'api_definitions.json');
    if (!app.options.simulate && !app.options.copyDefinitions)
        fs.writeFileSync(app.options.dest + './api_definition.json', api.definitions + '\n');

    // Write api_definitions
    app.log.verbose('write md files: ' + app.options.dest);
    if (!app.options.simulate)
        generateMarkdownFiles({ app: app, apiData: api.data, output: app.options.dest, template: app.options.template })
}

module.exports = {
    createDoc: createDoc
};
