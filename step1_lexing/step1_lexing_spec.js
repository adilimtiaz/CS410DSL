"use strict";
const expect = require("chai").expect;
const _ = require("lodash");
const tokenMatcher = require("chevrotain").tokenMatcher;
const lex = require("./step1_lexing").lex;
const tokenVocabulary = require("./step1_lexing").tokenVocabulary;

describe("Chevrotain Tutorial", () => {
    context("Step 1 - Lexing", () => {
        it("Can Lex a connect statement", () => {
            let inputText = "Connect(\"dbUrl\",\"dbUserName\", \"Password\")";
            let lexingResult = lex(inputText);

            console.log(JSON.stringify(lexingResult.errors));

            expect(lexingResult.errors).to.be.empty;

            let tokens = lexingResult.tokens;

            expect(tokens).to.have.lengthOf(8);
            // tokenMatcher acts as an "instanceof" check for Tokens
            expect(tokenMatcher(tokens[0], tokenVocabulary.ConnectLiteral)).to.be.true;
            expect(tokenMatcher(tokens[1], tokenVocabulary.LRound)).to.be.true;
            expect(tokenMatcher(tokens[2], tokenVocabulary.StringLiteral)).to.be.true; // "\"dbUrl\"
            expect(tokenMatcher(tokens[3], tokenVocabulary.Comma)).to.be.true;
            expect(tokenMatcher(tokens[4], tokenVocabulary.StringLiteral)).to.be.true; // "dbUserName"
            expect(tokenMatcher(tokens[7], tokenVocabulary.RRound)).to.be.true;

            console.log(JSON.stringify(tokens));
           // expect(tokens[0].image).to.equal("")
        })
    })
});
