import { Expression, Statement } from "../ast.cjs";
import { Location } from "../../metadata.cjs";


export class McCommand implements Statement {
    kind = "McCommand";

    constructor(
        public command: string,
        public argument: Expression,
        public location: Location) {}
}
