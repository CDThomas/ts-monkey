export enum TokenKind {
  Illegal = "ILLEGAL",
  EOF = "EOF",

  // Identifiers + literals
  Ident = "IDENT",
  Integer = "INTEGER",
  String = "STRING",

  // Operators
  Assign = "=",
  Plus = "+",
  Minus = "-",
  Bang = "!",
  Asterisk = "*",
  Slash = "/",

  LessThan = "<",
  GreaterThan = ">",

  Equal = "==",
  NotEqual = "!=",

  // Delimiters
  Comma = ",",
  Semicolon = ";",
  LParen = "(",
  RParen = ")",
  LBrace = "{",
  RBrace = "}",
  LBracket = "[",
  RBracket = "]",

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
  kind: TokenKind;
  literal: string;
};

const keywords: { [keyword: string]: TokenKind } = {
  fn: TokenKind.Function,
  let: TokenKind.Let,
  true: TokenKind.True,
  false: TokenKind.False,
  if: TokenKind.If,
  else: TokenKind.Else,
  return: TokenKind.Return
};

export function lookupIdentifier(identifier: string): TokenKind {
  return keywords[identifier] || TokenKind.Ident;
}
