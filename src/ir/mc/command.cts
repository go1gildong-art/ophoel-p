import { Location } from "../../location.cjs";
import { IRKind, IRNode } from "../ir.cjs";

export class Command implements IRNode {
    kind: IRKind = IRKind.Command;

    constructor(
        public message: string,
        public location?: Location) { }

    toString() {
        return `/${this.message} | ${this.location?.toString() || "unknown location"}`;
    }

    nonLocString() {
        return `/${this.message}`;
    }

    codeGen() {
        return `${this.message}`;
    }
}

export class Comment implements IRNode {
    kind: IRKind = IRKind.Comment;

    constructor(
        public message: string,
        public location?: Location) { }

    toString() {
        return `/# ( ${this.message} | ${this.location?.toString() || "unknown location"} )`;
    }

    nonLocString() {
        return `/# ( ${this.message} )`;
    }

    codeGen(): string {
        return `# ${this.message}`;
    }
}