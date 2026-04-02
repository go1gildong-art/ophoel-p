import { actionMap } from './parsing/parser-actionmap.cjs';
import { grammar } from './parsing/ohm-grammar.cjs';
import * as lispify from './lispify.cjs';
import { BinaryOperation,
    PreUnary,
    PostUnary,
    IndexAccess,
    MemberAccess,
    FunctionCall,
    MacroCall
 } from './nodes.cjs'; 

const nodes = {
    BinaryOperation,
    PreUnary,
    PostUnary,
    IndexAccess,
    MemberAccess,
    FunctionCall,
    MacroCall
}

export const pack = {
    name: "_core.operations",
    grammar,
    actionMap,
    lispify,
    nodes
}