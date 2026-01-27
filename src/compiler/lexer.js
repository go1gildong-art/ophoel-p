import { Location } from "./ast.js";

const tokenPatterns = {
    "patterns": [
        { "type": "WHITESPACE", "regex": "^\\s+" },
        { "type": "PRESERVED_COMMENT", "regex": "^(\\/#[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" },
        { "type": "PRESERVED_NEWLINE", "regex": "^(\\/\\.)" },
        { "type": "COMMENT", "regex": "^(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" },
        { "type": "STRING", "regex": "^\"([^\"\\\\]|\\\\.)*\"" },
        { "type": "NUMBER", "regex": "^\\-?\\d+" },
        { "type": "BOOL", "regex": "^true|false" },
        { "type": "DOUBLE_BANG", "regex": "^!!" },
        { "type": "BANG", "regex": "^!(?!!)" },
        { "type": "SYMBOL", "regex": "^(!!|::|[(){}\\[\\],;:`$!])" },
        { "type": "OPERATOR", "regex": "^(==|[\\=\\+\\-*/%<>])" },
        { "type": "CONFIG_REF", "regex": "^config\\.[a-zA-Z_][a-zA-Z0-9_]*(\\.[A-Za-z0-9_]+|\\[[A-Za-z0-9_]+\\])*" },
        { "type": "WORD", "regex": "^[a-zA-Z_][a-zA-Z0-9_]*" },
        { "type": "INVALID", "regex": "^.+" }
    ]
};

const reservedKeywords = {
    "KW_SPECIFIER": [
        "mut"
    ],
    "KW_CONTROL": [
        "if",
        "else",
        "for",
        "while",
        "repeat",
        "choose",
        "or"
    ],
    "KW_BUILTIN": [
        "mc_exec"
    ],
    "KW_DECL": [
        "let",
        "fn",
        "macro"
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
        "effect",
        "fill",
        "setblock",
        "place",
        "function",
        "kill",
        "playsound"
    ]
}

function print(x, msg = "") {
    // console.log(x, msg);
    return x;
}

export function tokenize(source, config, fileName) {
    const ophoelSource = source;
    let tokens = [];
    let cursor = 0;
    let idx = 0;
    let line = 1;
    let col = 1;

    let templateStrMode = false;

    // temp flag for checking temporal escaping with ${}s
    let templateStrEscape = false;


    while (cursor < ophoelSource.length) {
        let match = null;
        let substring = ophoelSource.slice(cursor);

        if (templateStrMode && !templateStrEscape) {
            let type;
            let value;

            if (tokens[tokens.length - 1].type === "SYMBOL"
                && tokens[tokens.length - 1].value === "`") {
                type = "TEMPLATE_HEAD";
            } else if (print(substring.match(/`/)?.index ?? substring.length, "searching `") <
                print(substring.match(/\$\{/)?.index ?? substring.length)) {
                // when next ` is faster than ${. false if any are found
                type = "TEMPLATE_TAIL";
            } else {
                type = "TEMPLATE_BODY";
            }
            templateStrEscape = true;


            // get next ${ or ` index. if none are present, just return the end 
            const nextBrPoint = substring.match(/\$\{|`/)?.index ?? substring.length;
            value = substring.slice(0, nextBrPoint);

            const location = new Location(fileName, line, idx);
            tokens.push({ type, value, location });
            idx += 1;
            cursor += nextBrPoint;
            continue;
        }

        // Skip Whitespace
        
        match = substring.match(/^\s+/);
        if (match) {
            cursor += match[0].length;
            line += match[0].match(/\n/g)?.length ?? 0;
            continue;
        }
            

        // Match patterns from your JSON
        for (let { type, regex } of tokenPatterns.patterns) {
            const re = new RegExp(regex);
            match = substring.match(re);
            if (match) {
                let value = match[0];

                if (type === "SYMBOL"
                    && value === "`") {
                    if (templateStrMode) {
                        // close template string by second `
                        templateStrMode = false;
                    } else {
                        // if found `, enable template string parsing mode
                        templateStrMode = true;
                        templateStrEscape = false;
                    }
                    // continue;
                }

                if (type === "SYMBOL"
                    && value === "}"
                    && templateStrMode === true
                    && templateStrEscape === true) {
                    // close ${} interpolation by ending }
                    templateStrEscape = false;
                }



                // remove quotes at the both end from string
                if (type === "STRING") {
                    value = value.slice(1, (value.length - 1));
                }

                // Special handling for Config Refs: Swap them now: DON'T
                // Config values will resolved at semantics
                /*
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
                    */

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


                const location = new Location(fileName, line, idx);
                tokens.push({ type, value, location });
                idx += 1;
                cursor += match[0].length;
                break;
            }
        }
    }
    return tokens;
}