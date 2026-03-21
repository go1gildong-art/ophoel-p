import { binaryOps } from './expressions/binary-ops.cjs';
import { calls } from './expressions/calls.cjs';
import { identifier } from './expressions/identifier.cjs';
import { literals } from './expressions/literals.cjs';
import { unaryOps } from './expressions/unary-ops.cjs';
import { execExpr } from './statements/exec-expr.cjs';
import { declarations } from './statements/declarations.cjs';
import { program } from './statements/program.cjs';
import { utilities } from './utilities.cjs';
import { mcCommand } from './statements/mc-command.cjs';

export const actionMaps = {
    binaryOps,
    calls,
    identifier,
    literals,
    unaryOps,
    execExpr,
    declarations,
    program,
    utilities,
    mcCommand
};