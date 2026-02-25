
import { Location } from "../metadata.cjs";
import { OphoelType, OphoelValue } from "./types.cjs";

export interface ASTNode {
    kind: string;
    location: Location;
}

export interface Expression extends ASTNode {
    type: OphoelType;
    value: OphoelValue;
}

export interface LValue extends Expression {}

export interface Statement extends ASTNode {}

export interface Call extends ASTNode {
    args: Expression[];
    callee: string;
}
