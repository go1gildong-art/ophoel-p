import * as ohm from 'ohm-js';
import * as path from 'path';
import * as fs from 'fs';
import { Location } from './metadata.cjs'; // Your existing class
import { ASTs } from '../ast/ast-collection.cjs'; // Your nodes
import { BinaryOperator } from '../ast/expressions/operations.cjs';
import { McCommand } from '../ast/statements/mc-command.cjs';
import { ExecuteExpression } from '../ast/statements/execute-expr.cjs';

// 1. Load the grammar
// This builds an absolute path regardless of where you run the command from
// We go up from 'out/' to the root, then into 'src/compiler/'
const grammarPath = path.join(__dirname, '..', '..', 'src', 'compiler', 'grammar.ohm');

const grammarSource = fs.readFileSync('./src/compiler/grammar.ohm', 'utf-8');
const myGrammar = ohm.grammar(grammarSource);

// 2. Helper to create your Location object from an Ohm node
function getLoc(node: ohm.Node, fileName: string): Location {
    const { lineNum, colNum } = node.source.getLineAndColumn();
    // node.source.start is the character offset
    return new Location(fileName, lineNum, colNum, node.source.startIdx);
}

// 3. Define Semantics
const semantics = myGrammar.createSemantics().addOperation('toAST(fileName)', {
    Program(statements) {
        return statements.toAST(__filename);
    },

    
    InjectStmt(kw, str, _semi) {
        return new McCommand(
            "foo",
            str.toAST(__filename),
            getLoc(kw, __filename)
        );
    },

    McCommand(cmd, _dbang, arg, _semi) {
        return new McCommand(
            cmd.sourceString,
            arg.toAST(__filename),
            getLoc(cmd, __filename)
        );
    },
    
    string(_openQuote, chars, _closeQuote) {
        // .sourceString gives you the raw text of the characters rule
        return new ASTs.StringLiteral(
            chars.sourceString,
            getLoc(chars, __filename)
        );
    },

    // If you have a 'number' rule, you'll need this too:
    number(digits) {
        return new ASTs.IntLiteral(
            parseInt(digits.sourceString).toString(),
            getLoc(digits, __filename)
        );
    },

    AddExp_plus(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.ADD,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    ExecExpr(expr, _semi) {
        return new ASTs.ExecuteExpression(
            expr.toAST(__filename),
            getLoc(expr, __filename)
        );
    },

    // Built-in Ohm iteration handler (for the * in Statement*)
    _iter(...children) {
        return children.map(c => c.toAST(__filename));
    }
});

export function parse(source: string, __filename: string) {
    const match = myGrammar.match(source);
    if (match.failed()) {
        // Ohm provides a detailed error string with line/col automatically
        throw new Error(match.message);
    }
    return semantics(match).toAST(__filename);
}