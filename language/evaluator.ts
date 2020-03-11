import { ASTKind, Node, Statement } from "./ast";
import { Integer, Null, Obj } from "./object";

export function evaluate(node: Node): Obj {
  switch (node.kind) {
    case ASTKind.ExpressionStatement:
      return evaluate(node.expression);
    case ASTKind.Integer:
      return new Integer(node.value);
    case ASTKind.Program:
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return evalStatements(node.statements);
  }

  throw new Error(`eval not implemented for ${node.kind}`);
}

function evalStatements(statements: Statement[]): Obj {
  let result: Obj = new Null();

  for (const statement of statements) {
    result = evaluate(statement);
  }

  return result;
}