const toAstVisitor = require("./ast/ast").toAst
const fs = require("fs");
const path = require("path");
const generators = require("./lib/generators");

let inputText = fs.readFileSync(path.join(__dirname ,'./GrammarSamples/Sample.txt'), 'utf8');

let programAst = toAstVisitor(inputText);

console.log(programAst);
let connectStmtAst = programAst.connectStmtAst;
let setProjectBaseDirStmtAst = programAst.setProjectBaseDirStmtAst;
let createSchemaStatementAst = programAst.createSchemaStmtAst;


let projectBaseDir = setProjectBaseDirStmtAst.path;

//TODO: Add projectName
let projectName = "myProject";

let mongoURI = generators.createMongoURI(connectStmtAst.mongoURI, connectStmtAst.dbUsername, connectStmtAst.dbPassword);
//generators.generateSampleIndexFile(mongoURI, projectBaseDir);


let schemasToCreate = createSchemaStatementAst.schemas;


generators.generatePackageJSONAndReadme(projectBaseDir);
let schemaNames = [];
schemasToCreate.forEach(schema => {
    schemaNames.push(schema.schemaName);
    generators.generateModel(projectBaseDir, projectName, schema.schemaName, schema.fields);
    generators.generateController(projectBaseDir, projectName, schema.schemaName);
    generators.generateRoutes(projectBaseDir,projectName,schema.schemaName);

});
generators.generateIndexFile(projectBaseDir,projectName,schemaNames,mongoURI);

//TODO: Add Insert Statements
// for each insert statement: insertIntoSchema

console.log(JSON.stringify(programAst, null, "\t"));
