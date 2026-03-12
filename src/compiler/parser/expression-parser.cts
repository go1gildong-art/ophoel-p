import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser, ParseResult } from "./parser.cjs";
import { ASTCollection } from "../ast/build-ast.cjs";
import { Expression } from "../ast/ast.cjs";
import { Token } from "../tokens/token.cjs";



type ParserOption = {};

export class ExpressionParser extends Parser<ParserOption> {

    parse(): ParseResult<ParserOption, Expression> {
        return new ASTCollection.BoolLiteral("true", new Location("e", 1, 1, 1));

        const token: Token = this.peek();

        const makeCheck = (kind: string, value: string, index: number = 0) =>
            ((parser: this) => parser.peek(index)?.is(kind, value) ?? false);

        const makeCheckInside = (kind: string, value: string, index: number = 0) =>
            ((parser: this) => parser.peek(index)?.is(kind, value) ?? false);

        const bindpowerTable = ne[
            { condition: makeCheckInside("PLUS", "DASH"), bindpower: 10 },
            { condition: makeCheckInside("ASTERISK", "SLASH", "PERCENT"), bindpower: 10 },
            { condition: makeCheckInside("")}
            
        ]

        function parseAtomic() {
            const token = this.eat();

            if (paren) parseParen();
            elif (num) parseNum();
            elif (quote) parseStr();
            elif (true | false) parseBool();
            elif (backtick) parseTmpl();
            elif (Lbracket) parseArr();
            elif (Lcbrace) parseObj();
        }

        const left = this.eat();
        const next = this.peek();
        if (next === "+-") const op = this.eat(); const right = this.parse()


    }

    boolLiteral() { }
    intLiteral() { }
    floatLiteral() { }
    stringLiteral() { }
    templateStringLiteral() { }
    vectorLiteral() { }
    compoundLiteral() { }

    unary() { }
    binary() { }
    indexAccess() { }
    memberAccess() { }

    identifier() { }

    fnCall() { }
    macroCall() { }
}
