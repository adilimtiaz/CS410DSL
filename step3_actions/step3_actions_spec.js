"use strict"
const expect = require("chai").expect;
const _ = require("lodash");
const toAstVisitor = require("./step3a_actions_visitor").toAst;
const fs = require("fs");
const path = require("path");

describe("Chevrotain Tutorial", () => {
    context("Step 3a - Actions (semantics) using CST Visitor", () => {
        it("Can convert a Program with a connect Statement to an AST", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/Sample.txt'), 'utf8');
            const ast = toAstVisitor(inputText);

            let expectedConnectStatementAst = {
                "dbPassword": "\"password123\"",
                "dbUsername": "\"adilimtiaz\"",
                "mongoURI": "\"ds111963.mlab.com:11963/emaily-dev\"",
                "type": "CONNECT_STMT"
            };

            let expectedSchemaStatementAst = {
                "attr_Type_Clause": {
                    "attribute": "\"ID\"",
                    "attributeType": "\"Integer\"",
                    "type": "ENTRY_CLAUSE"
                },
                "nameClause": {
                    "Table_Name": "\"ATable\"",
                    "type": "NAME_CLAUSE"
                },
                "type": "SCHEMA_STMT"
            }

            expect(ast).to.deep.equal({
                type: "PROGRAM",
                connectStatement: expectedConnectStatementAst,
                schemaStatement: expectedSchemaStatementAst

            });
        })
    })
});
