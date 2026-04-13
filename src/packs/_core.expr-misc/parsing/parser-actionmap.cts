import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";



export const actionMap: ActionMap<Expression> = {
    ident(this: ActionMapThis, _first, _rest) {
        return new ASTs.Identifier(
            _first.sourceString + _rest.sourceString,
            getLoc(_first, this.args.ophoelDir)
        );
    },

    ParenExpr_paren(this: ActionMapThis, _open, expr, _close) {
        return new ASTs.ParenExpression(expr.toAST(this.args.ophoelDir), getLoc(_open, this.args.ophoelDir));
    },
};
