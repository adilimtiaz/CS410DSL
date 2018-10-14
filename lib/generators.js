const fs = require("fs");
const path = require("path");
const os = require("os");
const fileTools = require("./fileTools");

const allowedFieldsTypes = {
    'String'  : "String",
    'Number'  : "Number",
    'Date'    : "Date",
    'Boolean' : "Boolean",
    'ArrayOfStrings' : "[String]",
    'ArrayOfNumbers' : "[Number]",
    'ArrayOfBooleans' : "[Boolean]",
    'ArrayOfDates' : "[Date]"
};

let $ = this;

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
function generateSampleIndexFile(mongoURI, projectBasePath, projectName) {
    let indexFileText = fileTools.loadTemplateSync('indexTemplate.js');
    indexFileText = indexFileText.replace(/{mongoURI}/, JSON.stringify(mongoURI));
    let pathToWrite = path.join(projectBasePath, "./" + projectName + "/index.js");

    fileTools.createDirIfIsNotDefined(projectBasePath, projectName); //Hard coded to write to this path for now
    fileTools.writeFile(pathToWrite, indexFileText);
}

/**
 * Generate a Mongoose model file at SampleProjectBase/Models/SchemaName.js
 * @param {string} Path to generate model files at
 * @param {string} schemaName
 * @param {array} schemaFields
 */
function generateModel(projectBasePath, projectName, schemaName, schemaFields) {
    let fieldsText = getFieldsForModelTemplate(schemaFields);
    let fileName = schemaName + 'Schema'; //carSchema

    let modelFileText = fileTools.loadTemplateSync('model.js');
    modelFileText = modelFileText.replace(/{modelName}/, schemaName);
    modelFileText = modelFileText.replace(/{schemaName}/g, schemaName);
    modelFileText = modelFileText.replace(/{fields}/, fieldsText);

    let pathToWrite = path.join(projectBasePath, './' + projectName + '/models/' + fileName + '.js');

    fileTools.createDirIfIsNotDefined(projectBasePath, './' + projectName + '/models');
    fileTools.writeFile(pathToWrite, modelFileText);
}

/**
 * Generate a package.json file at SampleProjectBase/package.json
 * Generate a README.md file at SampleProjectBase/README.md
 * @param {string} Base Project Path
 */
function generatePackageJSONAndReadme(projectBasePath, projectName) {
    let packageFileText = fileTools.loadTemplateSync('package.json');
    let readmeFIleText = fileTools.loadTemplateSync('README.md');
    let pathToWrite = path.join(projectBasePath, './' + projectName + '/package.json');
    let readmePath = path.join(projectBasePath, './' + projectName + '/README.md');

    fileTools.createDirIfIsNotDefined(projectBasePath, './' + projectName + '');
    fileTools.writeFile(pathToWrite, packageFileText);
    fileTools.writeFile(readmePath, readmeFIleText);
}

/**
 * Format the fields for the model template
 * @param {array} schema fields input
 * @returns {string} formatted fields
 */
function getFieldsForModelTemplate(fields) {
    let schemaFieldsLength = fields.length - 1;
    let modelFIleFields = '{' + os.EOL;

    fields.forEach(function(field, index) {
        if(!allowedFieldsTypes[field.fieldType]){
            throw new Error("Field with fieldName: " + field.fieldName + " has invalid field type");
        }
        modelFIleFields += '\t\'' + field.fieldName + '\' : ' +  allowedFieldsTypes[field.fieldType];
        modelFIleFields += (schemaFieldsLength > index) ? ',' + os.EOL : os.EOL;

        /**
        if (field.reference) {
            modelFIleFields = modelFIleFields.replace(/{ref}/, field.reference);
        }
         */
    });
    modelFIleFields += '}';

    return modelFIleFields;
}



module.exports = {
    createMongoURI: createMongoURI,
    generateSampleIndexFile: generateSampleIndexFile,
    generateModel: generateModel,
    generatePackageJSONAndReadme: generatePackageJSONAndReadme
};
