export class Location {
    fileName: string;
    line: number;
    column: number;
    tokenIndex: number; 

    constructor(fileName: string, ln: number, col: number, tokenIdx: number) {
        this.fileName = fileName,
        this.line = ln,
        this.column = col,
        this.tokenIndex = tokenIdx;
    }

    toString(): string {
        return `${this.fileName}:${this.line}:${this.column} (${this.tokenIndex})`;
    }
}