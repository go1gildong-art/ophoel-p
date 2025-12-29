function makeNode(type, location) {
    return { type, location };
}

export class Location {
    constructor(fileName, line, tokenIdx = null) {
        this.fileName = fileName;
        this.line = line;
        this.tokenIdx = tokenIdx;
    }
}

export const AST = {
    // 1. Statements (top level items)
    Program: (body) => ({ type: 'Program', body }),

    VariableDecl: (varType, name, value, location) => ({
        ...makeNode('VariableDecl', location),
        varType,
        name,
        value
    }),

    McCommand: (command, args, location) => {
        // console.log("parsed mccommand!");
        return ({
            ...makeNode('McCommand', location),
            command,
            args
        });
    },

    // 2. Expressions (nested math/logic)
    BinaryExpression: (operator, left, right, location) => ({
        ...makeNode("BinaryExpression", location),
        operator, // +-*/
        left, // node
        right // node
    }),

    Literal: (value, raw, location) => {
        // console.log("parsed literal!");
        return ({
            ...makeNode('Literal', location),
            value, // actual value
            raw // string source
        });
    },

    TemplateStringLiteral: (quasis, exprs, location) => ({
        ...makeNode('TemplateStringLiteral', location),
        quasis, // array of strings
        exprs // array of expressions, go between quasis strings
    }),

    Identifier: (name, location) => ({
        ...makeNode('Identifier', location),
        name
    }),

    // 3. Control flows & Macro invocations
    RepeatStatement: (count, block, location) => ({
        ...makeNode("RepeatStatement", location),
        count,
        block
    }),

    McExecStatement: (prefix, block, location) => ({
        ...makeNode("McExecStatement", location),
        prefix,
        block
    })
}