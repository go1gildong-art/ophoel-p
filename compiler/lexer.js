let tokenPatterns = {
  "patterns": [
    { "type": "WHITESPACE", "regex": "^\\s+" },
    { "type": "COMMENT",    "regex": "^(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" },
    { "type": "STRING",     "regex": "^\"([^\"\\\\]|\\\\.)*\"" },
    { "type": "NUMBER",     "regex": "^\\d+" },
    { "type": "DOUBLE_BANG", "regex": "^!!" },
    { "type": "BANG",        "regex": "^!(?!!)" },
    { "type": "SYMBOL",      "regex": "^[(){}\\[\\],;]" },
    { "type": "OPERATOR",    "regex": "^[=+\\-*/%<>]+" },
    { "type": "CONFIG_REF",  "regex": "^config\\.[a-zA-Z_\\[\\].]+" },
    { "type": "WORD",        "regex": "^[a-zA-Z_][a-zA-Z0-9_]*" }
    
  ]
};

function extractTemplate(source, config) {
    let tokens = [];
    let cursor = 0;
}


export function tokenize(source, config) {
    let tokens = [];
    let cursor = 0;

    while (cursor < source.length) {
        let match = null;
        let substring = source.slice(cursor);

        // Skip Whitespace
        match = substring.match(/^\s+/);
        if (match) {
            cursor += match[0].length;
            continue;
        }

        // Match patterns from your JSON
        for (const { type, regex } of tokenPatterns.patterns) {
            const re = new RegExp(regex);
            match = substring.match(re);
            if (match) {
                let value = match[0];
                
                // Special handling for Config Refs: Swap them NOW
                
                if (type === "CONFIG_REF") {
                    const key = value.split('.')[1];
                    value = config[key] || "null";
                }
                

                tokens.push({ type, value });
                cursor += match[0].length;
                break;
            }
        }
    }

    return tokens;
}