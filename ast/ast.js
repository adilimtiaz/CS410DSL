"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3a_adding_actions_separated.md

// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

const lexer = require("../lexer/lexer");
// re-using the parser implemented in step two.
const parser = require("../parser/parser");
const Parser = parser.Parser;
const _ = require("lodash");

// A new parser instance with CST output (enabled by default).
const parserInstance = new Parser([]);
// The base visitor class can be accessed via the a parser instance.
const BaseDSLVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults();

const ProjectNameStmtAstType =  "SET_PROJECT_NAME_STMT";
const DefaultProjectNameAst = {type: ProjectNameStmtAstType, name: "myProject"};

class DSLToAstVisitor extends BaseDSLVisitor {
    constructor() {
        super();
        this.validateVisitor();
    };

    Program(ctx){
        // No need to visit start or end ast they are only used to validate program syntax
        let connectStmtAst = this.visit(ctx.connectStatement);
        let setProjectBaseDirStmtAst = this.visit(ctx.setProjectBaseDirStmt);
        let setProjectNameStmtAst;
        if(ctx.setProjectNameStmt) {
            setProjectNameStmtAst = this.visit(ctx.setProjectNameStmt);
        } else {
            setProjectNameStmtAst = DefaultProjectNameAst;
        }

        let schemas = [];
        if(ctx.createSchemaStatement){
            ctx.createSchemaStatement.forEach((statement) => {
                let schema = this.createSchemaStatement(statement.children);
                schemas.push(schema);
            });
        }
        let createSchemaStmtAst = {type: "CREATE_SCHEMA_STMT", schemas: schemas};

        let schemasToInsert =[];
        if(ctx.createSchemaStatement && ctx.insertIntoSchemaStatement){
            ctx.insertIntoSchemaStatement.forEach((statement) => {
                let schemaToInsert = this.insertIntoSchemaStatement(statement.children);
                try{
                    if(!_.find(schemas, {schemaName: schemaToInsert.schemaName})){
                        throw new Error("You cannot insert data into schemaName: " + schemaToInsert.schemaName + " as it has not been created yet");
                    }
                    schemasToInsert.push(schemaToInsert);
                } catch(e){
                    throw new Error(e.message);
                }
            });
        }
        if(ctx.insertIntoSchemaStatement && !ctx.createSchemaStatement){
            throw new Error ("insertSchemaStatement cannot be used without createSchemaStatement");
        }
        let InsertIntoSchemaStmtAst = {type: "INSERT_SCHEMA_STMT", schemas: schemasToInsert};

        return {
            type: "PROGRAM",
            connectStmtAst: connectStmtAst,
            setProjectBaseDirStmtAst: setProjectBaseDirStmtAst,
            setProjectNameStmtAst: setProjectNameStmtAst,
            createSchemaStmtAst: createSchemaStmtAst,
            insertIntoSchemaStmtAst: InsertIntoSchemaStmtAst
        }
    }

    setProjectBaseDirStmt(ctx){
        let path;
        let toParse = true;
        if(ctx.UnixPath){
            path = ctx.UnixPath[0].image;
        }
        else {
            path = ctx.WindowsPath[0].image;
            toParse = false;
        }
        return {
            type: "SET_PROJECT_BASE_DIR_STMT",
            path: (toParse) ? JSON.parse(path) : path
        }
    }

    setProjectNameStmt(ctx){
        let projectName = ctx.StringLiteral[0].image;
        return {
            type: ProjectNameStmtAstType,
            name: JSON.parse(projectName)
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

    insertIntoSchemaStatement(ctx) {
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

    nameClause(ctx) {
        let schemaName = ctx.StringLiteral[0].image;
        return schemaName;
    }

    fieldClause(ctx) {
        let fieldName = ctx.StringLiteral[0].image;
        let fieldType = ctx.StringLiteral[1].image;
        return {
            fieldName: JSON.parse(fieldName),
            fieldType: JSON.parse(fieldType)
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
                "Sad sad panda, parsing errors detected!\n" +
                    parserInstance.errors[0].message
            )
        }

        const ast = toAstVisitorInstance.visit(cst);

        return ast;
    }
};
