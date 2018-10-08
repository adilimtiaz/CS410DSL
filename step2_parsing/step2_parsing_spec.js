"use strict"
const expect = require("chai").expect
const _ = require("lodash")
const parse = require("./step2_parsing").parse

describe("Chevrotain Tutorial", () => {
    context("Step 2 - Parsing", () => {
        it("Can Parse a simple input", () => {
            let inputText = "Connect(\"ds111963.mlab.com:11963/emaily-dev\",\"dbUserName\", \"Password\");";
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
        })
    })
});
