import { Node } from "ohm-js";
import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';




export const actionMap: ActionMap<Statement | any[]> = {
    Print(this: ActionMapThis, _print, _bang, content, _semi) {
        return new ASTs.Program(content.toAST(this.args.ophoelDir), getLoc(_print, this.args.ophoelDir));
    },
};