import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const declarations: ActionMap<Statement> = {
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
    }
}