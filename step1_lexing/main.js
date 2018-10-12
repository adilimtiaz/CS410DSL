const lex = require("./step1_lexing").lex;
const fs = require("fs");
const path = require("path");

const inputText = fs.readFileSync(path.join(__dirname, '../GrammarSamples/Sample.txt'), 'utf8');
const lexingResult = lex(inputText);
console.log(JSON.stringify(lexingResult, null, "\t"));
