// const Location = require("../metadata.cjs");
import { Location } from "../metadata.cjs"
type Location_t = InstanceType<typeof Location>;

export class Token {
    kind: string;
    value: string;
    location: Location_t;

    constructor(kind: string, value: string, location: Location_t) {
        this.kind = kind;
        this.value = value;
        this.location = location;
    }
}