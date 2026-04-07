import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser.cjs";

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
};
