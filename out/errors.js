"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OphoelSemanticError = exports.OphoelParseError = void 0;
class OphoelParseError extends Error {
    constructor(msg, token) {
        super(msg + ` at ${token === null || token === void 0 ? void 0 : token.location.fileName}:${token === null || token === void 0 ? void 0 : token.location.line}, ${token === null || token === void 0 ? void 0 : token.location.tokenIdx}`);
    }
}
exports.OphoelParseError = OphoelParseError;
;
class OphoelSemanticError extends Error {
    constructor(msg, node) {
        var _a, _b, _c;
        super(msg + ` at ${(_a = node === null || node === void 0 ? void 0 : node.location) === null || _a === void 0 ? void 0 : _a.fileName}:${(_b = node === null || node === void 0 ? void 0 : node.location) === null || _b === void 0 ? void 0 : _b.line}, ${(_c = node === null || node === void 0 ? void 0 : node.location) === null || _c === void 0 ? void 0 : _c.tokenIdx}`);
    }
}
exports.OphoelSemanticError = OphoelSemanticError;
;
//# sourceMappingURL=errors.js.map