"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
function generate(ast) {
    const commands = getCommands(ast, []);
    return commands;
}
function getCommands(node) {
    var _a;
    const commands = [];
    commands.push(node.message);
    const deepCommands = (_a = node.body) === null || _a === void 0 ? void 0 : _a.body.map(node => {
        return getCommands(node)
            .filter(msg => msg != null);
    });
    if (deepCommands)
        commands.push(deepCommands);
    return commands.flat(Infinity).map(cmd => cmd === null || cmd === void 0 ? void 0 : cmd.trim());
}
//# sourceMappingURL=generator.js.map