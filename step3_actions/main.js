const assert = require("assert")
const toAstVisitor = require("./step3a_actions_visitor").toAst

let inputText = "SELECT column1, column2 FROM table2 WHERE column2 > 3"

let astFromVisitor = toAstVisitor(inputText)

console.log(JSON.stringify(astFromVisitor, null, "\t"))
