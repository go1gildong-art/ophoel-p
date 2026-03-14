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

        const makeCheckInside = (...kind: string[]) =>
            ((parser: this) => parser.peek(index)?.isInside(...kind) ?? false);

        enum BindPower {
            INITIAL,
            ASSIGN,
            ADD,
            MULTIPLY,
            COMPARE,
            OR,
            AND,
            ACCESS,
            CALL,
            POSTFIX
        }

        const compoundAssigns = [
            "PLUSCASSIGN", 
            "MINUSCASSIGN", 
            "MULTIPLYCASSIGN", 
            "DIVIDECASSIGN", 
            "REMAINDERCASSIGN"
        ];

        const comparisons = [
            "EQUAL", 
            "NOTEQUAL", 
            "LESS", 
            "MORE", 
            "EQLESS", 
            "EQMORE"
        ];

        const bindpowerTable = [
            { bindpower: BindPower.ASSIGN, condition: makeCheckInside("ASSIGN", ...compoundAssigns)},
            { bindpower: BindPower.ADD, condition: makeCheckInside("PLUS", "DASH") },
            { bindpower: BindPower.MULTIPLY, condition: makeCheckInside("ASTERISK", "SLASH", "PERCENT") },
            { bindpower: BindPower.COMPARE, condition: makeCheckInside(...comparisons) },
            { bindpower: BindPower.OR, condition: makeCheck("OR") },
            { bindpower: BindPower.AND, condition: makeCheck("AND") },
            { bindpower: BindPower.ACCESS, condition: makeCheck("PERIOD", "LBRACKET") },
            { bindpower: BindPower.CALL, condition: makeCheck("LPAREN") },
            { bindpower: BindPower.POSTFIX, condition: makeCheckInside("DOUBLEPLUS", "DOUBLEDASH")},
        ]

        function parseAtomic() {
            const token = this.eat();

            if (paren) parseParen();
            elif (bang) parseNot();
            elif (++ | --) parsePreUnary();
            elif (num) parseNum();
            elif (quote) parseStr();
            elif (true | false) parseBool();
            elif (backtick) parseTmpl();
            elif (Lbracket) parseArr();
            elif (Lcbrace) parseObj();
            elif (ident) parseIdent(); // will handle ident vs funciton vs macro
        }

        function parseExpr() {
            parseAtomic();
            bindpowerTable
            .filter(entry => entry.condition(this))
            
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
