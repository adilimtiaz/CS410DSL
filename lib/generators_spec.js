const fs = require('fs');
const path = require('path');
const os = require('os');
const BASE_PATH = "/Users/adilimtiaz/WebstormProjects/chevrotain/examples/tutorial";

const {generateController,generateIndexFile,generateRoutes,generateModel, generatePackageJSONAndReadme} = require('./generators');

// Testing Index File generator
const expressTemplate = require('../templates/expressTemplate');

function createMongoURI(mongoURI, dbUsername, dbPassword) {
    return "mongodb://" + dbUsername + ":" + dbPassword + "@" + mongoURI;
}
let mongoURI = createMongoURI("ds111963.mlab.com:11963/emaily-dev","adilimtiaz", "password123");
// console.log(expressTemplate(mongoURI, ["Cat", "Dog"]))
generateIndexFile(BASE_PATH, "MyAnimals", ["Cat", "Dog"], mongoURI); // works

const controllerTemplate = require('../templates/controllerTemplate');
console.log(controllerTemplate("TestModel"))
// const generateController = (projectBasePath, projectName, modelName) => {
//     if (!projectName | !modelName) throw new Error(`Missing ${!projectName | !modelName} in generateController`);
//     let controllerFileText = controllerTemplate(modelName);
//     let pathToWrite = path.join(projectBasePath, `./${projectName}/controllers/${modelName}.js`);
//     createDirIfIsNotDefined(projectBasePath, `${projectName}/controllers/`);
//     writeFile(pathToWrite, controllerFileText);
// };

generateController(BASE_PATH,"MyAnimals","Cat"); // works
generateController(BASE_PATH,"MyAnimals","Dog");

// Test Routes generator:
const routerTemplate = require('../templates/routerTemplate');

// const generateRoutes = (projectBasePath, projectName, controllerName) => {
//     if (!projectName | !controllerName) throw new Error(`Missing ${!projectName | !controllerName} in generateRoutes`);
//     let routesFileText = routerTemplate(controllerName);
//     let pathToWrite = path.join(projectBasePath, `./${projectName}/routes/${controllerName}.js`);
//     createDirIfIsNotDefined(projectBasePath, `${projectName}/routes/`);
//     writeFile(pathToWrite, routesFileText);
// };
// console.log(routerTemplate("Dog"))
generateRoutes(BASE_PATH,"MyAnimals","Cat") // works
generateRoutes(BASE_PATH,"MyAnimals","Dog")


// Testing generateModel
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
const modelTemplate = require('../templates/modelTemplate');
// function generateModel(projectBasePath, projectName, schemaName, schemaFields) {
//     let fieldsText = getFieldsForModelTemplate(schemaFields);
//     // console.log(fieldsText)
//     let fileName = schemaName + 'Schema'; //carSchema

//     let modelFileText = modelTemplate(schemaName,fieldsText);

//     let pathToWrite = path.join(projectBasePath, `./${projectName}/models/${fileName}.js`);

//     createDirIfIsNotDefined(projectBasePath, `./${projectName}/models`);
//     writeFile(pathToWrite, modelFileText);
// }
// console.log(modelTemplate("Cat",{name: "String", age: "Number"}))
let schemaFieldsDog = [{fieldName: "name", fieldType: "String"}, {fieldName: "age", fieldType: "Number"},{fieldName:"breed",fieldType: "Number"}];
let schemaFieldsCat = [{fieldName: "name", fieldType: "String"}, {fieldName: "age", fieldType: "Number"}];

generateModel(BASE_PATH,"MyAnimals","Dog",schemaFieldsDog); //works
generateModel(BASE_PATH,"MyAnimals","Cat",schemaFieldsCat);

function getFieldsForModelTemplate(fields) {
    let schemaFieldsLength = fields.length - 1;
    let modelFIleFields = '{' + os.EOL;

    fields.forEach(function(field, index) {
        if(!allowedFieldsTypes[field.fieldType]){
            throw new Error("Field with fieldName: " + field.fieldName + " has invalid field type");
        }
        modelFIleFields += `\t ${field.fieldName}: ${allowedFieldsTypes[field.fieldType]}`;
        modelFIleFields += (schemaFieldsLength > index) ? ',' + os.EOL : os.EOL;

        /**
        if (field.reference) {
            modelFIleFields = modelFIleFields.replace(/{ref}/, field.reference);
        }
         */
    });
    modelFIleFields += '\t}';

    return modelFIleFields;
}


generatePackageJSONAndReadme(BASE_PATH,"MyAnimals");

function writeFile(path, contents) {
    fs.writeFile(path, contents, function (err) {
        if (err) { throw err; }
        //console.info(cliStyles.cyan + '\tcreate' + cliStyles.reset + ': ' + path);
    });
}

function createDirIfIsNotDefined(dirPath, dirName) {
    if (!fs.existsSync(dirPath)) {
        throw new Error("Directory specified to create sample project in does not exist: " + dirPath);
    }

    if (!fs.existsSync(dirPath + '/' + dirName)) {
        fs.mkdirSync(dirPath + '/' + dirName);
    }
};
