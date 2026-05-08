import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    McCommand(this: ActionMapThis, cmd, _dbang, arg, _semi) {
        return new ASTs.McCommand(cmd.sourceString, arg.toAST(this.args.ophoelDir), getLoc(cmd, this.args.ophoelDir));
    },

    SLComment(this: ActionMapThis, _slashes, content, _newline) {
        return new ASTs.SLComment(content.sourceString, getLoc(_slashes, this.args.ophoelDir));
    },

    MLComment(this: ActionMapThis, _start, content, _end) {
        return new ASTs.MLComment(content.sourceString, getLoc(_start, this.args.ophoelDir));
    },

    PreservedComment(this: ActionMapThis, _start, content) {
        return new ASTs.PreservedComment(content.sourceString, getLoc(_start, this.args.ophoelDir));
    },

    PreservedNewline(this: ActionMapThis, _start, _newline) {
        return new ASTs.PreservedNewline(getLoc(_start, this.args.ophoelDir));
    }
};
