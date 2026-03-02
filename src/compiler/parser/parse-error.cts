import { Location } from "../metadata.cjs";

export class OphoelParseError extends Error {
    constructor(msg: string, location: Location) {
        super(msg + " at " + location.toString());
    }
}