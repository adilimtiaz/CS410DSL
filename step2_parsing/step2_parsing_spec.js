"use strict"
const expect = require("chai").expect
const _ = require("lodash")
const parse = require("./step2_parsing").parse;
const fs = require("fs");
const path = require("path");

describe("Chevrotain Tutorial", () => {
    context("Step 2 - Parsing", () => {
        it("Can Parse a simple input", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/Sample.txt'), 'utf8');
            expect(() => parse(inputText)).to.not.throw();
        });

        it("Will throw an error for an invalid input", () => {
            // missing table name
            let inputText = "SELECT FROM table2";
            expect(() => parse(inputText)).to.throw(
                JSON.stringify(
                    ["unexpected character: ->S<- at offset: 0, skipped 6 characters.",
                        "unexpected character: ->F<- at offset: 7, skipped 4 characters.",
                        "unexpected character: ->t<- at offset: 12, skipped 5 characters."]
                )
            );
        });

        it("Will throw an error for a program without a start and end", () => {
            // missing table name
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/NoStartEnd.txt'), 'utf8');
            expect(() => parse(inputText)).to.throw(
                "Expecting token of type --> Start <-- but found --> 'Connect' <--"
            );
        });

        it("Will throw an error for a program without an end", () => {
            // missing table name
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/NoEnd.txt'), 'utf8');
            expect(() => parse(inputText)).to.throw(
                "Expecting token of type --> End <-- but found --> '' <--"
            );
        })


    })
});
