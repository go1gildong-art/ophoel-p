import { tokenize } from '../compiler/lexer.js';
import { parse } from '../compiler/parser.js';
import { rePrint } from "./printer.js"

const code =
`
/# foo
mc_exec(\`as @e[tag=\${config.room_anchor_tag}, tag=\${config.room_s.tag}]\`) {
/.
/.
// oh cmn pls
let wow = "this_is_string";
let mut foo: int_c = config.room_s.radius;
let mut x = 1;
repeat(4) {
        setblock!!(\`~ ~\${foo} ~ dirt\`);
        say!!(\`\${x}\`);
        /.
        x += 7;
        x = x + 1;
}
        }

`;

const config = { room_anchor_tag: "room_anchor", room_s: { radius: 7, tag: "room_s" } };

export function format(sourceCode, config, fileName) {
    // 1. Raw text to Tokens
    let tokens = tokenize(sourceCode, config, fileName);

    // 2. parse tokens to get string mcfunction output
    let ast = parse(tokens);

    // 3. reconstruct source from ast
    let newSource = rePrint(ast);

    return newSource;
}

// console.log("");
// console.log(tokenize(code, config, "source.oph"));
// console.log(JSON.stringify(parse(tokenize(code, config, "source.oph"))) + "\n");
console.log(format(code, config, "source.oph") + "\n\n");