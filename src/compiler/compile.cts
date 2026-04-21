import { Source } from "../location.cjs";
import { FileManager, FileManagerClass } from "./file-manager.cjs";
import { parse } from "./parser.cjs";


export async function compile(source: Source, fm: FileManagerClass): Promise<string> {
    const eval_res = await parse(source).interpret(fm);
    if (!eval_res.ok) throw eval_res.err;

    return eval_res.ctx.branch().export().codeGen();
    
}