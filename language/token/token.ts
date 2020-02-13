export enum TokenType {
  Illegal = "ILLEGAL",
  EOF = "EOF",

  // Identifiers + literals
  Ident = "IDENT",
  Int = "INT",

  // Operators
  Assign = "=",
  Plus = "+",
  Minus = "-",
  Bang = "!",
  Asterisk = "*",
  Slash = "/",

  LT = "<",
  GT = ">",

  EQ = "==",
  NOT_EQ = "!=",

  // Delimiters
  Comma = ",",
  Semicolon = ";",
  LParen = "(",
  RParen = ")",
  LBrace = "{",
  RBrace = "}",

  // Keywords
  Function = "FUNCTION",
  Let = "LET",
  True = "TRUE",
  False = "FALSE",
  If = "IF",
  Else = "ELSE",
  Return = "RETURN"
}

export type Token = {
  type: TokenType;
  literal: string;
};

const keywords: { [keyword: string]: TokenType } = {
  fn: TokenType.Function,
  let: TokenType.Let,
  true: TokenType.True,
  false: TokenType.False,
  if: TokenType.If,
  else: TokenType.Else,
  return: TokenType.Return
};

export function lookupIdentifier(identifier: string): TokenType {
  return keywords[identifier] || TokenType.Ident;
}
