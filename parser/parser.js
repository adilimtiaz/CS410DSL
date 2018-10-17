"use strict";

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the lexer.

const lexer = require("../lexer/lexer");
const chevrotainParser = require("chevrotain").Parser;
const tokenVocabulary = lexer.tokenVocabulary;

// ----------------- parser -----------------
class Parser extends chevrotainParser {
    constructor(config) {
        super(tokenVocabulary, config);

        // for conciseness
        const $ = this;

        $.RULE("Program", () =>{
           $.SUBRULE($.startStmt);
           $.SUBRULE($.connectStatement);
           $.SUBRULE($.setProjectBaseDirStmt);
           $.OPTION(() => {$.SUBRULE($.setProjectNameStmt); });
           $.MANY(() => { $.SUBRULE($.createSchemaStatement); });
           $.MANY2(() => { $.SUBRULE($.insertIntoSchemaStatement); });
           $.SUBRULE($.endStmt);
        });

        $.RULE("startStmt", () =>{
            $.CONSUME($.tokensMap.Start);
        });

        $.RULE("setProjectBaseDirStmt", () =>{
            $.CONSUME($.tokensMap.SetProjectBaseDir);
            $.CONSUME($.tokensMap.LRound);
            $.OR([
                {ALT: () => $.CONSUME($.tokensMap.UnixPath)},
                {ALT: () => $.CONSUME($.tokensMap.WindowsPath)}
            ], {LABEL: "path"});
            $.CONSUME($.tokensMap.RRound);
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("setProjectNameStmt", () =>{
            $.CONSUME($.tokensMap.SetProjectName);
            $.CONSUME($.tokensMap.LRound);
            $.CONSUME1($.tokensMap.StringLiteral);
            $.CONSUME($.tokensMap.RRound);
            $.CONSUME($.tokensMap.Semicolon);
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

        $.RULE("createSchemaStatement", () => {
            $.CONSUME($.tokensMap.CreateSchema);
            $.CONSUME($.tokensMap.LRound); //Start create Schema JSON
            $.SUBRULE($.nameClause);
            $.CONSUME($.tokensMap.Comma);
            $.CONSUME($.tokensMap.Fields);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME3($.tokensMap.LCurly); //Start fields object
            $.AT_LEAST_ONE_SEP({
                SEP: $.tokensMap.Comma,
                DEF: () => {$.SUBRULE($.fieldClause)}
            });
            $.CONSUME4($.tokensMap.RCurly); //End fields object
            $.CONSUME5($.tokensMap.RRound); //End create Schema JSON
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("insertIntoSchemaStatement", ()=>{
            $.CONSUME($.tokensMap.Insert);
            $.CONSUME($.tokensMap.LRound);
            $.SUBRULE($.nameClause);
            $.CONSUME($.tokensMap.Comma);
            $.CONSUME($.tokensMap.Fields);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME3($.tokensMap.LCurly); //Start fields object
            $.AT_LEAST_ONE_SEP({
                SEP: $.tokensMap.Comma,
                DEF: () => {$.SUBRULE($.fieldClause)}
            });
            $.CONSUME4($.tokensMap.RCurly); //End fields object
            $.CONSUME5($.tokensMap.RRound); //End insert Schema JSON
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("nameClause", () => {
            $.CONSUME($.tokensMap.SchemaName);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        $.RULE("fieldClause", () => {
            $.CONSUME($.tokensMap.StringLiteral);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly ast it will lack information
        // derived during the self analysis phase.
        this.performSelfAnalysis()
    }
}

const parserInstance = new Parser();

module.exports = {
    parserInstance: parserInstance,

    Parser: Parser,

    parse: function(inputText) {
        const lexResult = lexer.lex(inputText);

        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens;

        const cst = parserInstance.Program();

        if (parserInstance.errors.length > 0) {
            throw Error(
                parserInstance.errors[0].message
            )
        }
    }
};
