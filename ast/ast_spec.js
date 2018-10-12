"use strict";
const expect = require("chai").expect;
const _ = require("lodash");
const toAstVisitor = require("./ast").toAst;
const fs = require("fs");
const path = require("path");

let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/Sample.txt'), 'utf8');
const ast = toAstVisitor(inputText);

describe("AST output tests", () => {
    context("AST", () => {
        it("Can create expected ast output from sample.txt", () => {
            let expectedConnectStmtAst = {
                "dbPassword": "password123",
                "dbUsername": "adilimtiaz",
                "mongoURI": "ds111963.mlab.com:11963/emaily-dev",
                "type": "CONNECT_STMT"
            };

            let expectedCreateSchemaStatementAst = {
                "fields": [
                    {
                        "fieldName": "ID",
                        "fieldType": "Integer"
                    },
                    {
                        "fieldName": "StudentName",
                        "fieldType": "String"
                    }
                ],
                "tableName": "ATable",
                "type": "CREATE_SCHEMA_STMT"
            };

           let expectSetProjectBaseDirStmtAst = {
                "path": "/Users/adilimtiaz/WebstormProjects/chevrotain/examples/tutorial",
                "type": "SET_PROJECT_BASE_DIR_STMT"
            };

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStatementAst
            });
        })
    })
});
