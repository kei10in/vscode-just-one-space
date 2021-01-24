import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("justOneSpace.justOneSpace", () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const line = selection.active.line;

        const lineText = document.lineAt(line).text;
        const n = selection.active.character;

        const start = findLastIndex(lineText.slice(0, n), (c) => !isWS(c)) + 1;
        const end = findIndex(lineText.slice(n), (c) => !isWS(c)) + n;
        const range = new vscode.Range(
          new vscode.Position(line, start),
          new vscode.Position(line, end)
        );
        editor.edit((editBuilder) => {
          editBuilder.replace(range, " ");
        });
        editor.selection = new vscode.Selection(
          new vscode.Position(line, start + 1),
          new vscode.Position(line, start + 1)
        );
      }
    })
  );
}

function isWS(ch: string): boolean {
  return isWhiteSpace(ch.charCodeAt(0));
}

function isWhiteSpace(ch: number): boolean {
  const ws = [
    0x09, // \t
    0x0a, // \n
    0x0b, // \v
    0x0c, // \f
    0x0d, // \r
    0x20, // space
    0xa0, // no break space
    0x2002, // EN SPACE
    0x2003, // EM SPACE
    0x2004, // THREE-PER-EM SPACE
    0x2005, // FOUR-PER-EM SPACE
    0x2006, // SIX-PER-EM SPACE
    0x2007, // FIGURE SPACE
    0x2008, // PUNCTUATIO SPACE
    0x2009, // THIN SPACE
    0x200a, // HAIR SPACE
    0x200b, // ZERO WIDTH SPACE
    0x3000, // IDEOGRAPHIC SPACE
    0xfeff, // ZERO WIDTH NO-BREAK SPACE
  ];
  return 0 < ws.indexOf(ch);
}

function findIndex(
  s: string,
  pred: (c: string, n: number, s: string) => boolean
): number {
  for (var i = 0; i < s.length; i++) {
    if (pred(s[i], i, s)) {
      return i;
    }
  }

  return s.length;
}

function findLastIndex(
  s: string,
  pred: (c: string, n: number, s: string) => boolean
): number {
  for (var i = s.length; 0 < i; i--) {
    if (pred(s[i - 1], i, s)) {
      return i - 1;
    }
  }

  return -1;
}

export function deactivate() {}
