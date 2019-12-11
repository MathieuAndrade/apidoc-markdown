const _    = require('lodash');
const fs   = require('fs');
const path = require('path');

let app = {};

function PackageInfo(_app) {
    // global variables
    app = _app;
}

/**
 * Exports
 */
module.exports = PackageInfo;

/**
 * Read apidoc.json / package.json data
 */
PackageInfo.prototype.get = function() {
    let result = {};

    // Read package.json
    const packageJson = this._readPackageData('package.json');

    if (packageJson.apidoc)
        result = packageJson.apidoc;

    result = _.defaults({}, result, {
        name       : packageJson.name        || '',
        version    : packageJson.version     || '0.0.0',
        description: packageJson.description || '',
    });

    // read apidoc.json (and overwrite package.json information)
    const apidocJson = this._readPackageData('apidoc.json');

    // apidoc.json has higher priority
    _.extend(result, apidocJson);

    // options.packageInfo overwrites packageInfo
    _.extend(result, app.options.packageInfo);

    // replace header footer with file contents
    _.extend(result, this._getHeaderFooter(result));

    if (Object.keys(apidocJson).length === 0 && ! packageJson.apidoc)
        app.log.warn('Please create an apidoc.json configuration file.');

    return result;
};

/**
 * Read json data from source dir, or if it not exists from current dir.
 * Return the data merged with the default values.
 *
 * @param {String} filename
 * @param {Object} defaults
 * @returns {Object}
 */
PackageInfo.prototype._readPackageData = function(filename) {
    let result = {};
    const dir = this._resolveSrcPath();
    let jsonFilename = path.join(dir, filename);

    // Read from source dir
    if ( ! fs.existsSync(jsonFilename)) {
        // Read from config dir (default './')
        jsonFilename = path.join(app.options.config, filename);
    }
    if ( ! fs.existsSync(jsonFilename)) {
        app.log.debug(jsonFilename + ' not found!');
    } else {
        try {
            result = JSON.parse( fs.readFileSync(jsonFilename, 'utf8') );
            app.log.debug('read: ' + jsonFilename);
        } catch (e) {
            throw new Error('Can not read: ' + filename + ', please check the format (e.g. missing comma).');
        }
    }
    return result;
};

/**
 * Get json.header / json.footer title and markdown content (from file)
 *
 * @param {Object} json
 * @returns {Object}
 */
PackageInfo.prototype._getHeaderFooter = function(json) {
    let result = {};
    const self = this;

    ['header', 'footer'].forEach(function(key) {
        if (json[key] && json[key].filename) {

            const dir = self._resolveSrcPath();
            let filename = path.join(dir, json[key].filename);

            if ( ! fs.existsSync(filename))
                filename = path.join('./', json[key].filename);

            try {
                app.log.debug('read header file: ' + filename);
                const content = fs.readFileSync(filename, 'utf8');
                result[key] = {
                    title  : json[key].title,
                    content: app.markdownParser ? app.markdownParser.render(content) : content
                };
            } catch (e) {
                throw new Error('Can not read: ' + filename + '.');
            }
        }
    });

    return result;
};

/**
 * Resolve source path.
 *
 * If multiple input dirs are given, the current workdir './' will be returned.
 * On one input dir, the current workdir will be the input dir.
 *
 * @returns {string}
 * @private
 */
PackageInfo.prototype._resolveSrcPath = function() {
    let dir = './';

    if (app.options.src instanceof Array) {
        if (app.options.src.length === 1) {
            dir = app.options.src[0];
        }
    } else {
        if (app.options.src) {
            dir = app.options.src;
        }
    }

    return dir;
};
