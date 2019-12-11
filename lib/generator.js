const path = require('path')
const fs = require('fs').promises
const ejs = require('ejs')
const semver = require('semver')
const templateUtils = require('./templateUtils')

const unique = (arr) => [...new Set(arr)];

const getCompiler = async ({ app, template, data }) => {

    let ejsCompiler;
    let apiByGroupAndName;

    try {
        // Define template
        ejsCompiler = ejs.compile((await fs.readFile(template)).toString());
        const apiData = JSON.parse(data).filter((x) => x.type);

        // Group apiDoc data by group and name
        apiByGroupAndName = unique(Object.values(apiData).map(x => x.group))
            .reduce((acc, cur) => {
                if (apiData.find(x => x.group === cur))
                    acc.push({ name: cur, subs: [] });
                return acc;
            }, [])
            .map((g) => {
                apiData.forEach(x => x.group === g.name && g.subs.push(x));
                return g;
            })
            .map((g) => {
                g.subs = Object.values(g.subs.reduce((acc, cur) => {
                    if (!acc[cur.name] || semver.gt(cur.version, acc[cur.name].version))
                        acc[cur.name] = cur;
                    return acc;
                }, {}));
                return g;
            });
    } catch (e) {
        app.log.error(e.message);
        if (e.stack)
            app.log.debug(e.stack);
        return false;
    }

    return apiByGroupAndName.map(x => ({
        name: x.name,
        content: ejsCompiler({ ...templateUtils, data: [x] })
    }))
}

const generateMarkdownFiles = async ({ app, apiData, output, template }) => {

    try {
        const docs = await getCompiler({app: app, template: template, data: apiData });

        return Promise.all(docs.map(aDoc => {
            const filePath = path.resolve(output, `${aDoc.name}.md`)
            return fs.writeFile(filePath, aDoc.content)
                .then(() => ({ outputFile: filePath, content: aDoc.content }))
                .catch((e) => {
                    app.log.error(e.message);
                    if (e.stack)
                        app.log.debug(e.stack);
                    return false;
                })
        }))
    } catch (e) {
        app.log.error(e.message);
        if (e.stack)
            app.log.debug(e.stack);
        return false;
    }

}

module.exports = generateMarkdownFiles
