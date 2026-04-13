export class Location {
    constructor(
        public dir: string,
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
        public ophoelDir: string) { }
}