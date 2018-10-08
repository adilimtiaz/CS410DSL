"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step2_parsing.md

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

const selectLexer = require("../step1_lexing/step1_lexing")
const Parser = require("chevrotain").Parser;
const tokenVocabulary = selectLexer.tokenVocabulary;

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const Integer = tokenVocabulary.Integer;
const GreaterThan = tokenVocabulary.GreaterThan;
const LessThan = tokenVocabulary.LessThan;
const Comma = tokenVocabulary.Comma;
const LRound = tokenVocabulary.LRound;
const StringLiteral = tokenVocabulary.StringLiteral;
const Semicolon = tokenVocabulary.Semicolon;
const ConnectLiteral = tokenVocabulary.ConnectLiteral;

// ----------------- parser -----------------
class SelectParser extends Parser {
    // A config object as a constructor argument is normally not needed.
    // Our tutorial scenario requires a dynamic configuration to support step3 without duplicating code.
    constructor(config) {
        super(tokenVocabulary, config);

        // for conciseness
        const $ = this;

        $.RULE("Program", () =>{
           $.SUBRULE($.startStmt);
           $.SUBRULE($.connectStatement);
           $.SUBRULE($.schemaStatement);
           $.SUBRULE($.endStmt);
        });

        $.RULE("startStmt", () =>{
            $.CONSUME($.tokensMap.Start);
        });

        $.RULE("endStmt", () =>{
            $.CONSUME($.tokensMap.End);
        });

        $.RULE("connectStatement", () =>{
            $.CONSUME($.tokensMap.ConnectLiteral);
            $.CONSUME1($.tokensMap.LRound);
            $.CONSUME2($.tokensMap.MongoURI);
            $.CONSUME3($.tokensMap.Comma);
            $.CONSUME4($.tokensMap.StringLiteral);
            $.CONSUME5($.tokensMap.Comma);
            $.CONSUME6($.tokensMap.StringLiteral);
            $.CONSUME7($.tokensMap.RRound);
            $.CONSUME8($.tokensMap.Semicolon);
        });

        $.RULE("schemaStatement", () => {
            $.CONSUME($.tokensMap.CreateSchema);
            $.CONSUME($.tokensMap.LCurly);
            $.SUBRULE($.nameClause);
            $.CONSUME($.tokensMap.Comma);
            $.SUBRULE($.entryClause);
            $.CONSUME($.tokensMap.RCurly);
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("nameClause", () => {
            $.CONSUME($.tokensMap.Name1);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        $.RULE("entryClause", () => {
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME($.tokensMap.StringLiteral);
                    $.CONSUME1($.tokensMap.Colon1);
                    $.CONSUME2($.tokensMap.StringLiteral);
                }

            })
        });


        // The "rhs" and "lhs" (Right/Left Hand Side) labels will provide easy
        // to use names during CST Visitor (step 3a).
        $.RULE("expression", () => {
            $.SUBRULE($.tokensMap.atomicExpression, { LABEL: "lhs" });
            $.SUBRULE($.tokensMap.relationalOperator);
            $.SUBRULE2($.tokensMap.atomicExpression, { LABEL: "rhs" }); // note the '2' suffix to distinguish
            // from the 'SUBRULE(atomicExpression)'
            // 2 lines above.
        });

        $.RULE("atomicExpression", () => {
            $.OR([
                { ALT: () => $.CONSUME(NumberLiteral) },
                { ALT: () => $.CONSUME(StringLiteral) }
            ])
        });

        $.RULE("relationalOperator", () => {
            $.OR([
                { ALT: () => $.CONSUME(GreaterThan) },
                { ALT: () => $.CONSUME(LesserThan) }
            ])
        });

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        this.performSelfAnalysis()
    }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new SelectParser()

module.exports = {
    parserInstance: parserInstance,

    SelectParser: SelectParser,

    parse: function(inputText) {
        const lexResult = selectLexer.lex(inputText)

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens

        // No semantic actions so this won't return anything yet.
        const cst = parserInstance.Program();

        if (parserInstance.errors.length > 0) {
            throw Error(
                parserInstance.errors[0].message
            )
        }
    }
};
