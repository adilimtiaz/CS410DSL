"use strict"
const expect = require("chai").expect
const _ = require("lodash")
const parse = require("./parser").parse;
const fs = require("fs");
const path = require("path");

describe("Parser", () => {
    context("Parser tests", () => {
        it("Can Parse a simple input", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/ValidExamples/Sample.txt'), 'utf8');
            expect(() => parse(inputText)).to.not.throw();
        });

        it("Can Parse an input with InsertIntoSchema", () => {
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/InvalidExamples/SampleWithInvalidInserts.txt'), 'utf8');
            expect(() => parse(inputText)).to.not.throw();
        });

        it("Will throw an error for an invalid input", () => {
            // missing table name
            let inputText = "SELECT FROM table2";
            expect(() => parse(inputText)).to.throw();
        });

        it("Will throw an error for a program without a start and end", () => {
            // missing table name
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/InvalidExamples/NoStartEnd.txt'), 'utf8');
            expect(() => parse(inputText)).to.throw(
                "Expecting token of type --> Start <-- but found --> 'Connect' <--"
            );
        });

        it("Will throw an error for a program without an end", () => {
            // missing table name
            let inputText = fs.readFileSync(path.join(__dirname ,'../GrammarSamples/InvalidExamples/NoEnd.txt'), 'utf8');
            expect(() => parse(inputText)).to.throw();
        })
    })
});
