export const grammar = `

comment
  = mlComment
  | slComment
  | preservedComment
  | preservedNewline

mlComment
  = "/*" (~"*/" any)* "*/"

slComment
  = "//" (~"\\n" any)*

preservedComment
  = "/#" (~"\\n" any)*

preservedNewline
  = "/."

`