import { binaryOps } from './expressions/binary-ops.cjs';
import { calls } from './expressions/calls.cjs';
import { identifier } from './expressions/identifier.cjs';
import { literals } from './expressions/literals.cjs';
import { unaryOps } from './expressions/unary-ops.cjs';
import { execExpr } from './statements/exec-expr.cjs';
import { declarations } from './statements/declarations.cjs';
import { functionDeclarations } from './statements/function-declarations.cjs';
import { controlFlow } from './statements/control-flow.cjs';
import { preprocesses } from './statements/preprocesses.cjs';
import { program } from './statements/program.cjs';
import { utilities } from './utilities.cjs';
import { mcCommand } from './statements/mc-command.cjs';
import {block } from "./statements/block.cjs";
import { paren} from "./expressions/paren.cjs";
import { statements } from './statements/statements.cjs';

export const actionMaps = {
    binaryOps,
    calls,
    paren,
    identifier,
    literals,
    unaryOps,
    execExpr,
    declarations,
    functionDeclarations,
    controlFlow,
    preprocesses,
    program,
    utilities,
    mcCommand,
    block
};