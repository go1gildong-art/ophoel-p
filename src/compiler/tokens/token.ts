import { Location } from "../metadata";

export class Token {
    kind: string;
    value: string;
    location: Location;

    constructor(kind: string, value: string, location: Location) {
        this.kind = kind;
        this.value = value;
        this.location = location;
    }
}