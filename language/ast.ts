export enum ASTKind {
  Program = "PROGRAM",
  Let = "LET",
  Identifier = "IDENTIFIER"
}

export type Node = Program | Statement | Expression;
export type Statement = LetStatement;
export type Expression = Identifier;

export type Program = {
  kind: ASTKind.Program;
  statements: Statement[];
};

export type LetStatement = {
  kind: ASTKind.Let;
  name: Identifier;
  value?: Expression;
};

export type Identifier = {
  kind: ASTKind.Identifier;
  value: string;
};
