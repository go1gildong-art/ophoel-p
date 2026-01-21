"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
const lexer_js_1 = require("../compiler/lexer.js");
const parser_js_1 = require("../compiler/parser.js");
const printer_js_1 = require("./printer.js");
const errors_js_1 = require("../errors.js");
const code = `
choose {
say!!("1");
} or(2) {
say!!("2");
} or(3) {
say!!("3");
}
`;
const config = { room_anchor_tag: "room_anchor", room_s: { radius: 7, tag: "room_s" } };
function format(sourceCode, config, fileName) {
    try {
        console.log("eeeeeeeeeeeEEEEEEEEEEE");
        // 1. Raw text to Tokens
        let tokens = (0, lexer_js_1.tokenize)(sourceCode, config, fileName);
        // 2. parse tokens to get ast
        let ast = (0, parser_js_1.parse)(tokens);
        // 3. reconstruct source from ast
        let newSource = (0, printer_js_1.rePrint)(ast);
        return newSource;
    }
    catch (err) {
        if (err instanceof errors_js_1.OphoelParseError) {
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
//# sourceMappingURL=formatter.js.map