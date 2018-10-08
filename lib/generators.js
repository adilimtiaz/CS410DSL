const fs = require("fs");
const path = require("path");

/**
 * Create a MongoURI
 * @param {string} MongoURI
 * @param {string} dbUsername
 * @param {string} dbPassword
 */

function createMongoURI(mongoURI, dbUsername, dbPassword) {
    return "mongodb://" + dbUsername + ":" + dbPassword + "@" + mongoURI;
}

/**
 * Generate a sample index file
 * @param {string} mongoURI
 */
function generateSampleIndexFile(mongoURI) {
    let indexFileText = loadTemplateSync('indexTemplate.js');
    indexFileText = indexFileText.replace(/{mongoURI}/, JSON.stringify(mongoURI));
    let pathToWrite = path.join(__dirname, "../index.js");

    writeFile(pathToWrite, indexFileText);
}

/**
 * Write a file
 * @param {string} path file path to write
 * @param {string} contents file contents to write
 */
function writeFile(path, contents) {
    fs.writeFile(path, contents, function (err) {
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
    createMongoURI: createMongoURI,
    generateSampleIndexFile: generateSampleIndexFile
};
