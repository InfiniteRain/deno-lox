type TokenType =
  | { type: "left_paren" }
  | { type: "right_paren" }
  | { type: "left_brace" }
  | { type: "right_brace" }
  | { type: "comma" }
  | { type: "dot" }
  | { type: "minus" }
  | { type: "plus" }
  | { type: "semicolon" }
  | { type: "slash" }
  | { type: "star" }

  // one or two character tokens
  | { type: "bang" }
  | { type: "bang_equal" }
  | { type: "equal" }
  | { type: "equal_equal" }
  | { type: "greater" }
  | { type: "greater_equal" }
  | { type: "less" }
  | { type: "less_equal" }

  // literals
  | { type: "identifier"; literal: string }
  | { type: "string"; literal: string }
  | { type: "number"; literal: number }

  // keywords
  | { type: "and" }
  | { type: "class" }
  | { type: "else" }
  | { type: "false" }
  | { type: "fun" }
  | { type: "for" }
  | { type: "if" }
  | { type: "nil" }
  | { type: "or" }
  | { type: "print" }
  | { type: "return" }
  | { type: "super" }
  | { type: "this" }
  | { type: "true" }
  | { type: "var" }
  | { type: "while" }

  // misc
  | { type: "eof" };

type Token = TokenType & {
  lexeme: string;
  line: number;
};

export type { TokenType, Token };
