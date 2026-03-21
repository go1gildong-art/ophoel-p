import * as ohm from 'ohm-js';
import * as path from 'path';
import * as fs from 'fs';
import { Location } from '../metadata.cjs'; // Your existing class
import { ASTs, ASTTypes } from '../../ast/ast-collection.cjs'; // Your nodes
import { actionMaps } from './action-maps.cjs';

// 1. Load the grammar
// This builds an absolute path regardless of where you run the command from
// We go up from 'out/' to the root, then into 'src/compiler/'
const grammarPath = path.join(__dirname, 'grammar.ohm');

const grammarSource = fs.readFileSync('./src/compiler/parser/grammar.ohm', 'utf-8');
const myGrammar = ohm.grammar(grammarSource);

export type ActionMap<T = unknown> = { [key: string]: (...args: ohm.Node[]) => T };

// 2. Helper to create your Location object from an Ohm node
export function getLoc(node: ohm.Node, fileName: string): Location {
    const { lineNum, colNum } = node.source.getLineAndColumn();
    // node.source.start is the character offset
    return new Location(fileName, lineNum, colNum, node.source.startIdx);
}


type Flatten<T> = {
  [K in keyof T[keyof T]]: T[keyof T][K]
};

function flatten<T extends Record<string, Record<string, any>>>(obj: T): Flatten<T> {
  return Object.assign({}, ...Object.values(obj));
}
// 3. Define Semantics
const semantics = myGrammar.createSemantics().addOperation('toAST(fileName)', flatten(actionMaps));

export function parse({ source, __filename }: { source: string; __filename: string }): ASTTypes["Program"] {
    const match = myGrammar.match(source);
    if (match.failed()) {
        // Ohm provides a detailed error string with line/col automatically
        throw new Error(match.message);
    }
    return semantics(match).toAST(__filename);
}