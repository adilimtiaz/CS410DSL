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
                    "fieldType": "Number"
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
                    "fieldType": "Number"
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
                    "fieldType": "Number"
                },
                {
                    "fieldName": "ProjectNames",
                    "fieldType": "ArrayOfStrings"
                }
             ],
            "schemaName": "CTable"
        };


        let expectSetProjectBaseDirStmtAst = {
            "path": "/Users/adilimtiaz/WebstormProjects/chevrotain/examples/tutorial",
            "type": "SET_PROJECT_BASE_DIR_STMT"
        };

        let expectDefaultProjectNameStmtAst = {
            "name": "myProject",
            "type": "SET_PROJECT_NAME_STMT"
        };

        let expectSetProjectNameStmtAst = {
            "name": "customProjectName",
            "type": "SET_PROJECT_NAME_STMT"
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
                setProjectNameStmtAst: expectDefaultProjectNameStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst
            });
        });

        it("Can create expected ast output for custom Project Name", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/CustomProjectName.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedSchemaStmtJSON1);
            let expectedCreateSchemaStmtAst = {schemas : expectedSchemas, type: "CREATE_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                setProjectNameStmtAst: expectSetProjectNameStmtAst,
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
                setProjectNameStmtAst: expectDefaultProjectNameStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst
            });
        })

    })
});
