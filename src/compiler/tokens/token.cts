const Location = require("../metadata.cjs");
type Location_t = InstanceType<typeof Location>;

class Token {
    kind: string;
    value: string;
    location: Location_t;

    constructor(kind: string, value: string, location: Location_t) {
        this.kind = kind;
        this.value = value;
        this.location = location;
    }
}