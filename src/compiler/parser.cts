import * as ohm from 'ohm-js';
import * as fs from 'fs';
import { Location } from './metadata.cjs'; // Your existing class
import { ASTCollection } from '../ast/build-ast.cjs'; // Your nodes
import { BinaryOperator } from '../ast/expressions/operations.cjs';

// 1. Load the grammar
const grammarSource = fs.readFileSync('./src/grammar.ohm', 'utf-8');
const myGrammar = ohm.grammar(grammarSource);

// 2. Helper to create your Location object from an Ohm node
function getLoc(node: ohm.Node, fileName: string): Location {
    const { lineNum, colNum } = node.source.getLineAndColumn();
    // node.source.start is the character offset
    return new Location(fileName, lineNum, colNum, node.source.start);
}

// 3. Define Semantics
const semantics = myGrammar.createSemantics().addOperation('toAST(fileName)', {
    Program(statements) {
        return statements.toAST(__filename);
    },

    /*
    InjectStmt(kw, str, _semi) {
        return new InjectNode(
            str.sourceString.replace(/"/g, ''), // clean quotes
            getLoc(kw, __filename)
        );
    },
    */

    AddExp_plus(left, op, right) {
        return new ASTCollection.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.ADD,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    number(digits) {
        return new ASTCollection.IntLiteral(
            parseInt(digits.sourceString).toString(),
            getLoc(digits, __filename)
        );
    },

    // Built-in Ohm iteration handler (for the * in Statement*)
    _iter(...children) {
        return children.map(c => c.toAST(__filename));
    }
});

export function parseDSL(source: string, __filename: string) {
    const match = myGrammar.match(source);
    if (match.failed()) {
        // Ohm provides a detailed error string with line/col automatically
        throw new Error(match.message);
    }
    return semantics(match).toAST(__filename);
}