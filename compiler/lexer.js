const tokenPatterns = {
    "patterns": [
        { "type": "WHITESPACE", "regex": "^\\s+" },
        { "type": "COMMENT", "regex": "^(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" },
        { "type": "STRING", "regex": "^\"([^\"\\\\]|\\\\.)*\"" },
        { "type": "NUMBER", "regex": "^\\d+" },
        { "type": "BOOL", "regex": "^true|false$" },
        { "type": "DOUBLE_BANG", "regex": "^!!" },
        { "type": "BANG", "regex": "^!(?!!)" },
        { "type": "SYMBOL", "regex": "^[(){}\\[\\],;]" },
        { "type": "OPERATOR", "regex": "^[=+\\-*/%<>]+" },
        { "type": "CONFIG_REF", "regex": "^config\\.[a-zA-Z_\\[\\].]+" },
        { "type": "WORD", "regex": "^[a-zA-Z_][a-zA-Z0-9_]*" }

    ]
};

const reservedKeywords = {
    "KW_MACRO": [
        "repeat",
        "mc_exec"
    ],
    "KW_CONTROL": [
        "if",
        "else"
    ],
    "KW_TYPE": [
        "int_c",
        "string",
        "bool"
    ],
    "LIT_VAL": [
        "null",
    ],
    "KW_MCCOMMAND": [
        "give",
        "execute",
        "scoreboard",
        "tellraw",
        "say",
        "summon",
        "effect"
    ]
}



export function tokenize(source, config) {
    const ophoelSource = source;
    let tokens = [];
    let cursor = 0;
    let idx = 0;


    while (cursor < ophoelSource.length) {
        let match = null;
        let substring = ophoelSource.slice(cursor);

        // Skip Whitespace
        match = substring.match(/^\s+/);
        if (match) {
            cursor += match[0].length;
            continue;
        }

        // Match patterns from your JSON
        for (let { type, regex } of tokenPatterns.patterns) {
            const re = new RegExp(regex);
            match = substring.match(re);
            if (match) {
                let value = match[0];

                // remove quotes at the both end from string
                if (type === "STRING") {
                    value = value.slice(1, (value.length - 1));
                }

                // Special handling for Config Refs: Swap them NOW
                if (type === "CONFIG_REF") {
                    const key = value.split('.')[1];
                    value = config[key] || "null";
                    if (/^\d+$/.test(value)) {
                        type = "NUMBER";
                    } else if (value === "true" || value === "false") {
                        type = "BOOL";
                    } else {
                        type = "STRING";
                    }
                }

                // For type WORD: check and decide whether if it's a keyword or an identifier 
                if (type === "WORD") {
                    for (const kw_type in reservedKeywords) {
                        if (Object.hasOwn(reservedKeywords, kw_type)) {
                            if (reservedKeywords[kw_type].includes(value)) {
                                type = kw_type;
                            }
                        }
                    }
                    // if none of reserved ones matched
                    if (type === "WORD") type = "IDENTIFIER";
                }



                tokens.push({ type, value, idx });
                idx += 1;
                cursor += match[0].length;
                break;
            }
        }
    }
    return tokens;
}