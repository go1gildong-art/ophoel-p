import fs from 'fs';
import { tokenize } from './lexer.js';
// import { expandMacros } from './macroProcessor.js';
// import { emitCommands } from './emitter.js';

// Load Configs
const config = JSON.parse(fs.readFileSync('./configs.json', 'utf8'));

let code = `mc_exec!
// this line is a comment. null true false give string int_s

give!!("@p diamond 2");
string my_zombie = "[type=zombie]";

mc_exec! ("as @e\${my_zombie} at @s run") {
    summon!!("lightning");
}

repeat! (10) {
    say!!("this repeats 10 times!");
}

string from_config = config.test;
say!!("content from config: \${from_config}");
`;


function compile(sourceCode) {
    // 1. Raw text to Tokens
    let tokens = tokenize(sourceCode, config);

    /*
    // 2. Handle repeat! and mc_exec! (The Alpha "Brain")
    let expandedTokens = expandMacros(tokens);

    // 3. Turn tokens into final Minecraft strings
    let output = emitCommands(expandedTokens);

    fs.writeFileSync('./output.mcfunction', output);
    console.log("Ophoel: Compilation successful.");
    */

    console.log(tokens);
    console.log("ran");
}

compile(code);