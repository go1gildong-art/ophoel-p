import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log("Ophoel Formatter activated!");

  const disposable = vscode.languages.registerDocumentFormattingEditProvider('ophoel', {
    provideDocumentFormattingEdits(document: vscode.TextDocument) {
      const edits: vscode.TextEdit[] = [];
      const indentSize = 2;
      let currentIndent = 0;

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        let text = line.text.trim();

        if (text === '') continue; // skip empty lines

        // Decrease indent if line starts with closing brace
        if (text.startsWith('}')) {
          currentIndent = Math.max(currentIndent - indentSize, 0);
        }

        // Apply indentation
        const indent = ' '.repeat(currentIndent);
        const newText = indent + text;

        if (newText !== line.text) {
          edits.push(vscode.TextEdit.replace(line.range, newText));
        }

        // Increase indent if line ends with opening brace
        if (text.endsWith('{')) {
          currentIndent += indentSize;
        }

        // Insert newline after opening brace if next line sticks to it
        if (text.endsWith('{') && i + 1 < document.lineCount) {
          const nextLine = document.lineAt(i + 1);
          if (nextLine.text.trim() !== '') {
            const pos = new vscode.Position(i + 1, 0);
            edits.push(vscode.TextEdit.insert(pos, ' '.repeat(currentIndent)));
          }
        }
      }

      return edits;
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

