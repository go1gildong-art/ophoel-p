import { tokenize } from '../compiler/lexer.js';
import { parse } from '../compiler/parser.js';
import { rePrint } from "./printer.js"
import { OphoelParseError } from "../errors.js";

const code =
`
choose {
say!!("1");
} or {
say!!("2");
} or {
say!!("3");
}
`;

const config = { room_anchor_tag: "room_anchor", room_s: { radius: 7, tag: "room_s" } };

export function format(sourceCode, config, fileName) {
  try {
    console.log("eeeeeeeeeeeEEEEEEEEEEE");
    // 1. Raw text to Tokens
    let tokens = tokenize(sourceCode, config, fileName);

    // 2. parse tokens to get ast
    let ast = parse(tokens);

    // 3. reconstruct source from ast
    let newSource = rePrint(ast);
    return newSource;

  } catch (err) {
    if (err instanceof OphoelParseError) {
      console.error("formatting failed due to parse error: " + err.message);
      return sourceCode;
    }

    throw err;
  }
}

// console.log("");
// console.log(tokenize(code, config, "source.oph"));
// console.log(JSON.stringify(parse(tokenize(code, config, "source.oph"))) + "\n");
console.log(format(code, config, "source.oph") + "\n\n");