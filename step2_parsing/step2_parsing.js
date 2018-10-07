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
const AlphanumericString = tokenVocabulary.Identifier;
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

        $.RULE("connectStatement", () =>{
            $.CONSUME($.tokensMap.ConnectLiteral);
            $.CONSUME1($.tokensMap.LRound);
            $.OR([
                { ALT: () => $.CONSUME6($.tokensMap.AlphanumericString) },
                { ALT: () => $.CONSUME7($.tokensMap.StringLiteral) }
            ]);
            $.CONSUME2($.tokensMap.Comma);
            $.OR1([
                { ALT: () => $.CONSUME8($.tokensMap.AlphanumericString) },
                { ALT: () => $.CONSUME9($.tokensMap.StringLiteral) }
            ]);
            $.CONSUME3($.tokensMap.Comma);
            $.OR2([
                { ALT: () => $.CONSUME($.tokensMap.AlphanumericString) },
                { ALT: () => $.CONSUME($.tokensMap.StringLiteral) }
            ]);
            $.CONSUME4($.tokensMap.RRound);
            $.CONSUME5($.tokensMap.Semicolon);
        });

        // The "rhs" and "lhs" (Right/Left Hand Side) labels will provide easy
        // to use names during CST Visitor (step 3a).
        $.RULE("expression", () => {
            $.SUBRULE($.tokensMap.atomicExpression, { LABEL: "lhs" })
            $.SUBRULE($.tokensMap.relationalOperator)
            $.SUBRULE2($.tokensMap.atomicExpression, { LABEL: "rhs" }) // note the '2' suffix to distinguish
            // from the 'SUBRULE(atomicExpression)'
            // 2 lines above.
        });

        $.RULE("atomicExpression", () => {
            $.OR([
                { ALT: () => $.CONSUME(NumberLiteral) },
                { ALT: () => $.CONSUME(AlphanumericString) }
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
        parserInstance.connectStatement();

        if (parserInstance.errors.length > 0) {
            throw Error(
                "Sad sad panda, parsing errors detected!\n" +
                    parserInstance.errors[0].message
            )
        }
    }
}
