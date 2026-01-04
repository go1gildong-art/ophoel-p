import { AST, Location } from "./ast.js";

class OphoelSemanticError extends Error {
    constructor(msg, node) {
        return new Error(msg + ` at ${node?.location.fileName}:${node?.location.line}, ${node?.location.tokenIdx}`);
    }
};

export function transform(_ast, config) {
    let ast = { ..._ast };
    // console.log(JSON.stringify(ast) + "\n");

    ast = borrowCheck(ast);
    // console.log(JSON.stringify(ast) + "\n");

    ast = resolveConfigs(ast, config);
    // console.log(JSON.stringify(ast) + "\n");

    ast = evaluateValues(ast);
    // console.log(JSON.stringify(ast) + "\n");

    ast = unrollConstRepeat(ast);
    // console.log(JSON.stringify(ast) + "\n");

    ast = unrollMcExec(ast);

    return ast;
}

function affectRecursively(node, transformation, args = []) {
    if (node == null) return
    if (node.type === "Literal") return node;
    // goes recursive by structures
    node.varBody = node.varBody?.map(node => transformation(node, ...args));
    node.args = node.args?.map(node => transformation(node, ...args));
    node.body = node.body?.map(node => transformation(node, ...args));
    node.templateExpressions = node.templateExpressions?.map(node => transformation(node, ...args));

    node.varValue = transformation(node.varValue, ...args);
    node.left = transformation(node.left, ...args);
    node.right = transformation(node.right, ...args);

    return node;
}

// dummy data
function borrowCheck(node) {
    return node;
}

function resolveConfigs(node, config) {
    if (node == null) return;
    if (node.type === "Literal") return node;

    if (node.type === "ConfigRef") {
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

    node = affectRecursively(node, resolveConfigs, [config]);

    return node;
}

// evaluate expressions and turn them into literal values
// recursively effect all nodes under
// also will resolve all compile time variables (technically constants)
function evaluateValues(node, _ctx = { variables: {} }) {
    if (node == null) return;
    const ctx = { ..._ctx };

    if (node.type === "Literal") {
        node.value =
            (node.valueType === "int_c" ? Math.round(Number(node.raw)) :
                node.valueType === "bool" ? Boolean(node.raw) :
                    node.valueType === "string" ? String(node.raw) : node.raw);
    }


    if (node.type === "VariableDecl") {
        node.varValue = evaluateValues(node.varValue, ctx);
        ctx.variables[node.varName] = { type: node.varType, value: node.varValue.value };
    }

    if (node.type === "Identifier") {
        node.value = ctx.variables[node.name].value;
        node.varType = ctx.variables[node.name].type;
    }

    if (node.type === "TemplateStringLiteral") {
        const components = [];
        node.templateExpressions = node.templateExpressions.map(node => evaluateValues(node, ctx));
        while (node.templateQuasis.length > 0 && node.templateExpressions.length > 0) {
            components.push(node.templateQuasis.splice(0, 1)[0]);
            components.push(node.templateExpressions.splice(0, 1)[0].value);
        }
        // pull out the last TEMPLATE_TAIL of the quasis
        components.push(node.templateQuasis.splice(0, 1)[0]);
        node.value = components.join("");
    }

    if (node.type === "BinaryExpression") {
        node.left = evaluateValues(node.left, ctx);
        node.right = evaluateValues(node.right, ctx);
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

    // goes recursive by structures
    node = affectRecursively(node, evaluateValues, [ctx]);

    return node;
}

// unrolls all repeat(){} structure, if the arg is constant (literal or int_c variable)
function unrollConstRepeat(node) {
    if (node == null) return;
    if (node.type === "Literal") return node;

    // helper function to create an array of repeating element
    const proliferate = (element, count) => {
        const arr = [];
        for (let i = 0; i < count; i++) arr.push(element);
        return arr;
    }

    // helper function to check if a value is constant integer
    const isConstant = (inputNode) => {
        if (inputNode.valueType === "int_c"
            && Number.isInteger(inputNode.value)
            && inputNode.value > 0)
            return true;

        throw new OphoelSemanticError(`Invalid argument ${inputNode.type}:${inputNode.valueType} for repeat statement`, inputNode);
    }

    if (node.type === "RepeatStatement") {
        if (isConstant(node.args[0])) {
            const count = node.args[0].value;
            node.body = proliferate(node.body, count).flat(1);
        }
    }

    node = affectRecursively(node, unrollConstRepeat);

    return node;
}

// unrolls all mc_exec(){} structure, 
// applying the prefix to every individual mc_command
function unrollMcExec(node) {
    if (node == null) return;
    if (node.type === "Literal") return node;

    if (node.type === "McExecStatement") {
        const prefix = node.args[0].value;
        node.body.forEach(node => {
            if (node.type === "McCommand") {
                node.prefixes = (node.prefixes == null) ? [] : node.prefixes; 
                node.prefixes.unshift(prefix);
            }
        });
    }

    node = affectRecursively(node, unrollMcExec);

    return node;
}
