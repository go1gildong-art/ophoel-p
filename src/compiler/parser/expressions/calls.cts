import { ASTs } from "../../../ast/ast-collection.cjs";
import { Expression } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const calls: ActionMap<Expression> = {
    FunctionCall(name, _open, args, _close) {
        const argsList = args.toAST(__filename);
        return new ASTs.FunctionCall(
            name.sourceString,
            argsList,
            getLoc(name, __filename)
        );
    },

    MacroCall(name, _bang, _open, args, _close) {
        const argsList = args.toAST(__filename);
        return new ASTs.MacroCall(
            name.sourceString,
            argsList,
            getLoc(name, __filename)
        );
    }
}
