"use strict"
const chevrotain = require("chevrotain");
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"[a-zA-Z0-9_\-:/\.]+"/
});
const Start = createToken({name: "Start", pattern: /start/ , longer_alt: StringLiteral});
const MongoURI = createToken({
   name: "MongoURI",
   pattern: /\"?(([\w\.]+)?):(\d+)\/([\w\-]+)\"?/
});
const EndOfLine = createToken({
    name: "EndOfLine",
    pattern: /\n|\r\n/,
    group: Lexer.SKIPPED
});
const End = createToken({name: "End", pattern: /end/ , longer_alt: StringLiteral});
const ConnectLiteral = createToken({name: "ConnectLiteral", pattern: /Connect/ , longer_alt: StringLiteral});
const CreateSchema = createToken({name: "CreateSchema", pattern: /CreateSchema/, longer_alt: StringLiteral});
const Name1 = createToken({name: "Name1", pattern: /Name/, longer_alt: StringLiteral});
const True = createToken({ name: "True", pattern: /true/, longer_alt: StringLiteral});
const False = createToken({ name: "False", pattern: /false/, longer_alt: StringLiteral});
const Null = createToken({ name: "Null", pattern: /null/, longer_alt: StringLiteral});
const LRound = createToken({name: "LRound", pattern: /\(/});
const RRound = createToken({name: "RRound", pattern: /\)/});
const LCurly = createToken({ name: "LCurly", pattern: /{/});
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon1 = createToken({ name: "Colon1", pattern: /:/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
    longer_alt: StringLiteral
});
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED
});
const GreaterThan = createToken({name: "GreaterThan", pattern: />/ });
const LesserThan = createToken({name: "LesserThan" ,pattern: /</ });


const allTokens = [
    Start,
    End,
    ConnectLiteral,
    EndOfLine,
    CreateSchema,
    Name1,
    WhiteSpace,
    MongoURI,
    NumberLiteral,
    LRound,
    RRound,
    LCurly,
    RCurly,
    LSquare,
    RSquare,
    Comma,
    Colon1,
    Semicolon,
    True,
    False,
    Null,
    GreaterThan,
    LesserThan,
    StringLiteral
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
            throw Error(JSON.stringify(lexingResult.errors.map(error => error.message)));
        }

        return lexingResult;
    }
};
