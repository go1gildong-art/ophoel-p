function makeNode(type, location) {
    return { type, location };
}

export const AST = {
    // 1. Statements (top level items)
    Program: (body) => ({ type: 'Program', body }),

    VariableDecl: (varType, varName, varValue, location) => ({
        ...makeNode('VariableDecl', location),
        varType,
        varName,
        varValue
    }),

    McCommand: (command, args, location) => ({
        ...makeNode('McCommand', location),
        command,
        args
    }),

    // 2. Expressions (nested math / logic)
    BinaryExpression: (operator, left, right, location) => ({
        ...makeNode("BinaryExpression", location),
        operator, // +-*/
        left, // node
        right // node
    }),

    Literal: (value, raw, location) => ({
        ...makeNode('Literal', location),
        value, // actual value
        raw // string source
    }),

    Identifier: (name, location) => ({
        ...makeNode('Identifier', location),
        name
    })
}