"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3a_adding_actions_separated.md

// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

const selectLexer = require("../step1_lexing/step1_lexing");
// re-using the parser implemented in step two.
const parser = require("../step2_parsing/step2_parsing");
const SelectParser = parser.SelectParser;

// A new parser instance with CST output (enabled by default).
const parserInstance = new SelectParser([]);
// The base visitor class can be accessed via the a parser instance.
const BaseDSLVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults();

class DSLToAstVisitor extends BaseDSLVisitor {
    constructor() {
        super();
        this.validateVisitor();
    };

    Program(ctx){
        // No need to visit start or end as they are only used to validate program syntax
        let connectStatementAst = this.visit(ctx.connectStatement);

        return {
            type: "PROGRAM",
            connectStatement: connectStatementAst
        }
    }


    connectStatement(ctx) {
        const MongoURI = ctx.MongoURI[0].image;
        const dbUsername = ctx.StringLiteral[0].image; //First string is username
        const dbPassword = ctx.StringLiteral[1].image; //second is password

        return {
            type: "CONNECT_STMT",
            mongoURI: MongoURI,
            dbUsername: dbUsername,
            dbPassword: dbPassword
        }
    }

    expression(ctx) {
        // Note the usage of the "rhs" and "lhs" labels defined in step 2 in the expression rule.
        const lhs = this.visit(ctx.lhs[0]);
        const operator = this.visit(ctx.relationalOperator);
        const rhs = this.visit(ctx.rhs[0]);

        return {
            type: "EXPRESSION",
            lhs: lhs,
            operator: operator,
            rhs: rhs
        }
    }

    // these two visitor methods will return a string.
    atomicExpression(ctx) {
        if (ctx.Integer) {
            return ctx.Integer[0].image
        } else {
            return ctx.Identifier[0].image
        }
    }

    relationalOperator(ctx) {
        if (ctx.GreaterThan) {
            return ctx.GreaterThan[0].image
        } else {
            return ctx.LessThan[0].image
        }
    }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new DSLToAstVisitor();

module.exports = {
    toAst: function(inputText) {
        const lexResult = selectLexer.lex(inputText);

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
