import { AST, BuildAST, Location } from "./ast.js";

function print(x) {
    console.log(x);
    return x;
}
class OphoelSemanticError extends Error {
    constructor(msg, node) {
        return new Error(msg + ` at ${node?.location.fileName}:${node?.location.line}, ${node?.location.tokenIdx}`);
    }
};

export function transform(_ast, config) {
    const ast = { ..._ast };

    console.log("got config: " + JSON.stringify(config));

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

                if (!variable.mutability && !node.declares) {
                    throw new OphoelSemanticError(`Variable ${node.varName} is immutable, but tried to mutate`, node);
                }
                if (variable.type !== node.varValue.valueType) {
                    throw new OphoelSemanticError(`Type mismatch: Tried to assign ${node.varValue.value}(${node.varValue.valueType}) to ${node.varName}(${variable.type})`, node);
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

function transformNode(node, config) {

    if (node.type === "McCommand") {
        transformNode(node.args[0], config);

        node.message = [ctx.getPrefixChain(), node.command, node.args[0].value].join(" ");
    }

    if (node.type === "ConfigRef") {
        resolveConfigs(node, config);
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
        ctx.declareVariable(node);
    }

    if (node.type === "VariableAssign") {

        transformNode(node.varValue, config);
        ctx.assignVariable(node);
    }

    if (node.type === "Identifier") {
        const variable = ctx.getVariable(node);
        node.value = variable.value;
        node.valueType = variable.type;
    }

    if (node.type === "BinaryExpression") {
        transformNode(node.left, config);
        transformNode(node.right, config);

        if (node.left.valueType === node.right.valueType) {
            node.valueType = node.left.valueType;
        } else {
            throw new OphoelSemanticError(`Type mismatch: tried to perform ${node.operator} operation between ${node.left.value}(${node.left.valueType}) and ${node.right.value}(${node.right.valueType})`, node);
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

            default:
                throw new OphoelSemanticError(`Undefined operator ${node.operator}`, node);
        }

        node.value = (typeof result === "number") ? Math.round(result) : result;
    }

    if (node.type === "RepeatStatement") {
        const proliferate = (obj, count) => {
            const arr = [];
            for (let i = 0; i < count; i++) arr.push(structuredClone(obj));
            return arr;
        }

        transformNode(node.args[0], config);
        node.body = proliferate(BuildAST.Block(node.body, node.location), node.args[0].value);

        for (let nodee of node.body) {
            transformNode(nodee, config);
        }

        node.body
            .flatMap(node => node.body)
            .filter(node => node.type === "McCommand")
    }

    if (node.type === "Block") {
        ctx.pushNewScope();

        for (const _node of node.body) transformNode(_node, config);
        // node.body.forEach(node => transformNode(node, config));
        ctx.popScope();
    }

    if (node.type === "McExecStatement") {
        transformNode(node.args[0], config);
        const prefix = node.args[0].value;
        ctx.setMcPrefix(prefix);

        ctx.pushNewScope();
        node.body.forEach(node => transformNode(node, config));
        ctx.popScope();
    }

    // place lower than statement check to avoid recursion
    if (node.type === "Program") {
        ctx.pushNewScope();
        node.body.forEach(node => {
            transformNode(node, config);
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
