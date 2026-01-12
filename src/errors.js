export class OphoelParseError extends Error {
    constructor(msg, token) {
        super(msg + ` at ${token?.location.fileName}:${token?.location.line}, ${token?.location.tokenIdx}`);
    }
};

export class OphoelSemanticError extends Error {
    constructor(msg, node) {
        super(msg + ` at ${node?.location?.fileName}:${node?.location?.line}, ${node?.location?.tokenIdx}`);
    }
};