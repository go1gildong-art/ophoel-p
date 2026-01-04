

export function generate(ast) {
    const commands = getCommands(ast, []);
    return commands;
}

function getCommands(node) {
    const commands = [];

    if (node.type === "McCommand") {
        console.log("synthesizing..");
        let synthesized = "";
        if ((node.prefixes?.length ?? 0) === 0) {
            synthesized = "";
        } else {
            synthesized = "execute " + node.prefixes.join(" run execute ") + " run";
        }

        commands.push([synthesized, node.command, node.args[0].value].join(" "));
    }

    if (node.type === "PreservedComment") {
        // remove /# and switch to #
        console.log("preserved...");
        commands.push(node.message.slice(1));
    }

    const deepCommands = node.body?.map(node => generate(node, commands));
    if (deepCommands) commands.push(deepCommands);

    return commands.flat(Infinity).map(cmd => cmd.trim());
}