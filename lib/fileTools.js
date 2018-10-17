const fs = require("fs");
const path = require("path");


/**
 * Create a directory if not defined
 * @param {string} dirPath directory path parent
 * @param {string} dirName directory name to find
 */
function createDirIfIsNotDefined(dirPath, dirName) {
    if(!fs.existsSync(dirPath)){
        throw new Error("Directory specified to create sample project in does not exist: " + dirPath);
    }

    if (!fs.existsSync(dirPath + '/' + dirName)){
        fs.mkdirSync(dirPath + '/' + dirName);
    }
}

/**
 * Write a file
 * @param {string} path file path to write
 * @param {string} contents file contents to write
 */
function writeFile(path, contents) {
    fs.writeFileSync(path, contents, function (err) {
        if (err) { throw err; }
        //console.info(cliStyles.cyan + '\tcreate' + cliStyles.reset + ': ' + path);
    });
}

/**
 * Load a template
 * @param {string} name template name
 * @returns {string} template contents
 */
function loadTemplateSync(name) {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf8');
}

module.exports = {
    createDirIfIsNotDefined: createDirIfIsNotDefined,
    writeFile: writeFile,
    loadTemplateSync: loadTemplateSync
};
