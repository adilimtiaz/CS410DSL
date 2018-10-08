const assert = require("assert")
const toAstVisitor = require("./step3a_actions_visitor").toAst
const fs = require("fs");
const path = require("path");
const generators = require("../lib/generators");

let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/Sample.txt'), 'utf8');

let astFromVisitor = toAstVisitor(inputText);

let connectStatementAst = astFromVisitor.connectStatement;

let mongoURI = generators.createMongoURI(connectStatementAst.mongoURI, connectStatementAst.dbUsername, connectStatementAst.dbPassword);
generators.generateSampleIndexFile(mongoURI);

console.log(JSON.stringify(astFromVisitor, null, "\t"));
