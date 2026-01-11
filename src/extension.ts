import * as vscode from 'vscode';
import { format } from './formatter/formatter.js'; // your existing function

export function activate(context: vscode.ExtensionContext) {
    const selector: vscode.DocumentSelector = { scheme: 'file', language: 'mydsl' };

    const provider: vscode.DocumentFormattingEditProvider = {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const text = document.getText();
            const formattedText = format(text); // your pipeline

            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);

            return [vscode.TextEdit.replace(
                new vscode.Range(firstLine.range.start, lastLine.range.end),
                formattedText
            )];
        }
    };

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(selector, provider)
    );
}
