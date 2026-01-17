"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = exports.Register = exports.Wait = exports.IfJump = exports.Jump = exports.TextEmit = exports.Comment = exports.Instruction = exports.IR = void 0;
class IR {
    constructor() {
        this.instructions = [];
    }
    emitInstr(instr) {
        this.instructions.push(instr);
    }
}
exports.IR = IR;
class Instruction {
    constructor(kind) {
        this.kind = kind;
    }
    toString() { }
}
exports.Instruction = Instruction;
class Comment extends Instruction {
    constructor(content) {
        super("Comment");
        this.content = content;
    }
}
exports.Comment = Comment;
class TextEmit extends Instruction {
    constructor(content) {
        super("TextEmit");
        this.content = content;
    }
}
exports.TextEmit = TextEmit;
class Jump extends Instruction {
    constructor(target) {
        super("Jump");
        this.target = target;
    }
}
exports.Jump = Jump;
class IfJump extends Instruction {
    constructor(ifTarget, elseTarget) {
        super("IfJump");
        this.ifTarget = ifTarget;
        this.elseTarget = elseTarget;
    }
}
exports.IfJump = IfJump;
class Wait extends Instruction {
    constructor(duration) {
        super("Wait");
        this.duration = duration;
    }
}
exports.Wait = Wait;
class Register extends Instruction {
    constructor(name, value) {
        super("Register");
        this.name = name;
        this.value = value;
    }
}
exports.Register = Register;
class Label extends Instruction {
    constructor(name) {
        super("Label");
        this.name = name;
    }
}
exports.Label = Label;
//# sourceMappingURL=ir.js.map