import { ASTs } from "../../../ast/ast-collection.cjs";
import { Expression } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const paren: ActionMap<Expression> = {
    ParenExpr_paren(_open, expr, _close) {
        return new ASTs.ParenExpression(expr.toAST(__filename), getLoc(_open, __filename));
    }
}