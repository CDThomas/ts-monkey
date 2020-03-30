export enum ASTKind {
  ArrayLiteral = "ARRAY_LITERAL",
  BlockStatement = "BLOCK_STATEMENT",
  Bool = "BOOL",
  CallExpression = "CALL_EXPRESSION",
  ExpressionStatement = "EXPRESSION",
  FunctionLiteral = "FUNCTION_LITERAL",
  Identifier = "IDENTIFIER",
  IfExpression = "IF_EXPRESSION",
  InfixExpression = "INFIX_EXPRESSION",
  Integer = "INTEGER",
  Let = "LET",
  PrefixExpression = "PREFIX_EXPRESSION",
  Program = "PROGRAM",
  Return = "RETURN",
  String = "STRING"
}

export type Node = Program | Statement | Expression;

export type Statement =
  | BlockStatement
  | ExpressionStatement
  | LetStatement
  | ReturnStatment;

export type Expression =
  | ArrayLiteral
  | Bool
  | CallExpression
  | FunctionLiteral
  | Identifier
  | IfExpression
  | Integer
  | PrefixExpression
  | InfixExpression
  | Str;

export type Program = {
  kind: ASTKind.Program;
  statements: Statement[];
};

// Statements

export type BlockStatement = {
  kind: ASTKind.BlockStatement;
  statements: Statement[];
};

export type ExpressionStatement = {
  kind: ASTKind.ExpressionStatement;
  expression: Expression;
};

export type LetStatement = {
  kind: ASTKind.Let;
  name: Identifier;
  value: Expression;
};

export type ReturnStatment = {
  kind: ASTKind.Return;
  returnValue: Expression;
};

// Expressions

export type ArrayLiteral = {
  kind: ASTKind.ArrayLiteral;
  elements: Expression[];
};

export type Bool = {
  kind: ASTKind.Bool;
  value: boolean;
};

export type CallExpression = {
  kind: ASTKind.CallExpression;
  function: Identifier | FunctionLiteral;
  arguments: Expression[];
};

export type FunctionLiteral = {
  kind: ASTKind.FunctionLiteral;
  parameters: Identifier[];
  body: BlockStatement;
};

export type Identifier = {
  kind: ASTKind.Identifier;
  value: string;
};

export type IfExpression = {
  kind: ASTKind.IfExpression;
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
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

export type Str = {
  kind: ASTKind.String;
  value: string;
};
