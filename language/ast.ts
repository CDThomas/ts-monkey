export enum ASTKind {
  ExpressionStatement = "EXPRESSION",
  Identifier = "IDENTIFIER",
  InfixExpression = "INFIX_EXPRESSION",
  Integer = "INTEGER",
  Let = "LET",
  PrefixExpression = "PREFIX_EXPRESSION",
  Program = "PROGRAM",
  Return = "RETURN"
}

export type Node = Program | Statement | Expression;
export type Statement = ExpressionStatement | LetStatement | ReturnStatment;
export type Expression =
  | Identifier
  | Integer
  | PrefixExpression
  | InfixExpression;

export type Program = {
  kind: ASTKind.Program;
  statements: Statement[];
};

// Statements

export type ExpressionStatement = {
  kind: ASTKind.ExpressionStatement;
  expression: Expression;
};

export type LetStatement = {
  kind: ASTKind.Let;
  name: Identifier;
  value?: Expression;
};

export type ReturnStatment = {
  kind: ASTKind.Return;
  returnValue?: Expression;
};

// Expressions

export type Identifier = {
  kind: ASTKind.Identifier;
  value: string;
};

export type InfixExpression = {
  kind: ASTKind.InfixExpression;
  operator: string;
  left: Expression;
  right: Expression;
};

export type Integer = {
  kind: ASTKind.Integer;
  value: number;
};

export type PrefixExpression = {
  kind: ASTKind.PrefixExpression;
  operator: string;
  right: Expression;
};
