export const grammar = `

Comment  = MLComment | SLComment | PreservedComment | PreservedNewline
MLComment = "/*" any* "*/"
SLComment = "//" any* "\\n"
PreservedComment = "/#" any*
PreservedNewline = "/.\\n"

`