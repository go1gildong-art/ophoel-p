import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn, OphoelValue } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs"
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";
import { Statement } from "../../ast.cjs";

export async function IfStatement(ast: ASTTypes["IfStatement"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();

    try {

        const signatures = [ast.ifSignature, ...ast.elifSignatures, ast.elseSignature];
        for (const signature of signatures) {
            if (!signature) continue;
            if (signature.condition === null) return await signature.body.evaluate(ctx.wrap());

            const cond = await signature.condition.evaluate(ctx.wrap());
            if (!cond.ok) return cond;
            ctx = cond.ctx.branch();

            const coerced = await coerce(cond.value, "bool", ctx.wrap(), ast);
            if (!coerced.ok) return coerced;
            ctx = coerced.ctx.branch();

            if (coerced.value.value) {
                const result = await signature.body.evaluate(ctx.wrap());
                return result;
            }
        }

        return res.makeOK({ type: "void", value: null }, ctx.wrap());


    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function WhileStatement(ast: ASTTypes["WhileStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("WhileStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function ForStatement(ast: ASTTypes["ForStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ForStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function ForEachStatement(ast: ASTTypes["ForEachStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ForEachStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function RepeatStatement(ast: ASTTypes["RepeatStatement"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const times = await ast.count.evaluate(ctx.wrap());
        if (!times.ok) return times;
        ctx = times.ctx.branch();

        if (times.value.type !== "num") {
            const msg = `RepeatStatement: expected a number for repeat count, but got ${times.value.value} (${times.value.type})`;
            return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
        }

        for (let i = 0; i < times.value.value; i++) {
            ctx.pushFrame();

            if (ast.index) ctx.addVariable(ast.index, { type: "num", value: i }, false);
            if (ast.index) {
                ctx.frames.forEach(frame => console.log(frame.variables));
            }

            const body = await ast.body.evaluate(ctx.wrap());
            if (!body.ok) return body;
            ctx = body.ctx.branch();

            ctx.popFrame();
        }

        return res.makeOK({ type: "void", value: null }, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function ChooseStatement(ast: ASTTypes["ChooseStatement"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        const entryBuffer:
            { weight: OphoelValue, body: Statement }[] = [];

        for (const entry of ast.entries) {
            const weight = await entry.weight?.evaluate(ctx.wrap());
            let weightResult: OphoelValue;
            if (!weight) weightResult = { type: "num", value: 1 };
            else {
                if (!weight.ok) return weight;
                ctx = weight.ctx.branch();

                const coerced = await coerce(weight.value, "num", ctx.wrap(), ast);
                if (!coerced.ok) return coerced;
                ctx = coerced.ctx.branch();
                const coercedRes = coerced.value.value;

                if (typeof coercedRes !== "number" || coercedRes <= 0) {
                    const msg = `Weight value is smaller than 1, or not a number! got ${coercedRes} (${typeof coercedRes})`;
                    return res.makeErr(new Error(msg));
                }
                weightResult = coerced.value;
            }
            entryBuffer.push({ weight: weightResult, body: entry.body });
        }

        const rngMax = entryBuffer.reduce((acc, entry) => acc + (entry.weight.value as any), 0);
        const nodeDepth = ctx.frames.length;
        const near1 = "type=minecraft:marker, sort=nearest, limit=1";
        const chooseVar = `Oph_ChooseVar_d${nodeDepth}`;
        const chooseRes = `Oph_ChooseRes_d${nodeDepth}`;
        const chooseMar = `Oph_ChooseMarker_d${nodeDepth}`;
        const summonMarker = `summon minecraft:marker ~ ~ ~`;
        const sbPlayer = `scoreboard players`;

        // setup commands
        ctx.emitCmd(`scoreboard objectives add ${chooseVar} dummy`, ast.location);

        for (let i = 0; i < rngMax; i++) {
            //summon armor stands for random choice
            ctx.emitCmd(`${summonMarker} {Tags:["${chooseMar}", "Oph_ChooseMarker${i}_d${nodeDepth}"]}`, ast.location);

            //assign values for each armor stands(rngBase)
            ctx.emitCmd(`${sbPlayer} set @e[tag=Oph_ChooseMarker${i}_d${nodeDepth}, ${near1}] ${chooseVar} ${i}`, ast.location);
        }

        //summon the armor stand for storing the result
        ctx.emitCmd(`${summonMarker} {Tags:["${chooseRes}"]}`, ast.location);
        ctx.emitCmd(`${sbPlayer} set @e[tag=${chooseRes}, ${near1}] ${chooseVar} 0`, ast.location);

        //choose one of those armor stands randomly, storing its value into the result(rngResult)
        ctx.emitCmd(`${sbPlayer} operation @e[tag=${chooseRes}, ${near1}] ${chooseVar} = @e[tag=${chooseMar}, sort=random, limit=1] ${chooseVar}`, ast.location);

        let progress = 0;
        for (const entry of entryBuffer) {
            const range =
                (entry.weight.value as number) === 1
                    ? `${progress}`
                    : `${progress}..${progress + (entry.weight.value as number) - 1}`;

            progress += (entry.weight.value as number);

            ctx.queuePrefix(`if score @e[tag=${chooseRes}, ${near1}] ${chooseVar} matches ${range}`);
            ctx.pushFrame();

            const body = await entry.body.evaluate(ctx.wrap());
            if (!body.ok) return body;
            ctx = body.ctx.branch();

            ctx.popFrame();
        }

        // cleanup commands
        ctx.emitCmd(`kill @e[tag=${chooseMar}, sort=nearest, limit=${rngMax}]`, ast.location);
        ctx.emitCmd(`kill @e[tag=${chooseRes}, ${near1}]`, ast.location);
        ctx.emitCmd(`scoreboard objectives remove ${chooseVar}`, ast.location);

        return res.makeOK({ type: "void", value: null }, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function ReturnStatement(ast: ASTTypes["ReturnStatement"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("ReturnStatement: not implemented yet", ast, _ctx.fm as FileManager) };
}
