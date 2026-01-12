"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const formatter_js_1 = require("./formatter/formatter.js");
function activate(context) {
    vscode.window.showInformationMessage("dsl test");
    const selector = { language: 'ophoel' };
    const provider = {
        provideDocumentFormattingEdits(document) {
            const text = document.getText();
            const fileName = path.basename(document.uri.fsPath);
            let formattedText = (0, formatter_js_1.format)(text, {}, fileName);
            console.log('Original text length:', text.length);
            console.log('Formatted text length:', formattedText.length);
            // Full document range
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
            if (!formattedText.endsWith('\n')) {
                formattedText += '\n';
            }
            return [vscode.TextEdit.replace(fullRange, formattedText)];
        }
    };
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(selector, provider));
}
//# sourceMappingURL=extension.js.map