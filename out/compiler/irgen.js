"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIr = makeIr;
const Ir = __importStar(require("./ir.js"));
function makeIr(ast) {
    const ir = new Ir.IR();
    findCommands(ast, ir);
    return ir;
}
function findCommands(node, targetIr) {
    if (node.type === "McCommand") {
        const prefix = node.prefixes.join(" run execute ");
        const instr = new Ir.TextEmit([(prefix !== "" ? "execute " + prefix + " run" : ""), node.command, node.args[0].value].join(" "));
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
        for (const _node of node.body)
            findCommands(_node, targetIr);
    }
    if (["IfStatement", "McExecStatement", "RepeatStatement", "Program"].includes(node.type)) {
        findCommands(node.body, targetIr);
    }
}
//# sourceMappingURL=irgen.js.map