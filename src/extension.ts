
import * as vscode from 'vscode';
import * as path from 'path';
import { format } from './formatter/formatter.js';


export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage("dsl test");


    const selector: vscode.DocumentSelector = { language: 'ophoel' };

    const provider: vscode.DocumentFormattingEditProvider = {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const text = document.getText();
            const fileName = path.basename(document.uri.fsPath);
            let formattedText = format(text, {}, fileName);

            console.log('Original text length:', text.length);
            console.log('Formatted text length:', formattedText.length);

            // Full document range
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );

            if (!formattedText.endsWith('\n')) {
                formattedText += '\n';
            }

            return [vscode.TextEdit.replace(fullRange, formattedText)];
        }
    };

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(selector, provider)
    );
}
