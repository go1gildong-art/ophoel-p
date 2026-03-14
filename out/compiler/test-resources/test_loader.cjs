"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTests = loadTests;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const node_path_1 = __importDefault(require("node:path"));
async function loadTests(folder) {
    const entries = await (0, promises_1.readdir)(folder);
    const testFiles = entries.filter(name => name.startsWith("test_") && name.endsWith(".cjs"));
    const tests = [];
    for (const file of testFiles) {
        const fullPath = node_path_1.default.resolve((0, path_1.join)(folder, file));
        const module = require(fullPath);
        tests.push(module.unit);
    }
    return tests;
}
//# sourceMappingURL=test_loader.cjs.map