import { Statement } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";
import { OphoelType } from "../../types.cjs";

export class StructDecl implements Statement {
    kind = "StructDecl";

    constructor(
        public name: string,
        public fields: { name: string, type: OphoelType }[],
        public location: Location) {}
}
