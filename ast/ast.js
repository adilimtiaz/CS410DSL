"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3a_adding_actions_separated.md

// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

const lexer = require("../lexer/lexer");
// re-using the parser implemented in step two.
const parser = require("../parser/parser");
const Parser = parser.Parser;
const util = require("util");

// A new parser instance with CST output (enabled by default).
const parserInstance = new Parser([]);
// The base visitor class can be accessed via the a parser instance.
const BaseDSLVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults();

class DSLToAstVisitor extends BaseDSLVisitor {
    constructor() {
        super();
        this.validateVisitor();
    };

    Program(ctx){
        // No need to visit start or end ast they are only used to validate program syntax
        let connectStmtAst = this.visit(ctx.connectStatement);
        let setProjectBaseDirStmtAst = this.visit(ctx.setProjectBaseDirStmt);
        let statements = [];
        ctx.statement.forEach((stmt) => {
            const stmtContent = this.statement(stmt.children);
            statements.push(stmtContent);
        });
        let statementAst = {type: "STATEMENT", statements: statements};

        return {
            type: "PROGRAM",
            connectStmtAst: connectStmtAst,
            setProjectBaseDirStmtAst: setProjectBaseDirStmtAst,
            statementAst: statementAst
        }
    }

    statement(ctx){
        let statementType = "";
        let parameters = null;

        if (ctx.hasOwnProperty("createSchemaStatement")) {
            statementType = ctx.createSchemaStatement[0].name;
            parameters = this.createSchemaStatement(ctx.createSchemaStatement[0].children);
        } else if (ctx.hasOwnProperty("insertStatement")) {
            statementType = ctx.insertStatement[0].name;
            parameters = this.insertStatement(ctx.insertStatement[0].children);
        } else if (ctx.hasOwnProperty("updateStatement")) {
            statementType = ctx.updateStatement[0].name;
            parameters = this.updateStatement(ctx.updateStatement[0].children);
        } else if (ctx.hasOwnProperty("deleteStatement")) {
            statementType = ctx.deleteStatement[0].name;
            parameters = this.deleteStatement(ctx.deleteStatement[0].children);
        }

        return {
            statementType: statementType,
            parameters: parameters
        }
    }

    setProjectBaseDirStmt(ctx){
        let path;
        if(ctx.UnixPath){
            path = ctx.UnixPath[0].image;
        }
        else
            path = ctx.WindowsPath[0].image;

        return {
            type: "SET_PROJECT_BASE_DIR_STMT",
            path: JSON.parse(path)
        }
    }

    connectStatement(ctx) {
        let MongoURI = ctx.MongoURI[0].image;
        let dbUsername = ctx.StringLiteral[0].image; //First string is username
        let dbPassword = ctx.StringLiteral[1].image; //second is password

        return {
            type: "CONNECT_STMT",
            mongoURI: JSON.parse(MongoURI),
            dbUsername: JSON.parse(dbUsername),
            dbPassword: JSON.parse(dbPassword)
        }
    }

    createSchemaStatement(ctx) {
        let schemaName = JSON.parse(this.visit(ctx.nameClause));
        let fields = [];
        ctx.fieldClause.forEach((field) => {
            let fieldAst = this.fieldClause(field.children);
            fields.push(fieldAst);
        });

        return {
            schemaName: schemaName,
            fields: fields
        }
    }

    insertStatement(ctx) {
        let tableName = JSON.parse(this.visit(ctx.tableNameClause));
        let rows = [];
        ctx.rowClause.forEach((row) => {
            let rowAst = this.rowClause(row.children);
            rows.push(rowAst);
        });

        return {
            tableName: tableName,
            rows: rows
        }
    }

    updateStatement(ctx) {
        let tableName = JSON.parse(this.visit(ctx.tableNameClause));
        let conditions = [];
        ctx.conditionClause.forEach((condition) => {
            let conditionsAst = this.valueClause(condition.children);
            conditions.push(conditionsAst);
        });
        let values = [];
        ctx.valueClause.forEach((value) => {
            let valuesAst = this.valueClause(value.children);
            values.push(valuesAst);
        });

        return {
            tableName: tableName,
            conditions: conditions,
            values: values
        }
    }

    deleteStatement(ctx) {
        let tableName = JSON.parse(this.visit(ctx.tableNameClause));
        let conditions = [];
        ctx.conditionClause.forEach((condition) => {
            let conditionsAst = this.valueClause(condition.children);
            conditions.push(conditionsAst);
        });

        return {
            tableName: tableName,
            conditions: conditions
        }
    }

    nameClause(ctx) {
        let schemaName = ctx.StringLiteral[0].image;
        return schemaName;
    }

    tableNameClause(ctx) {
        let tableName = ctx.StringLiteral[0].image;
        return tableName;
    }

    fieldClause(ctx) {
        let fieldName = ctx.StringLiteral[0].image;
        let fieldType = ctx.StringLiteral[1].image;
        return {
            fieldName: JSON.parse(fieldName),
            fieldType: JSON.parse(fieldType)
        }
    }

    rowClause(ctx) {
        let values = [];
        ctx.valueClause.forEach((value) => {
           let valueAst = this.valueClause(value.children);
           values.push(valueAst);
        });

        return {
            values: values
        }
    }

    valueClause(ctx) {
        let fieldName = ctx.StringLiteral[0].image;
        let fieldValue = ctx.StringLiteral[1].image;
        return {
            fieldName: JSON.parse(fieldName),
            fieldValue: JSON.parse(fieldValue)
        }
    }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new DSLToAstVisitor();

module.exports = {
    toAst: function(inputText) {
        const lexResult = lexer.lex(inputText);

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens;

        // Automatic CST created when parsing
        const cst = parserInstance.Program();

        if (parserInstance.errors.length > 0) {
            throw Error(
                "Oh no, parsing errors detected!\n" +
                    parserInstance.errors[0].message
            )
        }

        const ast = toAstVisitorInstance.visit(cst);

        return ast;
    }
};
