import { ASTs } from "../../../ast/ast-collection.cjs";
import { Expression } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const identifier: ActionMap<Expression> = {
    ident(_first, _rest) {
        return new ASTs.Identifier(_first.sourceString, getLoc(_first, __filename));
    }
}