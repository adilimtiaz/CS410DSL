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
           $.MANY(() => {$.SUBRULE($.statement);});
           $.OPTION(() => {$.SUBRULE($.setProjectNameStmt); });
           $.MANY1(() => { $.SUBRULE($.createSchemaStatement); });
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

        $.RULE("statement", () => {
            $.OR([
                {ALT: () => $.SUBRULE($.createSchemaStatement)},
                {ALT: () => $.SUBRULE($.insertStatement)},
                {ALT: () => $.SUBRULE($.updateStatement)},
                {ALT: () => $.SUBRULE($.deleteStatement)}
            ], {LABEL: "statement"});
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
                DEF: () => {$.SUBRULE($.fieldClause);}
            });
            $.CONSUME4($.tokensMap.RCurly); //End fields object
            $.CONSUME5($.tokensMap.RRound); //End create Schema JSON
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("insertStatement", () => {
           $.CONSUME($.tokensMap.Insert);
           $.CONSUME($.tokensMap.LCurly);
           $.SUBRULE($.tableNameClause);
           $.CONSUME($.tokensMap.Comma);
           $.CONSUME($.tokensMap.Values);
           $.CONSUME1($.tokensMap.Colon1);
           $.CONSUME2($.tokensMap.LSquare); //Start values object
           $.MANY_SEP({
               SEP: $.tokensMap.Comma,
               DEF: () => {$.SUBRULE($.rowClause);}
           });
           $.CONSUME3($.tokensMap.RSquare); //End values object
           $.CONSUME4($.tokensMap.RCurly);
           $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("updateStatement", () => {
            $.CONSUME($.tokensMap.Update);
            $.CONSUME($.tokensMap.LCurly);
            $.SUBRULE($.tableNameClause);
            $.CONSUME($.tokensMap.Comma);
            $.CONSUME($.tokensMap.Conditions);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.LCurly); //Start conditions object
            $.MANY_SEP({
                SEP: $.tokensMap.Comma,
                DEF: () => {$.SUBRULE($.conditionClause);}
            });
            $.CONSUME3($.tokensMap.RCurly); //End conditions object
            $.CONSUME4($.tokensMap.Comma);
            $.CONSUME5($.tokensMap.Values);
            $.CONSUME6($.tokensMap.Colon1);
            $.CONSUME7($.tokensMap.LCurly); //Start values object
            $.MANY_SEP1({
                SEP: $.tokensMap.Comma,
                DEF: () => {$.SUBRULE($.valueClause);}
            });
            $.CONSUME8($.tokensMap.RCurly); //End values object
            $.CONSUME9($.tokensMap.RCurly);
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("deleteStatement", () => {
            $.CONSUME($.tokensMap.Delete);
            $.CONSUME($.tokensMap.LCurly);
            $.SUBRULE($.tableNameClause);
            $.CONSUME($.tokensMap.Comma);
            $.CONSUME($.tokensMap.Conditions);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.LCurly); //Start values object
            $.MANY_SEP({
                SEP: $.tokensMap.Comma,
                DEF: () => {$.SUBRULE($.conditionClause);}
            });
            $.CONSUME3($.tokensMap.RCurly); //End values object
            $.CONSUME4($.tokensMap.RCurly);
            $.CONSUME($.tokensMap.Semicolon);
        });

        $.RULE("nameClause", () => {
            $.CONSUME($.tokensMap.SchemaName);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        $.RULE("tableNameClause", () => {
            $.CONSUME($.tokensMap.TableName);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        $.RULE("fieldClause", () => {
            $.CONSUME($.tokensMap.StringLiteral);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        $.RULE("rowClause", () => {
            $.CONSUME($.tokensMap.LCurly);
            $.MANY_SEP({
                SEP: $.tokensMap.Comma,
                DEF: () => {$.SUBRULE($.valueClause);}
            });
            $.CONSUME($.tokensMap.RCurly);
        });

        $.RULE("conditionClause", () => {
            $.CONSUME($.tokensMap.StringLiteral);
            $.CONSUME1($.tokensMap.Colon1);
            $.CONSUME2($.tokensMap.StringLiteral);
        });

        $.RULE("valueClause", () => {
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
