"use strict";
const expect = require("chai").expect;
const _ = require("lodash");
const toAstVisitor = require("./ast").toAst;
const fs = require("fs");
const path = require("path");

describe("AST output tests", () => {
    context("AST", () => {
        let expectedConnectStmtAst = {
            "dbPassword": "password123",
            "dbUsername": "adilimtiaz",
            "mongoURI": "ds111963.mlab.com:11963/emaily-dev",
            "type": "CONNECT_STMT"
        };

        let expectedSchemaStmtJSON1 = {
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
            "schemaName": "ATable"
        };

        let expectedSchemaStmtJSON2 = {
            "fields": [
                {
                    "fieldName": "ID",
                    "fieldType": "Integer"
                },
                {
                    "fieldName": "ProjectName",
                    "fieldType": "String"
                }
             ],
            "schemaName": "BTable"
        };

        let expectedSchemaStmtJSON3 = {
            "fields": [
                {
                    "fieldName": "Number",
                    "fieldType": "Integer"
                },
                {
                    "fieldName": "ProjectName",
                    "fieldType": "String"
                }
             ],
            "schemaName": "CTable"
        };


        let expectSetProjectBaseDirStmtAst = {
            "path": "/Users/adilimtiaz/WebstormProjects/chevrotain/examples/tutorial",
            "type": "SET_PROJECT_BASE_DIR_STMT"
        };

        it("Can create expected ast output from JustOneCreateSchemaStmt.txt", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/JustOneCreateSchemaStmt.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedSchemaStmtJSON1);
            let expectedCreateSchemaStmtAst = {schemas : expectedSchemas, type: "CREATE_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst
            });
        });

        it("Can create expected ast output for multiple createSchemaStatements", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/sample.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedSchemaStmtJSON1, expectedSchemaStmtJSON2, expectedSchemaStmtJSON3);
            let expectedCreateSchemaStmtAst = {schemas : expectedSchemas, type: "CREATE_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst
            });
        })

    })
});
