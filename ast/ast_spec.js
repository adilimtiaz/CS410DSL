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

        let expectedCreateSchemaStmtJSON1 = {
            "fields": [
                {
                    "fieldName": "StudentNo",
                    "fieldType": "Number"
                },
                {
                    "fieldName": "Email",
                    "fieldType": "String"
                }
            ],
            "schemaName": "SampleTestTable"
        };

        let expectedCreateSchemaStmtJSON2 = {
            "fields": [
                {
                    "fieldName": "StudentNo",
                    "fieldType": "Number"
                },
                {
                    "fieldName": "LetterGrade",
                    "fieldType": "String"
                }
             ],
            "schemaName": "SampleTestTable2"
        };

        let expectedCreateSchemaStmtJSON3 = {
            "fields": [
                {
                    "fieldName": "StudentNo",
                    "fieldType": "Number"
                },
                {
                    "fieldName": "Courses",
                    "fieldType": "ArrayOfStrings"
                }
             ],
            "schemaName": "SampleTestTable3"
        };

        let expectedInsertIntoSchemaStmtJSON = {
            "fields": [
                {
                    "fieldName": "StudentNo",
                    "fieldType": "3903"
                },
                {
                    "fieldName": "Email",
                    "fieldType": "email@email.com"
                }
            ],
            "schemaName": "SampleTestTable"
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
            "name": "myProject",
            "type": "SET_PROJECT_NAME_STMT"
        };

        let expectedEmptyInsertSchemaStmtAst = {
                "schemas": [],
                "type": "INSERT_SCHEMA_STMT"
        };

        let expectedEmptyCreateSchemaStmtAst = {
            "schemas": [],
            "type": "CREATE_SCHEMA_STMT"
        };


        it("Can create expected ast output from JustOneCreateSchemaStmt.txt", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/JustOneCreateSchemaStmt.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedCreateSchemaStmtJSON1);
            let expectedCreateSchemaStmtAst = {schemas : expectedSchemas, type: "CREATE_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                setProjectNameStmtAst: expectDefaultProjectNameStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst,
                insertIntoSchemaStmtAst: expectedEmptyInsertSchemaStmtAst
            });
        });

        it("Can create expected ast output for custom Project Name", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/CustomProjectName.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedCreateSchemaStmtJSON1);
            let expectedCreateSchemaStmtAst = {schemas : expectedSchemas, type: "CREATE_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                setProjectNameStmtAst: expectSetProjectNameStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst,
                insertIntoSchemaStmtAst: expectedEmptyInsertSchemaStmtAst
            });
        });

        it("Can create expected ast output for multiple createSchemaStatements", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/sample.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedCreateSchemaStmtJSON1, expectedCreateSchemaStmtJSON2, expectedCreateSchemaStmtJSON3);
            let expectedCreateSchemaStmtAst = {schemas : expectedSchemas, type: "CREATE_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                setProjectNameStmtAst: expectDefaultProjectNameStmtAst,
                createSchemaStmtAst: expectedCreateSchemaStmtAst,
                insertIntoSchemaStmtAst: expectedEmptyInsertSchemaStmtAst
            });
        });

        it("Can create expected ast output for multiple insertIntoSchemaStatements", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/SampleWithOnlyInsertNoCreate.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedSchemas = [];
            expectedSchemas.push(expectedInsertIntoSchemaStmtJSON);
            let insertIntoSchemaStmtAst = {schemas : expectedSchemas, type: "INSERT_SCHEMA_STMT"};

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStmtAst: expectedConnectStmtAst,
                setProjectBaseDirStmtAst: expectSetProjectBaseDirStmtAst,
                setProjectNameStmtAst: expectDefaultProjectNameStmtAst,
                createSchemaStmtAst: expectedEmptyCreateSchemaStmtAst,
                insertIntoSchemaStmtAst: insertIntoSchemaStmtAst
            });
        })

    })
});
