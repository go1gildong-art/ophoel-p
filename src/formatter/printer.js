import { tokenize } from "../compiler/lexer.js";
import { parse } from "../compiler/parser.js";
import { AST } from "../compiler/ast.js";


function print(x) {
    console.log(x);
    return x;
}
class OphoelSemanticError extends Error {
    constructor(msg, node) {
        return new Error(msg + ` at ${node?.location?.fileName}:${node?.location?.line}, ${node?.location?.tokenIdx}`);
    }
};

export function transform(_ast, config) {
    const ast = { ..._ast };


    stringifyNode(ast, config);

    // print(JSON.stringify(ast));
    return ast;
}

class Context {
    constructor() { this.scopes = []; }

    pushNewScope() {
        this.scopes.push({
            variables: {},
            mcPrefix: ""
        });
    }

    popScope() { this.scopes.pop(); }

    peek() { return this.scopes[this.scopes.length - 1]; }

    declareVariable(node) {
        if (this.peek().variables[node.varName]) throw new OphoelSemanticError(`Variable ${node.varName} already exists`, node);

        this.peek().variables[node.varName] = {
            type: node.varType,
            value: null,
            mutability: node.mutability
        };
    }

    assignVariable(node) {
        // reverse to check leaf scope first
        for (const scope of this.scopes.toReversed()) {
            const vars = scope.variables;
            if (vars[node.varName]) {
                const variable = vars[node.varName];

                if (!variable.mutability && variable.value != null) {
                    throw new OphoelSemanticError(`Variable ${node.varName} is immutable, but tried to mutate`, node);
                }

                deductType(node);
                if (variable.type !== node.varValue.valueType && variable.type !== "deduct") {
                    throw new OphoelSemanticError(`Type mismatch: Tried to assign ${node.varValue.value}(${node.varValue.valueType}) to ${node.varName}(${variable.type})`, node);
                }

                if (variable.type === "deduct") {
                    variable.type = node.varValue.valueType;
                }

                vars[node.varName].value = node.varValue.value;
                return;
            }
        }

        throw new OphoelSemanticError(`${node.varName} is not declared yet or unreachable`, node);
    }

    getVariable(node) {
        for (let scope of this.scopes.toReversed()) {
            const vars = scope.variables;
            if (vars[node.name]) {
                if (vars[node.name].value == null) {
                    throw new OphoelSemanticError(`Attempted to access uninitialized variable ${node.varName}`, node);
                }
                return vars[node.name];
            }
        }

        throw new OphoelSemanticError(`${node.varName} is not declared yet or unreachable`, node);
    }

    setMcPrefix(prefix) { this.peek().mcPrefix = prefix; }

    getPrefixChain() {
        const prefix = this.scopes
            .map(scope => scope.mcPrefix)
            .filter(prefix => prefix !== "")
            .join(" run execute ");

        return (prefix !== "") ? ("execute " + prefix + " run") : "";
    }
}
let ctx = new Context();

class Code {
    constructor(braceStyle, indentSpaces) {
        this.lines = [];
        this.depth = 0;

        this.braceStyle = braceStyle;
        this.indentSpaces = indentSpaces;
    }

    addLn(ln) {
        this.addCode(ln);
        this.newLine();
    }

    newLine() { this.lines.push("\n"); }

    addCode(ln) { this.lines.push(" ".repeat(this.depth * this.indentSpaces) + ln); }

    openBlock(code) { this.depth += 1; this.addLn(code + " {"); }
    closeBlock() { this.depth -= 1; this.addLn("}"); }
}
let resultCode = new Code("K&R", 2);

function stringifyNode(node) {

    if (node.type === "McCommand") {
        resultCode.addLn(``);
    }

    if (node.type === "PreservedNewline") {
        resultCode.addLn(`\n`);
    }

    if (node.type === "ConfigRef") {
        node.stringified = node.access;
    }

    if (node.type === "Literal") {
        if (node.valueType === "string") node.stringified = `"${node.raw}"`;
    }

    if (node.type === "TemplateStringLiteral") {
        const components = [];
        node.templateExpressions.forEach(node => stringifyNode(node, config));

        components.push("`");
        for (let i = 0; i < node.templateQuasis.length - 1; i++) {
            components.push(node.templateQuasis[i]);
            components.push("${");
            components.push(node.templateExpressions[i].raw);
            components.push("}");
        }

        // pull out the last TEMPLATE_TAIL of the quasis
        components.push(node.templateQuasis[node.templateQuasis.length - 1]);
        components.push("`");
        node.stringified = components.join("");
    }

    if (node.type === "VariableDecl") {
        node.stringified = `let ${node.mutability ? "mut " : ""} ${node.varName}`
    }

    if (node.type === "VariableAssign") {

        stringifyNode(node.varValue, config);
        ctx.assignVariable(node);
    }

    if (node.type === "Identifier") {
        node.stringified = node.name;
    }

    if (node.type === "BinaryExpression") {
        stringifyNode(node.left, config);
        stringifyNode(node.right, config);

        if (node.left.valueType === node.right.valueType) {
            node.valueType = node.left.valueType;
        } else {
            throw new OphoelSemanticError(`Type mismatch: tried to perform ${node.operator} operation between ${node.left.value}(${node.left.valueType}) and ${node.right.value}(${node.right.valueType})`, node);
        }


        node.value = (typeof result === "number") ? Math.round(result) : result;
    }

    if (node.type === "RepeatStatement") {
        const proliferate = (obj, count) => {
            const arr = [];
            for (let i = 0; i < count; i++) arr.push(structuredClone(obj));
            return arr;
        }

        stringifyNode(node.args[0], config);
        node.body = proliferate(BuildAST.Block(node.body, node.location), node.args[0].value);

        for (let nodee of node.body) {
            stringifyNode(nodee, config);
        }

        node.body
            .flatMap(node => node.body)
            .filter(node => node.type === "McCommand")
    }

    if (node.type === "Block") {
        ctx.pushNewScope();

        for (const _node of node.body) stringifyNode(_node, config);
        // node.body.forEach(node => stringifyNode(node, config));
        ctx.popScope();
    }

    if (node.type === "McExecStatement") {
        stringifyNode(node.args[0], config);
        const prefix = node.args[0].value;
        ctx.setMcPrefix(prefix);

        ctx.pushNewScope();
        node.body.forEach(node => stringifyNode(node, config));
        ctx.popScope();
    }

    // place lower than statement check to avoid recursion
    if (node.type === "Program") {
        ctx.pushNewScope();
        node.body.forEach(node => {
            stringifyNode(node, config);
        });
        ctx.popScope();
    }
}

function resolveConfigs(node, config) {

    let configElement = { ...config };

    // slice out the "config" at front
    let access = node.access.slice(6);
    while (access.length > 0) {
        // if matches .field syntax
        if (access.match(/^\.[A-Za-z_][A-Za-z0-9_]*/)) {
            const field = access.match(/^\.[A-Za-z_][A-Za-z0-9_]*/)[0];
            configElement = configElement[field.slice(1)];
            access = access.slice(field.length);
        }

        // if matches [index] syntax
        if (access.match(/^\[\d+\]/)) {
            const index = access.match(/^\[\d+\]/)[0];
            configElement = configElement[Number(index.slice(1, index.length - 1))];
            access = access.slice(index.length);
        }
    }
    node.value = configElement;
}

function deductType(node) {

    // if type is predefined
    if (["int_c", "bool", "string"].includes(node.valueType)) {
        return;
    }

    switch (typeof node.value) {
        case "string":
            node.valueType = "string";

        case "number":
            node.valueType = "int_c";

        case "boolean":
            node.valueTyep = "bool";
    }
}