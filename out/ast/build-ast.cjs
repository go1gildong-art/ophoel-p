"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTCollection = void 0;
const Literals = __importStar(require("./expressions/literals.cjs"));
const Operations = __importStar(require("./expressions/operations.cjs"));
const ast_1 = require("../../compiler-old/ast");
const var_assign_cjs_1 = require("./expressions/var-assign.cjs");
const compound_assign_cjs_1 = require("./expressions/compound-assign.cjs");
const choose_cjs_1 = require("./statements/choose.cjs");
const for_of_cjs_1 = require("./statements/for-of.cjs");
const for_cjs_1 = require("./statements/for.cjs");
const if_cjs_1 = require("./statements/if.cjs");
const mc_command_cjs_1 = require("./statements/mc-command.cjs");
const mc_exec_cjs_1 = require("./statements/mc-exec.cjs");
const repeat_cjs_1 = require("./statements/repeat.cjs");
const while_cjs_1 = require("./statements/while.cjs");
const execute_expr_cjs_1 = require("./statements/execute-expr.cjs");
const fn_decl_cjs_1 = require("./statements/declarations/fn-decl.cjs");
const macro_decl_cjs_1 = require("./statements/declarations/macro-decl.cjs");
const struct_decl_cjs_1 = require("./statements/declarations/struct-decl.cjs");
const var_decl_cjs_1 = require("./statements/declarations/var-decl.cjs");
const fn_call_cjs_1 = require("./expressions/calls/fn-call.cjs");
const macro_call_cjs_1 = require("./expressions/calls/macro-call.cjs");
const include_cjs_1 = require("./preprocesses/include.cjs");
const block_cjs_1 = require("./block.cjs");
const program_cjs_1 = require("./program.cjs");
exports.ASTCollection = {
    Block: block_cjs_1.Block,
    Program: program_cjs_1.Program,
    BoolLiteral: Literals.BoolLiteral,
    CompoundLiteral: Literals.CompoundLiteral,
    FloatLiteral: Literals.FloatLiteral,
    IntLiteral: Literals.IntLiteral,
    StringLiteral: Literals.StringLiteral,
    TemplateStringLiteral: Literals.TemplateStringLiteral,
    VectorLiteral: Literals.VectorLiteral,
    BinaryOperation: Operations.BinaryOperation,
    PreUnary: Operations.PreUnary,
    PostUnary: Operations.PostUnary,
    IndexAccess: Operations.IndexAccess,
    MemberAccess: Operations.MemberAccess,
    VariableAssign: var_assign_cjs_1.VariableAssign,
    CompoundAssign: compound_assign_cjs_1.CompoundAssign,
    FunctionCall: fn_call_cjs_1.FunctionCall,
    MacroCall: macro_call_cjs_1.MacroCall,
    Identifier: ast_1.Identifier,
    ChooseStatement: choose_cjs_1.ChooseStatement,
    ForStatement: for_cjs_1.ForStatement,
    ForOfStatement: for_of_cjs_1.ForOfStatement,
    IfStatement: if_cjs_1.IfStatement,
    McCommand: mc_command_cjs_1.McCommand,
    McExecStatement: mc_exec_cjs_1.McExecStatement,
    RepeatStatement: repeat_cjs_1.RepeatStatement,
    WhileStatement: while_cjs_1.WhileStatement,
    ExecuteExpression: execute_expr_cjs_1.ExecuteExpression,
    FunctionDecl: fn_decl_cjs_1.FunctionDecl,
    MacroDecl: macro_decl_cjs_1.MacroDecl,
    StructDecl: struct_decl_cjs_1.StructDecl,
    VariableDecl: var_decl_cjs_1.VariableDecl,
    Include: include_cjs_1.Include
};
//# sourceMappingURL=build-ast.cjs.map