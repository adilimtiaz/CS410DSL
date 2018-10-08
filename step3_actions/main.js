const assert = require("assert")
const toAstVisitor = require("./step3a_actions_visitor").toAst
const fs = require("fs");
const path = require("path");
const generators = require("../lib/generators");

let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/Sample.txt'), 'utf8');

let programAst = toAstVisitor(inputText);

let connectStmtAst = programAst.connectStmtAst;
let setProjectBaseDirStmtAst = programAst.setProjectBaseDirStmtAst;

let mongoURI = generators.createMongoURI(connectStmtAst.mongoURI, connectStmtAst.dbUsername, connectStmtAst.dbPassword);
generators.generateSampleIndexFile(mongoURI, setProjectBaseDirStmtAst.path);

console.log(JSON.stringify(programAst, null, "\t"));
