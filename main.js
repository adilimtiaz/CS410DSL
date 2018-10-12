const toAstVisitor = require("./ast/ast").toAst
const fs = require("fs");
const path = require("path");
const generators = require("./lib/generators");

let inputText = fs.readFileSync(path.join(__dirname ,'./GrammarSamples/Sample.txt'), 'utf8');

let programAst = toAstVisitor(inputText);

let connectStmtAst = programAst.connectStmtAst;
let setProjectBaseDirStmtAst = programAst.setProjectBaseDirStmtAst;
let createSchemaStatementAst = programAst.createSchemaStmtAst;

let projectBaseDir = setProjectBaseDirStmtAst.path;

let mongoURI = generators.createMongoURI(connectStmtAst.mongoURI, connectStmtAst.dbUsername, connectStmtAst.dbPassword);
generators.generateSampleIndexFile(mongoURI, projectBaseDir);
generators.generatePackageJSONAndReadme(projectBaseDir);

let schemasToCreate = createSchemaStatementAst.schemas;
schemasToCreate.forEach(schema => {
    generators.generateModel(projectBaseDir, schema.schemaName, schema.fields);
});


console.log(JSON.stringify(programAst, null, "\t"));
