export enum ASTKind {
  Identifier = "IDENTIFIER",
  Let = "LET",
  Program = "PROGRAM",
  Return = "RETURN"
}

export type Node = Program | Statement | Expression;
export type Statement = LetStatement | ReturnStatment;
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

export type ReturnStatment = {
  kind: ASTKind.Return;
  returnValue?: Expression;
};
