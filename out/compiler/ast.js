"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.BuildAST = exports.Comment = exports.PreservedNewline = exports.PreservedComment = exports.IfStatement = exports.McExecStatement = exports.RepeatStatement = exports.ConfigRef = exports.Identifier = exports.TemplateStringLiteral = exports.JsonValue = exports.Literal = exports.BinaryExpression = exports.McCommand = exports.VariableAssignShorten = exports.VariableAssign = exports.VariableDecl = exports.Block = exports.Program = exports.AST = void 0;
class AST {
    constructor(type, location) {
        this.type = type;
        this.location = location;
    }
}
exports.AST = AST;
class Program extends AST {
    constructor(body, location) {
        super("Program", location);
        this.body = body;
    }
}
exports.Program = Program;
class Block extends AST {
    constructor(body, location) {
        super("Block", location);
        this.body = body;
    }
}
exports.Block = Block;
class VariableDecl extends AST {
    constructor(varType, varName, mutability, varValue, location) {
        super("VariableDecl", location);
        this.varType = varType;
        this.varName = varName;
        this.mutability = mutability;
        this.varValue = varValue;
    }
}
exports.VariableDecl = VariableDecl;
class VariableAssign extends AST {
    constructor(varName, varValue, location) {
        super("VariableAssign", location);
        this.varName = varName;
        this.varValue = varValue;
    }
}
exports.VariableAssign = VariableAssign;
class VariableAssignShorten extends AST {
    constructor(varName, varValue, operator, location) {
        super("VariableAssignShorten", location);
        this.varName = varName;
        this.varValue = varValue;
        this.operator = operator;
    }
}
exports.VariableAssignShorten = VariableAssignShorten;
class McCommand extends AST {
    constructor(command, args, location) {
        super("McCommand", location);
        this.command = command;
        this.args = args;
    }
}
exports.McCommand = McCommand;
class BinaryExpression extends AST {
    constructor(operator, left, right, hasParenthesis, location) {
        super("BinaryExpression", location);
        this.left = left;
        this.right = right;
        this.hasParenthesis = hasParenthesis;
        this.operator = operator;
        this.value = null;
    }
}
exports.BinaryExpression = BinaryExpression;
class Literal extends AST {
    constructor(valueType, raw, location) {
        super("Literal", location);
        this.valueType = valueType;
        this.raw = raw;
        this.value = null;
    }
}
exports.Literal = Literal;
class JsonValue extends AST {
    constructor(raw, location) {
        super("JsonValue", location);
        this.raw = raw;
    }
}
exports.JsonValue = JsonValue;
class TemplateStringLiteral extends AST {
    constructor(templateQuasis, templateExpressions, raw, location) {
        super("TemplateStringLiteral", location);
        this.templateQuasis = templateQuasis;
        this.templateExpressions = templateExpressions;
        this.raw = raw;
        this.value = null;
    }
}
exports.TemplateStringLiteral = TemplateStringLiteral;
class Identifier extends AST {
    constructor(name, location) {
        super("Identifier", location);
        this.name = name;
        this.value = null;
        this.valueType = null;
    }
}
exports.Identifier = Identifier;
class ConfigRef extends AST {
    constructor(access, location) {
        super("ConfigRef", location);
        this.access = access;
        this.value = null;
        this.valueType = null;
    }
}
exports.ConfigRef = ConfigRef;
class RepeatStatement extends AST {
    constructor(args, body, location) {
        super("RepeatStatement", location);
        this.args = args;
        this.body = exports.BuildAST.Block(body, location);
    }
}
exports.RepeatStatement = RepeatStatement;
class McExecStatement extends AST {
    constructor(args, body, location) {
        super("McExecStatement", location);
        this.args = args;
        this.body = exports.BuildAST.Block(body, location);
    }
}
exports.McExecStatement = McExecStatement;
class IfStatement extends AST {
    constructor(args, body, location) {
        super("IfStatement", location);
        this.args = args;
        this.body = exports.BuildAST.Block(body, location);
    }
}
exports.IfStatement = IfStatement;
class PreservedComment extends AST {
    constructor(message, location) {
        super("PreservedComment", location);
        this.message = message;
    }
}
exports.PreservedComment = PreservedComment;
class PreservedNewline extends AST {
    constructor(location) {
        super("PreservedNewline", location);
        this.message = "\n";
    }
}
exports.PreservedNewline = PreservedNewline;
class Comment extends AST {
    constructor(commentMessage, location) {
        super("Comment", location);
        this.commentMessage = commentMessage;
    }
}
exports.Comment = Comment;
exports.BuildAST = {
    // 1. Statements (top level items)
    Program: (body, location) => new Program(body, location),
    Block: (body, location) => new Block(body, location),
    VariableDecl: (varType, varName, mutability, varValue, location) => new VariableDecl(varType, varName, mutability, varValue, location),
    VariableAssign: (varName, varValue, location) => new VariableAssign(varName, varValue, location),
    VariableAssignShorten: (varName, varValue, operator, location) => new VariableAssignShorten(varName, varValue, operator, location),
    McCommand: (command, args, location) => new McCommand(command, args, location),
    // 2. Expressions
    BinaryExpression: (operator, left, right, hasParenthesis, location) => new BinaryExpression(operator, left, right, hasParenthesis, location),
    Literal: (valueType, raw, location) => new Literal(valueType, raw, location),
    TemplateStringLiteral: (templateQuasis, templateExpressions, raw, location) => new TemplateStringLiteral(templateQuasis, templateExpressions, raw, location),
    Identifier: (name, location) => new Identifier(name, location),
    ConfigRef: (access, location) => new ConfigRef(access, location),
    // 3. Control flows & Macro invocations
    RepeatStatement: (args, body, location) => new RepeatStatement(args, body, location),
    McExecStatement: (args, body, location) => new McExecStatement(args, body, location),
    IfStatement: (args, body, location) => new IfStatement(args, body, location),
    // 4. Preserved comments
    PreservedComment: (message, location) => new PreservedComment(message, location),
    PreservedNewline: (message, location) => new PreservedNewline(message, location),
    Comment: (commentMessage, location) => new Comment(commentMessage, location),
};
class Location {
    constructor(fileName, line, tokenIdx = null) {
        this.fileName = fileName;
        this.line = line;
        this.tokenIdx = tokenIdx;
    }
}
exports.Location = Location;
//# sourceMappingURL=ast.js.map