export class OphoelParseError extends Error {
    constructor(msg, token) {
        return new Error(msg + ` at ${token?.location.fileName}:${token?.location.line}, ${token?.location.tokenIdx}`);
    }
};

export class OphoelSemanticError extends Error {
    constructor(msg, node) {
        return new Error(msg + ` at ${node?.location?.fileName}:${node?.location?.line}, ${node?.location?.tokenIdx}`);
    }
};