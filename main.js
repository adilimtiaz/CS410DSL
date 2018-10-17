const toAstVisitor = require("./ast/ast").toAst;
const fs = require("fs");
const path = require("path");
const generators = require("./lib/generators");
const mongoHandler = require('./lib/mongoHandler');

let inputText = fs.readFileSync(path.join(__dirname ,'./GrammarSamples/Sample.txt'), 'utf8');

let programAst = toAstVisitor(inputText);

let connectStmtAst = programAst.connectStmtAst;
let setProjectBaseDirStmtAst = programAst.setProjectBaseDirStmtAst;
let createSchemaStatementAst = programAst.createSchemaStmtAst;
let insertIntoSchemaStatementAst = programAst.insertIntoSchemaStmtAst;

let projectBaseDir = setProjectBaseDirStmtAst.path;
let projectName = programAst.setProjectNameStmtAst.name;

let mongoURI = generators.createMongoURI(connectStmtAst.mongoURI, connectStmtAst.dbUsername, connectStmtAst.dbPassword);
let schemasToCreate = createSchemaStatementAst.schemas;
let schemaNames = [];
schemasToCreate.forEach(schema => {
    schemaNames.push(schema.schemaName);
});

generators.generateSampleIndexFile(mongoURI, projectBaseDir,projectName,schemaNames);
generators.generatePackageJSONAndReadme(projectBaseDir, projectName);

schemasToCreate.forEach(schema => {
    generators.generateModel(projectBaseDir, projectName, schema.schemaName, schema.fields);
    generators.generateController(projectBaseDir, projectName, schema.schemaName);
    generators.generateRoutes(projectBaseDir,projectName,schema.schemaName);
});

let schemasToInsert = insertIntoSchemaStatementAst.schemas;
schemasToInsert.forEach(schema =>{
    generators.insertIntoSchema(projectBaseDir, projectName, schema.schemaName, schema.fields, mongoURI);
});


console.log(JSON.stringify(programAst, null, "\t"));
