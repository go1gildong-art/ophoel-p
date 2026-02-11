"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Location {
    constructor(fileName, ln, col, tokenIdx) {
        this.fileName = fileName,
            this.line = ln,
            this.column = col,
            this.tokenIndex = tokenIdx;
    }
    toString() {
        return `${this.fileName}:${this.line}:${this.column} (${this.tokenIndex})`;
    }
}
//# sourceMappingURL=metadata.cjs.map