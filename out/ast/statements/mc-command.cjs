"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McCommand = void 0;
class McCommand {
    constructor(command, argument, location) {
        this.command = command;
        this.argument = argument;
        this.location = location;
        this.kind = "McCommand";
    }
}
exports.McCommand = McCommand;
//# sourceMappingURL=mc-command.cjs.map