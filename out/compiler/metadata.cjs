"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
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
exports.Location = Location;
//# sourceMappingURL=metadata.cjs.map