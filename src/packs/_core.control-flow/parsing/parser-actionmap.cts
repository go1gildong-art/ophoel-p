import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement | any> = {
    IfStatement(_if, cond, body, elifs, elseClause) {
        const ifSignature = { condition: cond.toAST(__filename), body: body.toAST(__filename) };
        const elifSignatures = elifs.toAST(__filename).map((elif: any) => ({ condition: elif.condition.toAST(__filename), body: elif.body.toAST(__filename) }));
        const elseSignature = elseClause.toAST(__filename)[0] ? { condition: elseClause.toAST(__filename)[0].body.toAST(__filename), body: elseClause.toAST(__filename)[0].body.toAST(__filename) } : undefined;
        return new ASTs.IfStatement(ifSignature, elifSignatures, elseSignature, getLoc(_if, __filename));
    },
    Elif(_elif, condition, body) {
        return { condition, body };
    },
    Else(_else, body) {
        return { condition: undefined, body: body.toAST(__filename) };
    },
    WhileStatement(_while, condition, body) {
        return new ASTs.WhileStatement(condition.toAST(__filename), body.toAST(__filename), getLoc(_while, __filename));
    },
    ForStatement(_for, _open1, declaration, condition, _semi, increment, _close1, body) {
        return new ASTs.ForStatement(declaration.toAST(__filename), condition.toAST(__filename), increment.toAST(__filename), body.toAST(__filename), getLoc(_for, __filename));
    },
    ForOfStatement(_for, _open1, declaration, _of, iterable, _close1, body) {
        return new ASTs.ForOfStatement(declaration.toAST(__filename), iterable.toAST(__filename), body.toAST(__filename), getLoc(_for, __filename));
    },
    RepeatStatement(_repeat, count, body) {
        return new ASTs.RepeatStatement(count.toAST(__filename), body.toAST(__filename), getLoc(_repeat, __filename));
    },
    ChooseStatement(_choose, weight, body, branches) {
        const branchList = branches.toAST(__filename).map((c: any) => ({
            weight: c.value.toAST(__filename),
            body: c.body.toAST(__filename)
        }));
        return new ASTs.ChooseStatement(
            [weight.toAST(__filename), ...branchList.weight],
            [body.toAST(__filename), ...branchList.body],
            getLoc(_choose, __filename));
    },
    ReturnStatement(_return, expr, _semi) {
        const value = expr?.toAST(__filename)[0];
        return new ASTs.ReturnStatement(value, getLoc(_return, __filename));
    }
};