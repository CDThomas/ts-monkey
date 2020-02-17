export enum ASTKind {
  Expression = "EXPRESSION",
  Identifier = "IDENTIFIER",
  Integer = "INTEGER",
  Let = "LET",
  Program = "PROGRAM",
  Return = "RETURN"
}

export type Node = Program | Statement | Expression;
export type Statement = ExpressionStatement | LetStatement | ReturnStatment;
export type Expression = Identifier | Integer;

export type Program = {
  kind: ASTKind.Program;
  statements: Statement[];
};

// Statements

export type ExpressionStatement = {
  kind: ASTKind.Expression;
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
