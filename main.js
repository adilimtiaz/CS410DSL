const toAstVisitor = require("./ast/ast").toAst
const fs = require("fs");
const path = require("path");
const generators = require("./lib/generators");

let inputText = fs.readFileSync(path.join(__dirname ,'./GrammarSamples/Sample.txt'), 'utf8');

let programAst = toAstVisitor(inputText);
//console.log(programAst);
let connectStmtAst = programAst.connectStmtAst;
let setProjectBaseDirStmtAst = programAst.setProjectBaseDirStmtAst;
// let createSchemaStatementAst = programAst.createSchemaStmtAst;
let statements = programAst.statementAst.statements;
let projectBaseDir = setProjectBaseDirStmtAst.path;
let projectName = (programAst.setProjectNameStmtAst && programAst.setProjectNameStmtAstname) || "myProject";

let mongoURI = generators.createMongoURI(connectStmtAst.mongoURI, connectStmtAst.dbUsername, connectStmtAst.dbPassword);
// let schemasToCreate = createSchemaStatementAst.schemas;
let schemaNames = [];
statements.forEach(statement => {
    // console.dir(statement);
    if (statement.statementType === "createSchemaStatement"){

        let schema = statement.parameters;
        console.dir(schema);
        schemaNames.push(schema.schemaName);
        generators.generateModel(projectBaseDir, projectName, schema.schemaName, schema.fields);
        generators.generateController(projectBaseDir, projectName, schema.schemaName);
        generators.generateRoutes(projectBaseDir,projectName,schema.schemaName);
    }
});

// let schemaNames = [];
// schemasToCreate.forEach(schema => {
//     schemaNames.push(schema.schemaName);
// });

generators.generateSampleIndexFile(mongoURI, projectBaseDir,projectName,schemaNames);
generators.generatePackageJSONAndReadme(projectBaseDir, projectName);

// schemasToCreate.forEach(schema => {

//     generators.generateModel(projectBaseDir, projectName, schema.schemaName, schema.fields);
//     generators.generateController(projectBaseDir, projectName, schema.schemaName);
//     generators.generateRoutes(projectBaseDir,projectName,schema.schemaName);

// });

//TODO: Add Insert Statements
// for each insert statement: insertIntoSchema

console.log(JSON.stringify(programAst, null, "\t"));
