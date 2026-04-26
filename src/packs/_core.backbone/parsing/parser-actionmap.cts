import { Node } from "ohm-js";
import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';




export const actionMap: ActionMap<Statement | any[]> = {
    Program(this: ActionMapThis, statements, _end) {
        const path = this.args.ophoelDir
        const statementList = statements.toAST(path);
        return new ASTs.Program(statementList, getLoc(statements, path));
    },
    Block(this: ActionMapThis, _open, statements, _close) {
        const statementList = statements.toAST(this.args.ophoelDir);
        return new ASTs.Block(statementList, getLoc(_open, this.args.ophoelDir));
    },
    ExecExpr(this: ActionMapThis, expr, _semi) {
        return new ASTs.ExecExpr(expr.toAST(this.args.ophoelDir), getLoc(expr, this.args.ophoelDir))
    },

    YieldExpr(this: ActionMapThis, expr, _semi) {
        return new ASTs.YieldExpr(expr.toAST(this.args.ophoelDir), getLoc(expr, this.args.ophoelDir))
    },

    // Built-in Ohm iteration handler (for the * in Statement*)
    _iter(this: ActionMapThis, ...children) {
        return children.map(c => c.toAST(this.args.ophoelDir));
    },

    ListOf(this: ActionMapThis, list) {
        return list.toAST(this.args.ophoelDir);
    },
    NonemptyListOf(this: ActionMapThis, first, _sep, rest) {
        // 'first' is one node, 'rest' is an IterationNode of the remaining nodes
        return [first.toAST(this.args.ophoelDir), ...rest.toAST(this.args.ophoelDir)];
    },
    EmptyListOf(this: ActionMapThis) {
        return [];
    }
};