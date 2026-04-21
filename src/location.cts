export class Location {
    constructor(
        public dir: string, // will directly transfer from Source.ophoelDir
        public line: number,
        public column: number,
        public charPos: number,) { }

    toString(): string {
        return `${this.shortDir() ? this.shortDir() : this.dir}:${this.line}:${this.column} (${this.charPos})`;
    }

    shortDir() {
        return this.dir.split(/[\\\/]/).at(-1);
    }
}

export class Source {
    constructor(
        public src: string,

        // to pair with FileManager, namespace/ophoel/functions/<file-directory>
        public ophoelDir: string 
    ) { }
}