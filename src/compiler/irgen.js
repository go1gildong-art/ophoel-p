import * as Ir from "./ir.js";

export function makeIr(ast) {
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
    for (const _node of node.body) findCommands(_node, targetIr);
  }

  if (["IfStatement", "McExecStatement", "RepeatStatement", "Program"].includes(node.type)) {
    findCommands(node.body, targetIr);
  }

  if (node.type === "ChooseStatement") {

    if (node.bodies.length === 1) {
      // if branching doesn't matter because there's only one 
      findCommands(node.bodies[0], targetIr);

    } else {
      lowerChoose(node, targetIr);
    }
  }
}

function lowerChoose(node, targetIr) {
  const rngMax = node.bodies.length;
  const setups = [];
  const cleanups = [];

  // redundant parts on commands
  const near1 = "sort=nearest, limit=1"
  const chooseVar = `Oph_ChooseVar_d${node.depth}`;
  const chooseRes = `Oph_ChooseRes_d${node.depth}`;
  const chooseMar = `Oph_ChooseMarker_d${node.depth}`;
  const summonMarker = `summon minecraft:marker ~ ~ ~`
  const sbPlayer = `scoreboard players`

  // setup commands
  setups.push(`scoreboard objectives add ${chooseVar} dummy`);
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
    const prefix = node.prefixes.join(" run execute ");
    const instr = new Ir.TextEmit([(prefix !== "" ? "execute " + prefix + " run" : ""), cmd].join(" "));
    targetIr.emitInstr(instr);
  });
  // emit bodies BETWEEN setup and cleanup
  node.bodies.forEach(block => findCommands(block, targetIr));
  // emit cleanup
  cleanups.forEach(cmd => {
    const prefix = node.prefixes.join(" run execute ");
    const instr = new Ir.TextEmit([(prefix !== "" ? "execute " + prefix + " run" : ""), cmd].join(" "));
    targetIr.emitInstr(instr);
  });
}