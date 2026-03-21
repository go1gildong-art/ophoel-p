import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const execExpr: ActionMap<Statement> = {
    ExecExpr(expr, _semi) {
        return new ASTs.ExecuteExpression(
            expr.toAST(__filename),
            getLoc(expr, __filename)
        );
    }
}