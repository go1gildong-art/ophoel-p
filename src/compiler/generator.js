

export function generate(ast) {
    const commands = getCommands(ast, []);
    return commands;
}

function getCommands(node) {
    const commands = [];

    commands.push(node.message);

    const deepCommands = node.body?.map(node => {
        return getCommands(node)
        .filter(msg => msg != null);
    });
    if (deepCommands) commands.push(deepCommands);

    return commands.flat(Infinity).map(cmd => cmd?.trim());
}