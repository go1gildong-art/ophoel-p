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
    if (node.type === "ChooseStatement") {
        if (node.bodies.length === 1) {
            // if branching doesn't matter because there's only one 
            findCommands(node.bodies[0], targetIr);
        }
        else {
            lowerChoose(node, targetIr);
        }
    }
}
function lowerChoose(node, targetIr) {
    const rngMax = node.weights
        .map(weight => weight.value)
        .reduce((acc, val) => acc + val, 0);
    const setups = [];
    const cleanups = [];
    // redundant parts inside commands
    const near1 = "type=minecraft:marker, sort=nearest, limit=1";
    const chooseVar = `Oph_ChooseVar_d${node.depth}`;
    const chooseRes = `Oph_ChooseRes_d${node.depth}`;
    const chooseMar = `Oph_ChooseMarker_d${node.depth}`;
    const summonMarker = `summon minecraft:marker ~ ~ ~`;
    const sbPlayer = `scoreboard players`;
    // setup commands
    setups.push(`scoreboard objectives add ${chooseVar} dummy`);
    for (let i = 0; i < rngMax; i++) {
        //summon armor stands for random choice
        setups.push(`${summonMarker} {Tags:["${chooseMar}", "Oph_ChooseMarker${i}_d${node.depth}"]}`);
        //assign values for each armor stands(rngBase)
        setups.push(`${sbPlayer} set @e[tag=Oph_ChooseMarker${i}_d${node.depth}, ${near1}] ${chooseVar} ${i}`);
    }
    //summon the armor stand for storing the result
    setups.push(`${summonMarker} {Tags:["${chooseRes}"]}`);
    setups.push(`${sbPlayer} set @e[tag=${chooseRes}, ${near1}] ${chooseVar} 0`);
    //choose one of those armor stands randomly, storing its value into the result(rngResult)
    setups.push(`${sbPlayer} operation @e[tag=${chooseRes}, ${near1}] ${chooseVar} = @e[tag=${chooseMar}, sort=random, limit=1] ${chooseVar}`);
    // cleanup commands
    cleanups.push(`kill @e[tag=${chooseMar}, sort=nearest, limit=${rngMax}]`);
    cleanups.push(`kill @e[tag=${chooseRes}, ${near1}]`);
    cleanups.push(`scoreboard objectives remove ${chooseVar}`);
    // emit setup
    setups.forEach(cmd => {
        var _a, _b;
        const prefix = (_b = (_a = node.prefixes) === null || _a === void 0 ? void 0 : _a.join(" run execute ")) !== null && _b !== void 0 ? _b : "";
        const instr = new Ir.TextEmit([(prefix !== "" ? "execute " + prefix + " run" : ""), cmd].join(" "));
        targetIr.emitInstr(instr);
    });
    // emit bodies BETWEEN setup and cleanup
    let bodyIdx = 0;
    let acc = 0;
    // mini recursive transformer to resolve choose statement templates
    const resolveChoose = (node, transform, data) => {
        if (["McCommand", "ChooseStatement"].includes(node.type)) {
            node.prefixes.forEach((prefix, idx) => {
                if (prefix === `CHOOSE_d${data.id}`) {
                    node.prefixes[idx] = `if score @e[tag=Oph_ChooseRes_d${data.id}, ${near1}] Oph_ChooseVar_d${data.id} matches ${data.idx}`;
                }
            });
        }
        if (["IfStatement", "RepeatStatement", "McExecStatement"].includes(node.type)) {
            transform(node.body, transform, data);
        }
        if (node.type === "ChooseStatement") {
            node.bodies.forEach(node => transform(node, transform, data));
        }
        if (node.type === "Block") {
            node.body.forEach(node => transform(node, transform, data));
        }
    };
    for (let i = 0; i < rngMax; i++) {
        const body = structuredClone(node.bodies[bodyIdx]);
        const depth = node.depth;
        body.body.forEach((node) => resolveChoose(node, resolveChoose, { id: depth, idx: i }));
        findCommands(body, targetIr);
        acc++;
        if (acc >= node.weights[bodyIdx].value) {
            bodyIdx++;
            acc = 0;
        }
        else {
        }
    }
    // emit cleanup
    cleanups.forEach(cmd => {
        var _a, _b;
        const prefix = (_b = (_a = node.prefixes) === null || _a === void 0 ? void 0 : _a.join(" run execute ")) !== null && _b !== void 0 ? _b : "";
        const instr = new Ir.TextEmit([(prefix !== "" ? "execute " + prefix + " run" : ""), cmd].join(" "));
        targetIr.emitInstr(instr);
    });
}
//# sourceMappingURL=irgen.js.map