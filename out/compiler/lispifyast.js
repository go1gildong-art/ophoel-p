"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lispify = lispify;
const ast_js_1 = require("../compiler/ast.js");
class Code {
    constructor(braceStyle, indentSpaces) {
        this.lines = [];
        this.depth = 0;
        this.braceStyle = braceStyle;
        this.indentSpaces = indentSpaces;
    }
    addLn(ln, indent = (this.depth * this.indentSpaces)) {
        this.addCode(ln, indent);
        this.newLine();
    }
    newLine() { this.lines.push("\n"); }
    addCode(ln, indent = (this.depth * this.indentSpaces)) { this.lines.push(" ".repeat(indent) + ln); }
    openBlock(code) {
        this.addLn(code);
        this.depth += 1;
    }
    closeBlock() { this.depth -= 1; this.addCode(")", 0); }
    getCode() { return this.lines.join(""); }
}
function stringifyNode(node, resultCode) {
    if (node.type === "McCommand") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `(${node.command}!! (${node.args[0].stringified})`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "PreservedNewline") {
        node.stringified = "(/.)";
        resultCode.addLn(node.stringified);
    }
    if (node.type === "PreservedComment") {
        node.stringified = `/# ${node.message}`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "Comment") {
        node.stringified = `(${node.commentMessage})`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "ConfigRef") {
        node.stringified = `${node.access}`;
    }
    if (node.type === "Literal") {
        node.stringified = (node.valueType === "string") ? `"${node.raw}"` : node.raw;
    }
    if (node.type === "TemplateStringLiteral") {
        node.templateExpressions.forEach(node => stringifyNode(node, resultCode));
        node.stringified = `(TemplateString  ${node.templateQuasis.map(str => `"${str}"`).join(" ")}) (${node.templateExpressions.map(node => node.stringified).join(" ")})`;
    }
    if (node.type === "VariableDecl") {
        if (node.varValue)
            stringifyNode(node.varValue, resultCode);
        node.stringified = `(Declare ${node.mutability ? "mut" : "immut"} ${node.varName} ${node.varValue ? `${node.varValue.stringified}` : "null"})`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "VariableAssign") {
        stringifyNode(node.varValue, resultCode);
        node.stringified = `(Assign ${node.varName} ${node.varValue.stringified})`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "VariableAssignShorten") {
        stringifyNode(node.varValue, resultCode);
        node.stringified = `(CompoundAssign ${node.operator} ${node.varName} ${node.varValue.stringified})`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "Identifier") {
        node.stringified = node.name;
    }
    if (node.type === "BinaryExpression") {
        stringifyNode(node.left, resultCode);
        stringifyNode(node.right, resultCode);
        node.stringified = `(${node.operator} ${node.left.stringified} ${node.right.stringified})`;
    }
    if (node.type === "RepeatStatement") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `(Repeat ${node.args[0].stringified}`;
        resultCode.openBlock(node.stringified);
        stringifyNode(node.body, resultCode);
        resultCode.addCode(")", 0);
    }
    if (node.type === "Block") {
        resultCode.openBlock("(Block");
        node.body.forEach(node => {
            stringifyNode(node, resultCode);
        });
        resultCode.closeBlock();
        resultCode.addCode(")", 0);
    }
    if (node.type === "McExecStatement") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `(Mc_exec ${node.args[0].stringified}`;
        resultCode.openBlock(node.stringified);
        stringifyNode(node.body, resultCode);
        resultCode.addCode(")", 0);
    }
    // instead of using body, directly iterate over the Block node(body)'s body
    // so all nodes at Program level will be at top level
    if (node.type === "Program") {
        node.stringified = `(Program`;
        resultCode.openBlock(node.stringified);
        stringifyNode(node.body, resultCode);
        resultCode.addCode(")", 0);
    }
}
function lispify(_ast) {
    const ast = { ..._ast };
    const resultCode = new Code("K&R", 2);
    stringifyNode(ast, resultCode);
    return resultCode.getCode();
}
//# sourceMappingURL=lispifyast.js.map