

export function generate(ir) {
    const commands = ir.instructions
    .map(instr => generate_OphoelVm(instr))
    .filter(line => line != null);
    return commands;
}

function generate_OphoelVm(instr) {
    if (instr.kind === "TextEmit") {
        return instr.content;
    }

    if (instr.kind === "Comment") {
        return instr.content;
    }
}