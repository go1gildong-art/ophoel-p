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
exports.parseDSL = parseDSL;
const ohm = __importStar(require("ohm-js"));
const fs = __importStar(require("fs"));
const metadata_cjs_1 = require("./metadata.cjs"); // Your existing class
// 1. Load the grammar
const grammarSource = fs.readFileSync('./src/grammar.ohm', 'utf-8');
const myGrammar = ohm.grammar(grammarSource);
// 2. Helper to create your Location object from an Ohm node
function getLoc(node, fileName) {
    const { lineNum, colNum } = node.source.getLineAndColumn();
    // node.source.start is the character offset
    return new metadata_cjs_1.Location(fileName, lineNum, colNum, node.source.start);
}
// 3. Define Semantics
const semantics = myGrammar.createSemantics().addOperation('toAST(fileName)', {
    Program(statements) {
        return statements.toAST(fileName);
    },
    InjectStmt(kw, str, _semi) {
        return new InjectNode(str.sourceString.replace(/"/g, ''), // clean quotes
        getLoc(kw, fileName));
    },
    AddExp_plus(left, op, right) {
        return new BinaryOperation(left.toAST(fileName), "+", right.toAST(fileName), getLoc(op, fileName));
    },
    number(digits) {
        return new LiteralNode(parseInt(digits.sourceString), getLoc(digits, fileName));
    },
    // Built-in Ohm iteration handler (for the * in Statement*)
    _iter(...children) {
        return children.map(c => c.toAST(fileName));
    }
});
function parseDSL(source, fileName) {
    const match = myGrammar.match(source);
    if (match.failed()) {
        // Ohm provides a detailed error string with line/col automatically
        throw new Error(match.message);
    }
    return semantics(match).toAST(fileName);
}
//# sourceMappingURL=parser.js.map