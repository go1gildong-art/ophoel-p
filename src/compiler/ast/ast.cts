import { Location } from "../metadata.cjs";

export interface ASTNode {
    kind: string;
    location: Location;

    parse(v: ParserVisitor): ASTNode
    transform(v: TransformerVisitor): ASTNode
}