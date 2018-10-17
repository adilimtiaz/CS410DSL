"use strict";
const expect = require("chai").expect;
const _ = require("lodash");
const tokenMatcher = require("chevrotain").tokenMatcher;
const lex = require("./lexer").lex;
const tokenVocabulary = require("./lexer").tokenVocabulary;
const fs = require("fs");
const path = require("path");

describe("Lexing tests", () => {
    context("Lexing", () => {
        it("Can Lex a simple sample with one create Schema statment", () => {
            const inputText = fs.readFileSync(path.join(__dirname, '../GrammarSamples/ValidExamples/JustOneCreateSchemaStmt.txt'), 'utf8');
            let lexingResult = lex(inputText);

            console.log(JSON.stringify(lexingResult.errors));

            expect(lexingResult.errors).to.be.empty;

            let tokens = lexingResult.tokens;

            expect(tokens).to.have.lengthOf(35);
            // tokenMatcher acts ast an "instanceof" check for Tokens
            expect(tokenMatcher(tokens[0], tokenVocabulary.Start)).to.be.true;
            expect(tokenMatcher(tokens[1], tokenVocabulary.ConnectLiteral)).to.be.true;
            expect(tokenMatcher(tokens[2], tokenVocabulary.LRound)).to.be.true;
            expect(tokenMatcher(tokens[3], tokenVocabulary.MongoURI)).to.be.true; // "\"dbUrl\"
            expect(tokenMatcher(tokens[4], tokenVocabulary.Comma)).to.be.true;
            expect(tokenMatcher(tokens[5], tokenVocabulary.StringLiteral)).to.be.true; // "dbUserName"
            expect(tokenMatcher(tokens[8], tokenVocabulary.RRound)).to.be.true;
            expect(tokenMatcher(tokens[10], tokenVocabulary.SetProjectBaseDir)).to.be.true;
            expect(tokenMatcher(tokens[12], tokenVocabulary.UnixPath)).to.be.true;
            expect(tokenMatcher(tokens[34], tokenVocabulary.End)).to.be.true;

            console.log(JSON.stringify(tokens));
            // expect(tokens[0].image).to.equal("")
        });

        it("Can Lex a Project Name", () => {
            let projectNameSample = "SetProjectName(\"testProjectName\");";
            let lexingResult = lex(projectNameSample);
            console.log(JSON.stringify(lexingResult.errors));

            let tokens = lexingResult.tokens;

            expect(lexingResult.errors).to.be.empty;
            expect(tokenMatcher(tokens[0], tokenVocabulary.SetProjectName)).to.be.true;
            expect(tokenMatcher(tokens[2], tokenVocabulary.StringLiteral)).to.be.true;
        });

        it("Can Lex a DB URL", () => {
            let dbUrl = "ds111963.mlab.com:11963/emaily-dev";
            let lexingResult = lex(dbUrl);
            console.log(JSON.stringify(lexingResult.errors));

            let tokens = lexingResult.tokens;

            expect(lexingResult.errors).to.be.empty;
            expect(tokenMatcher(tokens[0], tokenVocabulary.MongoURI)).to.be.true;
        });

        it("Can Lex a Unix Path", () => {
            let unixPath = "\"/Users/adilimtiaz/WebstormProjects/chevrotain/examples/tutorial\""; //When reading a string from the file it gets double quotes around it
            console.log("HELLO ITS ME AND THIS IS THE UNIX PATH" + unixPath);
            let lexingResult = lex(unixPath);
            console.log(JSON.stringify(lexingResult.errors));

            let tokens = lexingResult.tokens;

            expect(lexingResult.errors).to.be.empty;
            expect(tokenMatcher(tokens[0], tokenVocabulary.UnixPath)).to.be.true;
        });

        it("Can Lex a Windows Path", () => {
            let windowsPath = "\"C:\\Documents\\Newsletters\\\"";
            let lexingResult = lex(windowsPath);
            console.log(JSON.stringify(lexingResult.errors));

            let tokens = lexingResult.tokens;

            expect(lexingResult.errors).to.be.empty;
            expect(tokenMatcher(tokens[0], tokenVocabulary.WindowsPath)).to.be.true;
        });

        it("Can Lex a sample with InsertIntoSchema", () => {
            const inputText = fs.readFileSync(path.join(__dirname, '../GrammarSamples/InvalidExamples/SampleWithInvalidInserts.txt'), 'utf8');
            let lexingResult = lex(inputText);
            console.log(JSON.stringify(lexingResult.errors));

            expect(lexingResult.errors).to.be.empty;
        });
    });
});
