# CJS vs ESM issues 
Error [ERR_REQUIRE_CYCLE_MODULE]: Cannot require() ES Module C:\Users\...\ophoel\out\compiler\lexer.js in a cycle. A cycle involving require(esm) is not allowed to maintain invariants mandated by the ECMAScript specification. Try making at least part of the dependency in the graph lazily loaded.

1. tsconfig: module - CommonJS
2. package.json: NO type:module inside
3. all .ts -> .cts
4. use import, no require() in .cts files
5. if need to execute, always execute .cjs one (node .\out\compiler\lexer.cjs)