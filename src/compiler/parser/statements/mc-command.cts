import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const mcCommand: ActionMap<Statement> = {
    McCommand(cmd, _dbang, arg, _semi) {
        return new ASTs.McCommand(
            cmd.sourceString,
            arg.toAST(__filename),
            getLoc(cmd, __filename)
        );
    }
}