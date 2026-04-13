from pathlib import Path
import re
root = Path(r'c:\Users\nines\Desktop\릴름즈\ophoel-ohmphoel\ophoel-p')
files = list(root.glob('src/packs/**/interpret.cts'))
count = 0
for path in files:
    text = path.read_text('utf-8')
    if 'new Error(' not in text:
        continue
    orig = text
    if 'from "../../compiler/interpreter/error.cjs"' not in text:
        m = re.search(r'(^import .*?utilities\.cjs";\s*$)', text, flags=re.M)
        if m:
            insert = m.group(1) + '\nimport { OphoelError } from "../../compiler/interpreter/error.cjs";\nimport { FileManager } from "../../compiler/file-manager.cjs";'
            text = text[:m.start(1)] + insert + text[m.end(1):]
        else:
            text = 'import { OphoelError } from "../../compiler/interpreter/error.cjs";\nimport { FileManager } from "../../compiler/file-manager.cjs";\n' + text
    def repl(match):
        return f'await OphoelError.fromNode({match.group(1)}, ast, _ctx.fm as FileManager)'
    text = re.sub(r'new Error\(\s*(`[^`]*`|"[^"\\]*(?:\\.[^"\\]*)*"|\'[^\'\\]*(?:\\.[^\'\\]*)*\')\s*\)', repl, text)
    if text != orig:
        path.write_text(text, 'utf-8')
        print('Updated', path)
        count += 1
print('done', count, 'files')
