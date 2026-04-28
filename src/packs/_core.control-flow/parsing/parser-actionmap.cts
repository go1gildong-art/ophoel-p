import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement | any> = {
    IfStatement(this: ActionMapThis, _if, cond, body, elifs, elseClause) {
        const ifSignature = { condition: cond.toAST(this.args.ophoelDir), body: body.toAST(this.args.ophoelDir) };
        const elifSignatures = elifs.toAST(this.args.ophoelDir).map((elif: any) => ({ condition: elif.condition.toAST(this.args.ophoelDir), body: elif.body.toAST(this.args.ophoelDir) }));
        const elseSignature = elseClause?.toAST(this.args.ophoelDir)[0] ?? null
        return new ASTs.IfStatement(ifSignature, elifSignatures, elseSignature, getLoc(_if, this.args.ophoelDir));
    },
    Elif(this: ActionMapThis, _elif, condition, body) {
        return { condition, body };
    },
    Else(this: ActionMapThis, _else, body) {
        return { condition: null, body: body.toAST(this.args.ophoelDir) };
    },
    WhileStatement(this: ActionMapThis, _while, condition, body) {
        return new ASTs.WhileStatement(condition.toAST(this.args.ophoelDir), body.toAST(this.args.ophoelDir), getLoc(_while, this.args.ophoelDir));
    },
    ForStatement(this: ActionMapThis, _for, _open1, declaration, condition, _semi, increment, _close1, body) {
        return new ASTs.ForStatement(declaration.toAST(this.args.ophoelDir), condition.toAST(this.args.ophoelDir), increment.toAST(this.args.ophoelDir), body.toAST(this.args.ophoelDir), getLoc(_for, this.args.ophoelDir));
    },
    ForOfStatement(this: ActionMapThis, _for, _open1, declaration, _of, iterable, _close1, body) {
        return new ASTs.ForOfStatement(declaration.toAST(this.args.ophoelDir), iterable.toAST(this.args.ophoelDir), body.toAST(this.args.ophoelDir), getLoc(_for, this.args.ophoelDir));
    },
    RepeatStatement(this: ActionMapThis, _repeat, count, body) {
        return new ASTs.RepeatStatement(count.toAST(this.args.ophoelDir), body.toAST(this.args.ophoelDir), getLoc(_repeat, this.args.ophoelDir));
    },
    ChooseStatement(this: ActionMapThis, _choose, weight, body, branches) {
        const branchList = branches.toAST(this.args.ophoelDir).map((c: any) => ({
            weight: c.value.toAST(this.args.ophoelDir),
            body: c.body.toAST(this.args.ophoelDir)
        }));
        return new ASTs.ChooseStatement(
            [weight.toAST(this.args.ophoelDir), ...branchList.weight],
            [body.toAST(this.args.ophoelDir), ...branchList.body],
            getLoc(_choose, this.args.ophoelDir));
    },
    ReturnStatement(this: ActionMapThis, _return, expr, _semi) {
        const value = expr?.toAST(this.args.ophoelDir)[0];
        return new ASTs.ReturnStatement(value, getLoc(_return, this.args.ophoelDir));
    }
};