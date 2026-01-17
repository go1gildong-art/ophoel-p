"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rePrint = rePrint;
const lexer_js_1 = require("../compiler/lexer.js");
const parser_js_1 = require("../compiler/parser.js");
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
        if (this.braceStyle === "K&R") {
            this.addLn(code + " {", 0);
        }
        else if (this.braceStyle === "Allman") {
            this.addLn(code, 0);
            this.addLn("{");
        }
        this.depth += 1;
    }
    closeBlock() { this.depth -= 1; this.addLn("}"); }
    getCode() { return this.lines.join(""); }
}
function stringifyNode(node, resultCode) {
    if (node.type === "McCommand") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `${node.command}!!(${node.args[0].stringified});`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "PreservedNewline") {
        node.stringified = "/.";
        resultCode.addLn(node.stringified);
    }
    if (node.type === "PreservedComment") {
        node.stringified = node.message;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "Comment") {
        node.stringified = node.commentMessage;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "ConfigRef") {
        node.stringified = node.access;
    }
    if (node.type === "Literal") {
        node.stringified = (node.valueType === "string") ? `"${node.raw}"` : node.raw;
    }
    if (node.type === "TemplateStringLiteral") {
        const components = [];
        node.templateExpressions.forEach(node => stringifyNode(node, resultCode));
        components.push("`");
        for (let i = 0; i < node.templateQuasis.length - 1; i++) {
            components.push(node.templateQuasis[i]);
            components.push("${");
            components.push(node.templateExpressions[i].stringified);
            components.push("}");
        }
        // pull out the last TEMPLATE_TAIL of the quasis
        components.push(node.templateQuasis[node.templateQuasis.length - 1]);
        components.push("`");
        node.stringified = components.join("");
    }
    if (node.type === "VariableDecl") {
        if (node.varValue)
            stringifyNode(node.varValue, resultCode);
        node.stringified = `let ${node.mutability ? "mut " : ""}${node.varName}${node.varType !== "deduct" ? `: ${node.varType}` : ""} ${node.varValue ? `= ${node.varValue.stringified}` : ""};`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "VariableAssign") {
        stringifyNode(node.varValue, resultCode);
        node.stringified = `${node.varName} = ${node.varValue.stringified};`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "VariableAssignShorten") {
        stringifyNode(node.varValue, resultCode);
        node.stringified = `${node.varName} ${node.operator}= ${node.varValue.stringified};`;
        resultCode.addLn(node.stringified);
    }
    if (node.type === "Identifier") {
        node.stringified = node.name;
    }
    if (node.type === "BinaryExpression") {
        stringifyNode(node.left, resultCode);
        stringifyNode(node.right, resultCode);
        node.stringified = `${node.left.stringified} ${node.operator} ${node.right.stringified}`;
    }
    if (node.type === "RepeatStatement") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `repeat(${node.args[0].stringified})`;
        resultCode.addCode(node.stringified);
        stringifyNode(node.body, resultCode);
    }
    if (node.type === "Block") {
        resultCode.openBlock("");
        node.body.forEach(node => {
            stringifyNode(node, resultCode);
        });
        resultCode.closeBlock();
    }
    if (node.type === "McExecStatement") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `mc_exec(${node.args[0].stringified})`;
        resultCode.addCode(node.stringified);
        stringifyNode(node.body, resultCode);
    }
    if (node.type === "IfStatement") {
        stringifyNode(node.args[0], resultCode);
        node.stringified = `if(${node.args[0].stringified})`;
        resultCode.addCode(node.stringified);
        stringifyNode(node.body, resultCode);
    }
    // instead of using body, directly iterate over the Block node(body)'s body
    // so all nodes at Program level will be at top level
    if (node.type === "Program") {
        node.body.body.forEach(node => {
            stringifyNode(node, resultCode);
        });
    }
}
function rePrint(_ast) {
    const ast = { ..._ast };
    const resultCode = new Code("K&R", 2);
    stringifyNode(ast, resultCode);
    return resultCode.getCode();
}
//# sourceMappingURL=printer.js.map