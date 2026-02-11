"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = transform;
const ast_js_1 = require("./ast.js");
const errors_js_1 = require("../errors.js");
function print(x) {
    // console.log(x);
    return x;
}
function deepEqual(a, b) {
    if (a === b)
        return true; // same reference or primitive
    if (typeof a !== "object" || a === null)
        return false;
    if (typeof b !== "object" || b === null)
        return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length)
        return false;
    for (let key of keysA) {
        if (!keysB.includes(key))
            return false;
        if (!deepEqual(a[key], b[key]))
            return false;
    }
    return true;
}
function transform(_ast, config) {
    const ast = { ..._ast };
    transformNode(ast, config);
    // print(JSON.stringify(ast));
    return ast;
}
class Context {
    constructor() { this.scopes = []; this.queuedPrefix = ""; }
    pushNewScope() {
        this.scopes.push({
            variables: {},
            mcPrefix: ""
        });
        if (this.queuedPrefix !== "") {
            this.peek().mcPrefix = this.queuedPrefix;
            this.queuedPrefix = "";
        }
    }
    popScope() { this.scopes.pop(); }
    peek() { return this.scopes[this.scopes.length - 1]; }
    getDepth() { return this.scopes.length; }
    declareVariable(node) {
        if (this.peek().variables[node.varName])
            throw new errors_js_1.OphoelSemanticError(`Variable ${node.varName} already exists`, node);
        this.peek().variables[node.varName] = {
            valueType: ast_js_1.BuildAST.ValueType(node.varType),
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
            if (vars[node.varName] != null) {
                let baseVariable = structuredClone(vars[node.varName]);
                let variable = vars[node.varName];
                if (node.type === "VariableDecl") {
                }
                else if (["VariableAssign", "VariableAssignShorten"].includes(node.type)) {
                    let varAccess = node.varAddress;
                    while (true) {
                        if (varAccess.type === "Identifier") {
                            if (node.varAddress.name === node.varName) {
                                break;
                            }
                        }
                        else if (varAccess.type === "IndexAccess") {
                            if (variable.value[varAccess.index.value] != null) {
                                variable = variable.value[varAccess.index.value];
                                varAccess = varAccess.index;
                            }
                            else {
                                throw new errors_js_1.OphoelSemanticError(`invalid index ${node.varAddress.index.value} for array/struct ${node.varName}`, node);
                            }
                        }
                        else if (varAccess.type === "Literal") {
                            break;
                        }
                    }
                }
                else {
                }
                if (!baseVariable.mutability && variable.value != null) {
                    throw new errors_js_1.OphoelSemanticError(`Variable ${node.varName} is immutable, but tried to mutate`, node);
                }
                deductType(node.varValue);
                if (variable.valueType.kind !== node.varValue.valueType.kind && variable.valueType.kind !== "deduct") {
                    throw new errors_js_1.OphoelSemanticError(`Type mismatch: Tried to assign ${node.varValue.value}(${node.varValue.valueType.kind}) to ${node.varName}(${variable.valueType.kind})`, node);
                }
                if (variable.type === "deduct") {
                    variable.type = node.varValue.valueType;
                }
                print(`assigned ${node.varName} = ${node.varValue.value}!`);
                variable.value = node.varValue.value;
                variable.valueType = node.varValue.valueType;
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
    appendMcPrefix(prefix) { this.queuedPrefix = prefix; }
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
    if (node.type === "ArrayLiteral") {
        node.elements.forEach(el => transformNode(el, config));
        for (let i = 0; i < node.elements.length, i++;) {
            if (!deepEqual(node.elements[0].valueType, node.elements[i].valueType)) {
                throw new errors_js_1.OphoelSemanticError(`Heterogenous array detected`, node);
            }
        }
        node.value = node.elements.map(el => el.value);
        node.valueType = ast_js_1.BuildAST.ValueType("array", { elementType: node.elements[0].valueType });
    }
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
    if (node.type === "VariableDecl") {
        if (node.varValue != null)
            transformNode(node.varValue, config);
        ctx.declareVariable(node);
    }
    if (node.type === "VariableAssign") {
        transformNode(node.varValue, config);
        transformNode(node.varAddress, config);
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
        node.valueType = variable.valueType;
    }
    if (node.type === "BinaryExpression") {
        transformNode(node.left, config);
        transformNode(node.right, config);
        if (node.operator === "==") {
            node.valueType.kind = "bool";
        }
        else {
            if (node.left.valueType.kind === node.right.valueType.kind) {
                node.valueType = node.left.valueType;
            }
            else {
                throw new errors_js_1.OphoelSemanticError(`Type mismatch: tried to perform ${node.operator} operation between ${node.left.value}(${node.left.valueType.kind}) and ${node.right.value}(${node.right.valueType.kind})`, node);
            }
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
                if (node.right.value === 0) {
                    throw new errors_js_1.OphoelSemanticError(`Division by 0`, node);
                }
                result = node.left.value / node.right.value;
                break;
            case "%":
                result = node.left.value % node.right.value;
                break;
            case ">":
                result = node.left.value > node.right.value;
                break;
            case "<":
                result = node.left.value < node.right.value;
                break;
            case "==":
                result = node.left.value === node.right.value && node.left.valueType === node.right.valueType;
                break;
            default:
                throw new errors_js_1.OphoelSemanticError(`Undefined operator ${node.operator}`, node);
        }
        node.value = (typeof result === "number") ? Math.round(result) : result;
    }
    if (node.type === "IndexAccess") {
        transformNode(node.left, config);
        transformNode(node.index, config);
        if (node.left.valueType.kind === "array") {
            if (node.index.value >= node.left.value.length) {
                throw new errors_js_1.OphoelSemanticError(`Array out of bound! tried to access ${node.index.value}th for an array of length ${node.left.value.length}`, node);
            }
            node.value = node.left.value[node.index.value].value;
            node.valueType = node.left.value[node.index.value].valueType;
            console.log("node.value: " + node.value);
            console.log("node.valueType: " + node.valueType);
        }
        else {
            throw new errors_js_1.OphoelSemanticError(`Cannot access property ${node.index.value} of value ${node.left.value}`, node);
        }
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
        ctx.appendMcPrefix(prefix);
        transformNode(node.body, config);
    }
    if (node.type === "IfStatement") {
        transformNode(node.args[0], config);
        if (node.args[0].value === true) {
            transformNode(node.body, config);
        }
        else {
            node.body = ast_js_1.BuildAST.Block([], node.location);
        }
    }
    if (node.type === "ChooseStatement") {
        node.prefixes = ctx.getPrefixChain();
        node.depth = ctx.getDepth();
        node.weights.forEach(weight => {
            transformNode(weight, config);
            if (weight.valueType !== "int_c") {
                throw new errors_js_1.OphoelSemanticError(`Choose weight must be an int_c but got ${weight.valueType}(${weight.value})`, node);
            }
            if (weight.value < 1) {
                throw new errors_js_1.OphoelSemanticError(`Choose weight must be one or more but got ${weight.value}`, node);
            }
        });
        node.bodies.forEach((block, i) => {
            ctx.appendMcPrefix(`CHOOSE_d${node.depth}`);
            transformNode(block, config);
        });
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
    var _a;
    // if type is predefined
    if (["int_c", "bool", "string"].includes((_a = node.valueType) === null || _a === void 0 ? void 0 : _a.kind)) {
        return;
    }
    switch (typeof node.value) {
        case "string":
            node.valueType.kind = "string";
            break;
        case "number":
            node.valueType.kind = "int_c";
            break;
        case "boolean":
            node.valueType.kind = "bool";
            break;
    }
    if (Array.isArray(node.value))
        node.valueType.kind = "array";
}
//# sourceMappingURL=transformer.js.map