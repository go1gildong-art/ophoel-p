import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';
import { CompoundAssign } from "../nodes.cjs";
import { BinaryOperator } from "../../_core.operations/nodes.cjs";
import { fail } from "../../../utils/fail.cjs";

const toAST = (node: any) => typeof node?.toAST === 'function' ? node.toAST(__filename) : node;

export const actionMap: ActionMap<Expression> = {
    ident(_first, _rest) {
        return new ASTs.Identifier(
            _first.sourceString + _rest.sourceString,
            getLoc(_first, __filename)
        );
    },

    ParenExpr_paren(_open, expr, _close) {
        return new ASTs.ParenExpression(toAST(expr), getLoc(_open, __filename));
    },

    VariableAssign(address, _eq, value) {
        return new ASTs.VariableAssign(toAST(address), toAST(value), getLoc(_eq, __filename));
    },

    CompoundAssign(address, op, value) {
        const operatorMap: Record<string, BinaryOperator> = {
            "+=": BinaryOperator.ADD,
            "-=": BinaryOperator.SUBTRACT,
            "*=": BinaryOperator.MULTIPLY,
            "/=": BinaryOperator.DIVIDE,
            "%=": BinaryOperator.REMAINDER
        };
        return new ASTs.CompoundAssign(
            toAST(address), 
            operatorMap[op.sourceString] ?? fail(new Error(`Unknown compound operator: ${op.sourceString}`)),  
            toAST(value), 
            getLoc(op, __filename));
    }
};
