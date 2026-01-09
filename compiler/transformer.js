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
    let ast = { ..._ast };

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
                    console.log(variable.type, node.varValue);
                    throw new OphoelSemanticError(`Type mismatch: Tried to assign ${node.varValue.value}(${node.varValue.valueType}) to ${node.varName}(${variable.type})`, node);
                }

                vars[node.varName].value = node.varValue.value;
                console.log("assigned! " + vars[node.varName].value);
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
        console.log("mccommand");

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

        transformNode(node.varValue);
        ctx.assignVariable(node);
    }

    if (node.type === "Identifier") {
        const variable = ctx.getVariable(node);
        node.value = variable.value;
        console.log("got variable: " + variable.value);
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

        transformNode(node.args[0]);
        node.body = proliferate(BuildAST.Block(node.body, node.location), node.args[0].value);

        for (let nodee of node.body) {
            transformNode(nodee, config);
            console.log(node.body[0].body[0]?.message + " " + node.body[1].body[0]?.message + " " + node.body[2].body[0]?.message)
        }

        console.log(node.body);
        node.body
            .flatMap(node => node.body)
            .filter(node => node.type === "McCommand")
            .forEach(node => console.log("xnrrrrrr" + node.message));
    }

    if (node.type === "Block") {
        ctx.pushNewScope();

        for (const _node of node.body) transformNode(_node, config);
        // node.body.forEach(node => transformNode(node, config));
        ctx.popScope();
    }

    if (node.type === "McExecStatement") {
        transformNode(node.args[0]);
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
