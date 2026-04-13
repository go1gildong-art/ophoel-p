import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    McCommand(this: ActionMapThis, cmd, _dbang, arg, _semi) {
        return new ASTs.McCommand(cmd.sourceString, arg.toAST(this.args.ophoelDir), getLoc(cmd, this.args.ophoelDir));
    },

    McExecStatement(this: ActionMapThis, _mcExec, prefix, _dbang, body) {
        return new ASTs.McExecStatement(prefix.toAST(this.args.ophoelDir), body.toAST(this.args.ophoelDir), getLoc(_mcExec, this.args.ophoelDir));
    }
};
