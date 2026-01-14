import * as Ir from "./ir.js";

export function makeIr(ast) {
  const ir = new Ir.IR();
  findCommands(ast, ir);
  return ir;
}

function findCommands(node, targetIr) {
  if (node.type === "McCommand") {
    const prefix = node.prefixes.join(" run execute ");
    const instr = new Ir.TextEmit( [(prefix !== "" ? "execute " + prefix + " run" : ""), node.command, node.args[0].value].join(" ") );
    targetIr.emitInstr(instr);
  }

  if (node.type === "PreservedComment") {
    const instr = new Ir.Comment(node.message);
    targetIr.emitInstr(instr);
  }

  if (node.type === "PreservedNewline") {
    const instr = new Ir.Comment("");
    targetIr.emitInstr(instr);
  }

  if (node.type === "Block") {
    for (const _node of node.body) findCommands(_node, targetIr);
  }

  if (["McExecStatement", "RepeatStatement", "Program"].includes(node.type)) {
    findCommands(node.body, targetIr);
  }
}