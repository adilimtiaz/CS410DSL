"use strict";
const chevrotain = require("chevrotain");
const chevrotainLexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"[^\/][a-zA-Z0-9_\-:/\.]*"/
});
const Start = createToken({name: "Start", pattern: /start/ , longer_alt: StringLiteral});
const MongoURI = createToken({
   name: "MongoURI",
   pattern: /\"?(([\w\.]+)?):(\d+)\/([\w\-]+)\"?/
});
const EndOfLine = createToken({
    name: "EndOfLine",
    pattern: /\n|\r\n/,
    group: chevrotainLexer.SKIPPED
});
const UnixPath = createToken({
   name: "UnixPath",
   pattern: /"\/(.+)\/([^\/\"]+)"/
});

const WindowsPath = createToken({
   name: "WindowsPath",
   pattern: /"[a-zA-Z]:\\[\\\S|*\S]?.*"/
});

const SetProjectBaseDir = createToken({name: "SetProjectBaseDir", pattern: /SetProjectBaseDir/});
const SetProjectName = createToken({name: "SetProjectName", pattern: /SetProjectName/});
const End = createToken({name: "End", pattern: /end/ , longer_alt: StringLiteral});
const ConnectLiteral = createToken({name: "ConnectLiteral", pattern: /Connect/ , longer_alt: StringLiteral});
const CreateSchema = createToken({name: "CreateSchema", pattern: /CreateSchema/, longer_alt: StringLiteral});
const SchemaName = createToken({name: "SchemaName", pattern: /SchemaName/, longer_alt: StringLiteral});
const Fields = createToken({name: "Fields", pattern: /Fields/, longer_alt: StringLiteral});
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
    group: chevrotainLexer.SKIPPED
});
const GreaterThan = createToken({name: "GreaterThan", pattern: />/ });
const LesserThan = createToken({name: "LesserThan" ,pattern: /</ });


const allTokens = [
    Start,
    End,
    SetProjectBaseDir,
    SetProjectName,
    ConnectLiteral,
    EndOfLine,
    CreateSchema,
    SchemaName,
    Fields,
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
    StringLiteral,
    UnixPath,
    WindowsPath
];

const Lexer = new chevrotainLexer(allTokens);

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
});

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function(inputText) {
        const lexingResult = Lexer.tokenize(inputText);

        if (lexingResult.errors.length > 0) {
            console.log(JSON.stringify(lexingResult.errors));
            throw Error(JSON.stringify(lexingResult.errors.map(error => error.message)));
        }

        return lexingResult;
    }
};
