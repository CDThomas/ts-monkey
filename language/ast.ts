export enum ASTKind {
  ExpressionStatement = "EXPRESSION",
  Identifier = "IDENTIFIER",
  Integer = "INTEGER",
  Let = "LET",
  PrefixExpression = "PREFIX_EXPRESSION",
  Program = "PROGRAM",
  Return = "RETURN"
}

export type Node = Program | Statement | Expression;
export type Statement = ExpressionStatement | LetStatement | ReturnStatment;
export type Expression = Identifier | Integer | PrefixExpression;

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

export type Integer = {
  kind: ASTKind.Integer;
  value: number;
};

export type PrefixExpression = {
  kind: ASTKind.PrefixExpression;
  operator: string;
  right: Expression;
};
