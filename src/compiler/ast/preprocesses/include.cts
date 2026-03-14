import { Expression, Preprocess, Statement } from "../ast.cjs";
import { Location } from "../../metadata.cjs";


export class Include implements Preprocess {
    kind = "Include";

    constructor(
        public path: string,
        public location: Location) {}
}
