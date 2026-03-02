import { Location } from "../metadata.cjs";

export class OphoelParseError<details_T> extends Error {
    constructor(msg: string, location: Location | undefined) {
        super(`${msg} at ${location?.toString() ?? `undefined location`}`);
    }
}