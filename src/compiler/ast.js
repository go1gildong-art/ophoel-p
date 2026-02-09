export class AST {
    constructor(type, location) {
        this.type = type;
        this.location = location;
    }
}

export class Program extends AST {
    constructor(body, location) {
        super("Program", location);
        this.body = body;
    }
}

export class Block extends AST {
    constructor(body, location) {
        super("Block", location);
        this.body = body;
    }
}


export class StructField extends AST {
    constructor(name, valueType, mutability, defaultValue, location) {
        super("StructField", location);
        this.name = name;
        this.valueType = valueType;
        this.mutability = mutability;
        this.defaultValue = defaultValue;
    }
}

export class StructDeclaration extends AST {
    constructor(name, fields, location) {
        super("StructDeclaration", location);
        this.name = name;
        this.fields = fields;
    }
}


export class TypedParameter extends AST {
    constructor(varType, varName, location) {
        super("TypedParameter", location);
        this.varType = varType;
        this.varName = varName;
    }
}

export class MacroDef extends AST {
    constructor(name, args, valueType, body, location) {
        super("MacroDef", location);
        this.name = name;
        this.args = args;
        this.valueType = valueType;
        this.body = body;
    }
}

export class VariableDecl extends AST {
    constructor(varType, varName, mutability, varValue, location) {
        super("VariableDecl", location);
        this.varType = varType;
        this.varName = varName;
        this.mutability = mutability;
        this.varValue = varValue;
    }
}



export class VariableAssign extends AST {
    constructor(varName, varAddress, varValue, location) {
        super("VariableAssign", location);
        this.varName = varName;
        this.varAddress = varAddress
        this.varValue = varValue;
    }
}

export class VariableAssignShorten extends AST {
    constructor(varName, varAddress, varValue, operator, location) {
        super("VariableAssignShorten", location);
        this.varName = varName;
        this.varAddress = varAddress;
        this.varValue = varValue;
        this.operator = operator;
    }
}



export class McCommand extends AST {
    constructor(command, args, location) {
        super("McCommand", location);
        this.command = command;
        this.args = args;
    }
}


export class ValueType extends AST {
    constructor(kind, options = {}, location) {
        super("ValueType", location);
        this.kind = kind;
        this.options = options;
    }
}
export class BinaryExpression extends AST {
    constructor(operator, left, right, hasParenthesis, location) {
        super("BinaryExpression", location);
        this.left = left;
        this.right = right;
        this.hasParenthesis = hasParenthesis;
        this.operator = operator;
        this.value = null;
    }
}

export class MemberAccess extends AST {
    constructor(left, key, location) {
        super("MemberAccess", location);
        this.left = left;
        this.key = key;
    }
}


export class IndexAccess extends AST {
    constructor(left, index, location) {
        super("IndexAccess", location);
        this.left = left;
        this.index = index;
    }
}

export class ArrayLiteral extends AST {
    constructor(elements, location) {
        super("ArrayLiteral", location),
            this.elements = elements;
    }
}

export class Literal extends AST {
    constructor(valueType, raw, location) {
        super("Literal", location);
        this.valueType = BuildAST.ValueType(valueType);
        this.raw = raw;
        this.value = null;
    }
}

export class JsonValue extends AST {
    constructor(raw, location) {
        super("JsonValue", location);
        this.raw = raw;
    }
}

export class TemplateStringLiteral extends AST {
    constructor(templateQuasis, templateExpressions, raw, location) {
        super("TemplateStringLiteral", location);
        this.templateQuasis = templateQuasis;
        this.templateExpressions = templateExpressions;
        this.raw = raw;
        this.value = null;
    }
}

export class Identifier extends AST {
    constructor(name, location) {
        super("Identifier", location);
        this.name = name;
        this.value = null;
        this.valueType = null;
    }
}

export class ConfigRef extends AST {
    constructor(access, location) {
        super("ConfigRef", location);
        this.access = access;
        this.value = null;
        this.valueType = null;
    }
}

export class RepeatStatement extends AST {
    constructor(args, body, location) {
        super("RepeatStatement", location);
        this.args = args;
        this.body = BuildAST.Block(body, location);
    }
}

export class McExecStatement extends AST {
    constructor(args, body, location) {
        super("McExecStatement", location);
        this.args = args;
        this.body = BuildAST.Block(body, location);
    }
}

export class IfStatement extends AST {
    constructor(args, body, location) {
        super("IfStatement", location);
        this.args = args;
        this.body = BuildAST.Block(body, location);
    }
}

export class ChooseStatement extends AST {
    constructor(bodies, weights, location) {
        super("ChooseStatement", location);
        this.bodies = bodies.map(body => BuildAST.Block(body, location));
        this.weights = weights,
            this.prefixes = null; // to manage choose setups and cleanups
        this.depth = null; // to avoid clashes upon nested choose statements
    }
}

export class PreservedComment extends AST {
    constructor(message, location) {
        super("PreservedComment", location);
        this.message = message;
    }
}

export class PreservedNewline extends AST {
    constructor(location) {
        super("PreservedNewline", location);
        this.message = "\n";
    }
}

export class Comment extends AST {
    constructor(commentMessage, location) {
        super("Comment", location);
        this.commentMessage = commentMessage;
    }
}

export const BuildAST = {
    // 1. Statements (top level items)
    Program: (body, location) =>
        new Program(body, location),

    Block: (body, location) =>
        new Block(body, location),

    TypedParameter: (varType, varName, location) =>
        new TypedParameter(varType, varName, location),

    StructDeclaration: (name, fields, location) =>
        new StructDeclaration(name, fields, location),

    ArrayLiteral: (elements, location) =>
        new ArrayLiteral(elements, location),

    MemberAccess: (left, key, location) =>
        new MemberAccess(left, key, location),

    IndexAccess: (left, index, location) =>
        new IndexAccess(left, index, location),

    VariableDecl: (varType, varName, mutability, varValue, location) =>
        new VariableDecl(varType, varName, mutability, varValue, location),

    VariableAssign: (varName, varAddress, varValue, location) =>
        new VariableAssign(varName, varAddress, varValue, location),

    VariableAssignShorten: (varName, varAddress, varValue, operator, location) =>
        new VariableAssignShorten(varName, varAddress, varValue, operator, location),

    McCommand: (command, args, location) =>
        new McCommand(command, args, location),

    // 2. Expressions
    ValueType: (kind, options, location) => 
        new ValueType(kind, options, location),

    BinaryExpression: (operator, left, right, hasParenthesis, location) =>
        new BinaryExpression(operator, left, right, hasParenthesis, location),

    Literal: (valueType, raw, location) =>
        new Literal(valueType, raw, location),

    TemplateStringLiteral: (templateQuasis, templateExpressions, raw, location) =>
        new TemplateStringLiteral(
            templateQuasis,
            templateExpressions,
            raw,
            location
        ),

    Identifier: (name, location) =>
        new Identifier(name, location),

    ConfigRef: (access, location) =>
        new ConfigRef(access, location),

    // 3. Control flows & Macro invocations
    RepeatStatement: (args, body, location) =>
        new RepeatStatement(args, body, location),

    McExecStatement: (args, body, location) =>
        new McExecStatement(args, body, location),

    IfStatement: (args, body, location) =>
        new IfStatement(args, body, location),

    ChooseStatement: (bodies, weights, location) =>
        new ChooseStatement(bodies, weights, location),

    // 4. Preserved comments
    PreservedComment: (message, location) =>
        new PreservedComment(message, location),

    PreservedNewline: (message, location) =>
        new PreservedNewline(message, location),

    Comment: (commentMessage, location) =>
        new Comment(commentMessage, location),
};

export class Location {
    constructor(fileName, line, tokenIdx = null) {
        this.fileName = fileName;
        this.line = line;
        this.tokenIdx = tokenIdx;
    }
}
