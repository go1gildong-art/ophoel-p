import { Location } from "../metadata.cjs";

export class OphoelParseError extends Error {
    constructor(msg: string, location?: Location | undefined) {
        super(`${msg} at ${location?.toString() ?? `undefined location`}`);
    }
}