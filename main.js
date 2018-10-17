const toAstVisitor = require("./ast/ast").toAst
const fs = require("fs");
const path = require("path");
const generators = require("./lib/generators");
const fileTools = require('./lib/fileTools');
const mongoHandler = require('./lib/mongoHandler');
let inputText = fs.readFileSync(path.join(__dirname, './GrammarSamples/Sample.txt'), 'utf8');

let programAst = toAstVisitor(inputText);
//console.log(programAst);
let connectStmtAst = programAst.connectStmtAst;
let setProjectBaseDirStmtAst = programAst.setProjectBaseDirStmtAst;
// let createSchemaStatementAst = programAst.createSchemaStmtAst;
let statements = programAst.statementAst.statements;
let projectBaseDir = setProjectBaseDirStmtAst.path;
let projectName = (programAst.setProjectNameStmtAst && programAst.setProjectNameStmtAstname) || "myProject";
fileTools.createDirIfIsNotDefined(projectBaseDir, projectName);
let mongoURI = generators.createMongoURI(connectStmtAst.mongoURI, connectStmtAst.dbUsername, connectStmtAst.dbPassword);
// let schemasToCreate = createSchemaStatementAst.schemas;
let schemaNames = [];
let createSchemas = [];
let insertStatements = [];
statements.forEach(statement => {
    // console.dir(statement);
    if (statement.statementType === "createSchemaStatement") {
        createSchemas.push(statement);

        // console.log(`/Users/Kushal K/Documents/cpsc 410/myProject/models/ATableSchema.js`);



    }
    else if (statement.statementType === "insertStatement") {
        insertStatements.push(statement);
        // let tableName = statement.parameters.tableName;
        // let rows = statement.parameters.rows;
        // if (rows && rows.length) {
        //     rows.forEach(row => {
        //         let insertObj = {};
        //         row.values.forEach(field => {
        //             insertObj[field.fieldName] = field.fieldValue;
        //         });
        //         console.log("tableName", tableName);


        //         mongoHandler.insertIntoSchema(projectBaseDir, projectName, tableName, insertObj, mongoURI);
        //     });
        // }
    }
});
// const model = require(`C:/Users/Kushal K/Documents/cpsc 410/myProject/models/ATableSchema.js`);
// let schemaNames = [];
createSchemas.forEach(statement => {
    let schema = statement.parameters;
    // console.dir(schema);
    schemaNames.push(schema.schemaName);
    generators.generateModel(projectBaseDir, projectName, schema.schemaName, schema.fields);
    generators.generateController(projectBaseDir, projectName, schema.schemaName);
    generators.generateRoutes(projectBaseDir, projectName, schema.schemaName);
});

// console.log("ModelName ",model.modelName);
insertStatements.forEach(statement => {
    console.dir(statement);
    let tableName = statement.parameters.tableName;
    let rows = statement.parameters.rows;
    if (rows && rows.length) {
        rows.forEach(row => {
            let insertObj = {};
            row.values.forEach(field => {
                insertObj[field.fieldName] = field.fieldValue;
            });
            console.log("tableName", tableName);
            let modelRequireString = `${projectBaseDir}/${projectName}/models/${tableName}Schema.js`;
            console.log(`${projectBaseDir}/${projectName}/models/${tableName}Schema.js`);
            const model = require(modelRequireString);
            
            console.log("model",model);
            // mongoHandler.insertIntoSchema(model, insertObj, mongoURI, (result) => {
            //     console.log(result);
            // });
        });
    }
})

generators.generateSampleIndexFile(mongoURI, projectBaseDir,projectName,schemaNames);
generators.generatePackageJSONAndReadme(projectBaseDir, projectName);
// const model = require(`/Users/Kushal K/Documents/cpsc 410/myProject/models/ATableSchema`);
// console.dir(model);
// schemasToCreate.forEach(schema => {

//     generators.generateModel(projectBaseDir, projectName, schema.schemaName, schema.fields);
//     generators.generateController(projectBaseDir, projectName, schema.schemaName);
//     generators.generateRoutes(projectBaseDir,projectName,schema.schemaName);

// });

//TODO: Add Insert Statements
// for each insert statement: insertIntoSchema

// console.log(JSON.stringify(programAst, null, "\t"));
