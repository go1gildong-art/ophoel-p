import * as ohm from 'ohm-js';
import * as path from 'path';
import * as fs from 'fs';
import { Location } from './metadata.cjs'; // Your existing class
import { ASTs, ASTTypes } from '../ast/ast-collection.cjs'; // Your nodes
import { BinaryOperator, UnaryOperator } from '../ast/expressions/operations.cjs';
import { McCommand } from '../ast/statements/mc-command.cjs';
import { ExecuteExpression } from '../ast/statements/execute-expr.cjs';
import { Expression } from '../ast/ast.cjs';

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

    Program(statements, _end) {
        const statementList = statements.toAST(__filename);

        return new ASTs.Program(
            statementList,
            getLoc(this, __filename)
        )


        return statements.toAST(__filename);
    },

    McCommand(cmd, _dbang, arg, _semi) {
        return new McCommand(
            cmd.sourceString,
            arg.toAST(__filename),
            getLoc(cmd, __filename)
        );
    },

    VariableDecl(kw, name, _eq, expr, _semi) {
        return new ASTs.VariableDecl(
            name.sourceString,
            expr.toAST(__filename),
            getLoc(kw, __filename)
        );
    },

    ConstDecl(kw, name, _eq, expr, _semi) {
        return new ASTs.ConstDecl(
            name.sourceString,
            expr.toAST(__filename),
            getLoc(kw, __filename)
        );
    },


    string(_openQuote, chars, _closeQuote) {
        // .sourceString gives you the raw text of the characters rule
        return new ASTs.StringLiteral(
            chars.sourceString,
            getLoc(chars, __filename)
        );
    },

    TemplateString(_open, parts, _close) {
        const contents = parts.toAST(__filename);
        return new ASTs.TemplateStringLiteral(
            contents.filter((_: any, i: number) => i % 2 === 0), // even index = quasis
            contents.filter((_: any, i: number) => i % 2 !== 0), // odd index = expressions
            parts.sourceString,
            getLoc(_open, __filename)
        );
    },

    TemplatePart_exprPart(_open, expr, _close) {
        return expr.toAST(__filename);
    },

    TemplatePart_stringPart(chars) {
        return chars.sourceString;
    },

    number(digits) {
        return new ASTs.IntLiteral(
            parseInt(digits.sourceString).toString(),
            getLoc(digits, __filename)
        );
    },

    bool(bool) {
        return new ASTs.BoolLiteral(bool.sourceString, getLoc(bool, __filename));
    },

    ident(_first, _rest) {
        return new ASTs.Identifier(this.sourceString, getLoc(this, __filename));
    },

    VectorLiteral(_open, components, _close) {
        const comps = components.toAST(__filename);
        return new ASTs.VectorLiteral(comps, getLoc(this, __filename));
    },

    Pair(key, _colon, value) {
        return {
            key: key.sourceString,
            value: value.toAST(__filename)
        };
    },

    CompoundLiteral(_open, pairs, _close) {
        type KVAccumulator = { keys: string[]; values: Expression[] };
        type KVPair = { key: string, value: Expression };

        const kvAcc: KVAccumulator
            = pairs.toAST(__filename).reduce((acc: KVAccumulator, kvPair: KVPair) => {
                acc.keys.push(kvPair.key);
                acc.values.push(kvPair.value);
                return acc
            }
                , { keys: [], values: [] });

        return new ASTs.CompoundLiteral(kvAcc.keys, kvAcc.values, getLoc(this, __filename));
    },

    FunctionCall(name, _open, args, _close) {
        const argsList = args.toAST(__filename);
        return new ASTs.FunctionCall(
            name.sourceString,
            argsList,
            getLoc(this, __filename)
        );
    },

    MacroCall(name, _bang, _open, args, _close) {
        const argsList = args.toAST(__filename);
        return new ASTs.MacroCall(
            name.sourceString,
            argsList,
            getLoc(this, __filename)
        );
    },

    OrExp_or(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_OR,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    OrExp(left) {
        return left.toAST(__filename);
    },

    AndExp_and(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_AND,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    AndExp(left) {
        return left.toAST(__filename);
    },

    CompareExp_eq(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_IS,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_neq(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_IS_NOT,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_gte(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_SLARGER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_lte(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_SSMALLER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_gt(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_LARGER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_lt(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_SMALLER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp(left) {
        return left.toAST(__filename);
    },

    AddExp_plus(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.ADD,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    AddExp_minus(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.SUBTRACT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    AddExp(left) {
        return left.toAST(__filename);
    },

    MulExp_multiply(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.MULTIPLY,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    MulExp_divide(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.DIVIDE,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    MulExp_remainder(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.REMAINDER,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    MulExp(left) {
        return left.toAST(__filename);
    },

    UnaryExp_preIncrement(op, right) {
        return new ASTs.PreUnary(
            UnaryOperator.INCREMENT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    UnaryExp_preDecrement(op, right) {
        return new ASTs.PreUnary(
            UnaryOperator.DECREMENT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    UnaryExp_preNot(op, right) {
        return new ASTs.PreUnary(
            UnaryOperator.LOGIC_NOT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    UnaryExp(left) {
        return left.toAST(__filename);
    },

    PostUnaryExp_postIncrement(left, op) {
        return new ASTs.PostUnary(
            UnaryOperator.INCREMENT,
            left.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    PostUnaryExp_postDecrement(left, op) {
        return new ASTs.PostUnary(
            UnaryOperator.DECREMENT,
            left.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    PostUnaryExp(left) {
        return left.toAST(__filename);
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
    },

    ListOf(list) {
        return list.toAST(__filename);
    },
    NonemptyListOf(first, _sep, rest) {
        // 'first' is one node, 'rest' is an IterationNode of the remaining nodes
        return [first.toAST(__filename), ...rest.toAST(__filename)];
    },
    EmptyListOf() {
        return [];
    },


    _terminal() {
        return this.sourceString;
    }
});

export function parse({ source, __filename }: { source: string; __filename: string }): ASTTypes["Program"] {
    const match = myGrammar.match(source);
    if (match.failed()) {
        // Ohm provides a detailed error string with line/col automatically
        throw new Error(match.message);
    }
    return semantics(match).toAST(__filename);
}