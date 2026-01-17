"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = transform;
const ast_js_1 = require("./ast.js");
const errors_js_1 = require("../errors.js");
function print(x) {
    // console.log(x);
    return x;
}
function transform(_ast, config) {
    const ast = { ..._ast };
    transformNode(ast, config);
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
        if (this.peek().variables[node.varName])
            throw new errors_js_1.OphoelSemanticError(`Variable ${node.varName} already exists`, node);
        this.peek().variables[node.varName] = {
            type: node.varType,
            value: null,
            mutability: node.mutability
        };
        if (node.varValue != null) {
            this.assignVariable(node);
        }
    }
    assignVariable(node) {
        // reverse to check leaf scope first
        for (const scope of this.scopes.toReversed()) {
            const vars = scope.variables;
            if (vars[node.varName]) {
                const variable = vars[node.varName];
                if (!variable.mutability && variable.value != null) {
                    throw new errors_js_1.OphoelSemanticError(`Variable ${node.varName} is immutable, but tried to mutate`, node);
                }
                deductType(node);
                if (variable.type !== node.varValue.valueType && variable.type !== "deduct") {
                    throw new errors_js_1.OphoelSemanticError(`Type mismatch: Tried to assign ${node.varValue.value}(${node.varValue.valueType}) to ${node.varName}(${variable.type})`, node);
                }
                if (variable.type === "deduct") {
                    variable.type = node.varValue.valueType;
                }
                print(`assigned ${node.varName} = ${node.varValue.value}!`);
                vars[node.varName].value = node.varValue.value;
                return;
            }
        }
        throw new errors_js_1.OphoelSemanticError(`${node.varName} is not declared yet or unreachable`, node);
    }
    getVariable(node) {
        for (let scope of this.scopes.toReversed()) {
            const vars = scope.variables;
            if (vars[node.name]) {
                if (vars[node.name].value == null) {
                    throw new errors_js_1.OphoelSemanticError(`Attempted to access uninitialized variable ${node.name}`, node);
                }
                return vars[node.name];
            }
        }
        throw new errors_js_1.OphoelSemanticError(`${node.name} is not declared yet or unreachable`, node);
    }
    setMcPrefix(prefix) { this.peek().mcPrefix = prefix; }
    getPrefixChain() {
        const prefix = this.scopes
            .map(scope => scope.mcPrefix)
            .filter(prefix => prefix !== "");
        return prefix;
    }
}
let ctx = new Context();
function transformNode(node, config) {
    if (config == undefined)
        print("AAA");
    if (node.type === "McCommand") {
        transformNode(node.args[0], config);
        node.prefixes = ctx.getPrefixChain();
    }
    if (node.type === "PreservedNewline") {
        node.message = "\n";
    }
    if (node.type === "PreservedComment") {
        node.message = node.message.slice(1); // "/# comment" to "# comment"
    }
    if (node.type === "ConfigRef") {
        resolveConfigs(node, config);
        deductType(node);
    }
    if (node.type === "Literal") {
        node.value =
            (node.valueType === "int_c" ? Math.round(Number(node.raw)) :
                node.valueType === "bool" ? Boolean(node.raw) :
                    node.valueType === "string" ? String(node.raw) : node.raw);
    }
    if (node.type === "TemplateStringLiteral") {
        if (node.type === "TemplateStringLiteral") {
            const components = [];
            node.templateExpressions.forEach(node => transformNode(node, config));
            for (let i = 0; i < node.templateQuasis.length - 1; i++) {
                components.push(node.templateQuasis[i]);
                components.push(node.templateExpressions[i].value);
            }
            // pull out the last TEMPLATE_TAIL of the quasis
            components.push(node.templateQuasis[node.templateQuasis.length - 1]);
            node.value = components.join("");
        }
    }
    if (node.type === "VariableDecl") {
        if (node.varValue != null)
            transformNode(node.varValue, config);
        ctx.declareVariable(node);
    }
    if (node.type === "VariableAssign") {
        transformNode(node.varValue, config);
        ctx.assignVariable(node);
    }
    if (node.type === "VariableAssignShorten") {
        node.varValue = ast_js_1.BuildAST.BinaryExpression(node.operator, ast_js_1.BuildAST.Identifier(node.varName, node.location), node.varValue, false, node.location);
        transformNode(node.varValue, config);
        print(node.varValue);
        ctx.assignVariable(node);
    }
    if (node.type === "Identifier") {
        deductType(node);
        const variable = ctx.getVariable(node);
        node.value = variable.value;
        node.valueType = variable.type;
    }
    if (node.type === "BinaryExpression") {
        transformNode(node.left, config);
        transformNode(node.right, config);
        if (node.left.valueType === node.right.valueType) {
            node.valueType = node.left.valueType;
        }
        else {
            throw new errors_js_1.OphoelSemanticError(`Type mismatch: tried to perform ${node.operator} operation between ${node.left.value}(${node.left.valueType}) and ${node.right.value}(${node.right.valueType})`, node);
        }
        let result;
        switch (node.operator) {
            case "+":
                result = node.left.value + node.right.value;
                break;
            case "-":
                result = node.left.value - node.right.value;
                break;
            case "*":
                result = node.left.value * node.right.value;
                break;
            case "/":
                result = node.left.value / node.right.value;
                break;
            case "%":
                result = node.left.value % node.right.value;
                break;
            case ">":
                result = node.left.value > node.right.value;
                break;
            case "<":
                result = node.left.value % node.right.value;
                break;
            case "==":
                result = node.left.value === node.right.value && node.left.valueType === node.right.valueType;
                break;
            default:
                throw new errors_js_1.OphoelSemanticError(`Undefined operator ${node.operator}`, node);
        }
        node.value = (typeof result === "number") ? Math.round(result) : result;
    }
    if (node.type === "RepeatStatement") {
        const proliferate = (obj, count) => {
            const arr = [];
            for (let i = 0; i < count; i++)
                arr.push(structuredClone(obj));
            return arr;
        };
        transformNode(node.args[0], config);
        node.body = ast_js_1.BuildAST.Block(proliferate(node.body, node.args[0].value), node.location);
        transformNode(node.body, config);
    }
    if (node.type === "Block") {
        ctx.pushNewScope();
        for (const _node of node.body)
            transformNode(_node, config);
        // node.body.forEach(node => transformNode(node, config));
        ctx.popScope();
    }
    if (node.type === "McExecStatement") {
        transformNode(node.args[0], config);
        const prefix = node.args[0].value;
        ctx.setMcPrefix(prefix);
        transformNode(node.body, config);
    }
    if (node.type === "IfStatement") {
        transformNode(node.args[0], config);
        console.log(node.args[0]);
        if (node.args[0].value === true) {
            transformNode(node.body, config);
        }
        else {
            node.body = ast_js_1.BuildAST.Block([], node.location);
        }
    }
    // place lower than statement check to avoid recursion
    if (node.type === "Program") {
        transformNode(node.body, config);
    }
}
function resolveConfigs(node, config) {
    let configElement = config;
    let accumulated = [];
    // slice out the "config" at front
    let access = node.access.slice(6);
    accumulated.push("config");
    while (access.length > 0) {
        // if matches .field syntax
        if (access.match(/^\.[A-Za-z_][A-Za-z0-9_]*/)) {
            const field = access.match(/^\.[A-Za-z_][A-Za-z0-9_]*/)[0];
            configElement = configElement[field.slice(1)];
            if (configElement == undefined) {
                throw new errors_js_1.OphoelSemanticError(`Invalid field ${field} inside ${accumulated.join("")}`, node);
            }
            access = access.slice(field.length);
            accumulated.push(field);
            continue;
        }
        // if matches [index] syntax
        if (access.match(/^\[\d+\]/)) {
            const index = access.match(/^\[\d+\]/)[0];
            configElement = configElement[Number(index.slice(1, index.length - 1))];
            if (configElement == undefined) {
                throw new errors_js_1.OphoelSemanticError(`Invalid index ${index} inside ${accumulated.join("")}`, node);
            }
            access = access.slice(index.length);
            accumulated.push(index);
            continue;
        }
        // if matches [variable] syntax
        if (access.match(/^\[[A-Za-z_][A-Za-z0-9_]*]/)) {
            const rawName = access.match(/^\[[A-Za-z_][A-Za-z0-9_]*]/)[0];
            const variable = ctx.getVariable({ name: rawName.slice(1, rawName.length - 1) }).value;
            if (configElement.length <= variable) {
                throw new errors_js_1.OphoelSemanticError(`dynamic field ${rawName.slice(1, rawName.length - 1)}(${variable}) exceeds max length of ${accumulated.join("")}(length: ${configElement.length})`, node);
            }
            configElement = configElement[variable];
            if (configElement == undefined) {
                throw new errors_js_1.OphoelSemanticError(`Invalid dynamic field ${variable}(${rawName}) inside ${accumulated.join("")}`, node);
            }
            access = access.slice(rawName.length);
            accumulated.push(rawName);
            continue;
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
//# sourceMappingURL=transformer.js.map