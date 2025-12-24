import fs from 'fs';
import { tokenize } from './lexer.js';
import { parse } from './parser.js';
// import { expandMacros } from './macroProcessor.js';
// import { emitCommands } from './emitter.js';

// Load Configs
const config = JSON.parse(fs.readFileSync('./configs.json', 'utf8'));

let code = `
// this line is a comment. null true false give string int_s null
give!!("@p diamond 2");
string my_zombie = "[type=zombie]";

mc_exec! ("as @e\${my_zombie} at @s") {
    summon!!("lightning");
}

repeat! (10) {
    say!!("this repeats 10 times!");
}

int_c foo = 10;
bool bar = true;
string from_config = config.test;
say!!("content from config: \${from_config}");
`;


function compile(sourceCode) {
    // 1. Raw text to Tokens
    let tokens = tokenize(sourceCode, config);
    console.log(tokens);

    // 2. parse tokens
    let commands = parse(tokens, config).join("\n");

    /*
    fs.writeFileSync('./output.mcfunction', output);
    console.log("Ophoel: Compilation successful.");
    */

    
    console.log(commands);
}

compile(code);