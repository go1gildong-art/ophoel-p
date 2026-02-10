export class IR {
  constructor() {
    this.instructions = [];
  }

  emitInstr(instr) {
    this.instructions.push(instr);
  }
}

export class Instruction {
  constructor(kind) {
    this.kind = kind;
  }

  toString() {}
}


export class Comment extends Instruction {
  constructor(content) {
    super("Comment");
    this.content = content;
  }
}


export class TextEmit extends Instruction {
  constructor(content) {
    super("TextEmit");
    this.content = content;
  }
}

export class Jump extends Instruction {
  constructor(target) {
    super("Jump");
    this.target = target;
  }
}

export class IfJump extends Instruction {
  constructor(ifTarget, elseTarget) {
    super("IfJump");
    this.ifTarget = ifTarget;
    this.elseTarget = elseTarget;
  }
}

export class Wait extends Instruction {
  constructor(duration) {
    super("Wait");
    this.duration = duration;
  }
}

export class Register extends Instruction {
  constructor(name, value) {
    super("Register");
    this.name = name;
    this.value = value;
  }
}

export class Label extends Instruction {
  constructor(name) {
    super("Label");
    this.name = name;
  }
}
