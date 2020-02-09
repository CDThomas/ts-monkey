enum TokenType {
  Illegal = "ILLEGAL",
  EOF = "EOF",

  // Identifiers + literals
  Ident = "IDENT",
  Int = "INT",

  // Operators
  Assign = "=",
  Plus = "+",

  // Delimiters
  Comma = ",",
  Semicolon = ";",
  LParen = "(",
  RParen = ")",
  LBrace = "{",
  RBrace = "}",

  // Keywords
  Function = "FUNCTION",
  Let = "LET"
}

export type Token = {
  type: TokenType;
  literal: string;
};

const keywords: { [keyword: string]: TokenType } = {
  fn: TokenType.Function,
  let: TokenType.Let
};

function lookupIdentifier(identifier: string): TokenType {
  return keywords[identifier] || TokenType.Ident;
}

export { lookupIdentifier, TokenType };
