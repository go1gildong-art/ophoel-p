
import { Location } from "../metadata.cjs";
import { OphoelValue } from "./types.cjs";

export interface ASTNode {
    kind: string;
    location: Location;
}

export interface Preprocess extends ASTNode {}

export interface Expression extends ASTNode {
    value?: OphoelValue;
}

export interface LValue extends Expression {}

export interface Statement extends ASTNode {}

export interface Call extends ASTNode {
    args: Expression[];
    callee: string;
}
