const lex = require("./step1_lexing").lex

const inputText = "connect(\"dbUrl\",\"dbUserName\", \"Password\")";
const lexingResult = lex(inputText);
console.log(JSON.stringify(lexingResult, null, "\t"))
