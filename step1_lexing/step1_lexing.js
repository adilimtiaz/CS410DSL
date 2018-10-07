"use strict"
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step1_lexing.md

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar
const chevrotain = require("chevrotain");
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

const AlphanumericString = createToken({ name: "AlphanumericString", pattern: /[a-zA-Z0-9]\w*/ });
const ConnectLiteral = createToken({name: "ConnectLiteral", pattern: /Connect/ , longer_alt: AlphanumericString});
const True = createToken({ name: "True", pattern: /true/, longer_alt: AlphanumericString});
const False = createToken({ name: "False", pattern: /false/, longer_alt: AlphanumericString});
const Null = createToken({ name: "Null", pattern: /null/, longer_alt: AlphanumericString});
const LRound = createToken({name: "LRound", pattern: /\(/});
const RRound = createToken({name: "RRound", pattern: /\)/});
const LCurly = createToken({ name: "LCurly", pattern: /{/});
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
});
const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED
});
const GreaterThan = createToken({name: "GreaterThan", pattern: />/ });
const LesserThan = createToken({name: "LesserThan" ,pattern: /</ });


const allTokens = [
    ConnectLiteral,
    WhiteSpace,
    NumberLiteral,
    LRound,
    RRound,
    LCurly,
    RCurly,
    LSquare,
    RSquare,
    Comma,
    Colon,
    Semicolon,
    True,
    False,
    Null,
    GreaterThan,
    LesserThan,
    StringLiteral,
    AlphanumericString
];



// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata





// Regex matches all alphanumeric strings
// connect(
// Whitespace(*) Alphanum (At least one) Whitespace(*),
// Whitespace(*) Alphanum (At least one) Whitespace(*),
// Whitespace(*) Alphanum (At least one) Whitespace(*))
/**
const Connect = createToken({
   name: "Connect",
   pattern: /Connect\(+\s*"[A-Za-z0-9]+"\s*,\s*"[A-Za-z0-9]+"\s*,+\s*"[A-Za-z0-9]+"\)/,
    longer_alt: Identifier
});
 **/

const SelectLexer = new Lexer(allTokens);

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
});

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function(inputText) {
        const lexingResult = SelectLexer.tokenize(inputText);

        if (lexingResult.errors.length > 0) {
            console.log(JSON.stringify(lexingResult.errors));
            throw Error("Sad Sad Panda, lexing errors detected")
        }

        return lexingResult
    }
};
