import { ASTs } from "../../../ast/ast-collection.cjs";
import { Expression } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser/parser.cjs";
import * as ohm from 'ohm-js';

const toAST = (node: any) => typeof node?.toAST === 'function' ? node.toAST(__filename) : node;

export const actionMap: ActionMap<Expression> = {
    ident(_first, _rest) {
        return new ASTs.Identifier(
            _first.sourceString + _rest.sourceString,
            getLoc(_first, __filename)
        );
    },

    ParenExpr_paren(_open, expr, _close) {
        return new ASTs.ParenExpression(toAST(expr), getLoc(_open, __filename));
    },

    VariableAssign(address, _eq, value) {
        return new ASTs.VariableAssign(toAST(address), toAST(value), getLoc(_eq, __filename));
    }
};
