import { actionMap } from './parsing/parser-actionmap.cjs';
import { grammar } from './parsing/ohm-grammar.cjs';
import * as lispify from './lispify.cjs';
import * as nodes from './nodes.cjs';

export const pack = {
    name: "_core.control-flow",
    grammar,
    actionMap,
    lispify,
    nodes
}