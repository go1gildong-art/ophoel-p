import { Statement } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class StructDecl implements Statement {
    kind = "StructDecl";

    constructor(
        public name: string,
        public fields: string[],
        public location: Location) {}
}
