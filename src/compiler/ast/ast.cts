import { Location } from "../metadata.cjs";

export interface ASTNode {
    kind: string;
    location: Location;

    parse(v: Visitor): ASTNode
    transform(v: Visitor): ASTNode
}
