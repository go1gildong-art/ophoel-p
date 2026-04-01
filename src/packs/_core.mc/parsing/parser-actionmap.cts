import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    McCommand(cmd, _dbang, arg, _semi) {
        return new ASTs.McCommand(cmd.sourceString, arg.toAST(__filename), getLoc(cmd, __filename));
    },

    McExecStatement(_mcExec, prefix, _dbang, body) {
        return new ASTs.McExecStatement(prefix.toAST(__filename), body.toAST(__filename), getLoc(_mcExec, __filename));
    }
};
