const fs = require("fs");
const path = require("path");
const fileTools = require("./fileTools");

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
 * Generate a sample index file at projectBasePath/index.js
 * @param {string} mongoURI
 * @param {string} projectBasePath
 */
function generateSampleIndexFile(mongoURI, projectBasePath) {
    let indexFileText = fileTools.loadTemplateSync('indexTemplate.js');
    indexFileText = indexFileText.replace(/{mongoURI}/, JSON.stringify(mongoURI));
    let pathToWrite = path.join(projectBasePath, "./SampleBaseProject/index.js");

    fileTools.createDirIfIsNotDefined(projectBasePath, "SampleBaseProject"); //Hard coded to write to this path for now
    fileTools.writeFile(pathToWrite, indexFileText);
}



module.exports = {
    createMongoURI: createMongoURI,
    generateSampleIndexFile: generateSampleIndexFile
};
