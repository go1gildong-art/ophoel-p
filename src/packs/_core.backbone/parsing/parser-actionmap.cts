import { Node } from "ohm-js";
import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser/parser.cjs";
import * as ohm from 'ohm-js';




export const actionMap: ActionMap<Statement | any[]> = {
    Program(statements, _end) {
        const statementList = statements.toAST(__filename);
        return new ASTs.Program(statementList, getLoc(statements, __filename));
    },
    Block(_open, statements, _close) {
        const statementList = statements.toAST(__filename);
        return new ASTs.Block(statementList, getLoc(_open, __filename));
    },
    ExecExpr(expr, _semi) {
        return new ASTs.ExecExpr(expr.toAST(__filename), getLoc(expr, __filename))
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
    }
};