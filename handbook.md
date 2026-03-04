# CJS vs ESM issues 
Error [ERR_REQUIRE_CYCLE_MODULE]: Cannot require() ES Module C:\Users\...\ophoel\out\compiler\lexer.js in a cycle... 
A cycle involving require(esm) is not allowed to maintain invariants mandated by the ECMAScript specification...
Try making at least part of the dependency in the graph lazily loaded.

1. tsconfig: module - CommonJS
2. package.json: NO type:module inside
3. all .ts -> .cts
4. use import, no require() in .cts files
5. if need to execute, always execute .cjs one (node .\out\compiler\lexer.cjs)



# Import / Export rules
.oph (OPHoel) files 
-> compile into one .mcfunction for each file
-> cannot export anything
-> can import one or multiple .ophl files

.ophl (OPHoel Library) files
-> DOES NOT compile into a .mcfunction
-> can export struct, macro, and/or function
-> cannot import anything


# AST Types
1. Expression.value(from evaluation) is always javascript raw value
2. Expression types are determined upon evaluation (not upon initialization!)
3. Type system follows python style. Strong, Dynamic, duck typing, no manual type annotation on compilation

# ASSIGNMENTS AND EXPRESSION EXECUTION
1. Assignments (compound assignments too) are parsed at Expression parser, as an expression with side effect
2. Expression + ; is parsed as statement 