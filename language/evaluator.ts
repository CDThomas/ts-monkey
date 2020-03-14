import { ASTKind, Node, Statement } from "./ast";
import { Integer, Null, Obj, Bool } from "./object";

const TRUE = new Bool(true);
const FALSE = new Bool(false);
const NULL = new Null();

export function evaluate(node: Node): Obj {
  switch (node.kind) {
    case ASTKind.Bool:
      return node.value ? TRUE : FALSE;
    case ASTKind.ExpressionStatement:
      return evaluate(node.expression);
    case ASTKind.Integer:
      return new Integer(node.value);
    case ASTKind.PrefixExpression: {
      const right = evaluate(node.right);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return evalPrefixExpression(node.operator, right);
    }
    case ASTKind.Program:
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return evalStatements(node.statements);
  }

  throw new Error(`eval not implemented for ${node.kind}`);
}

function evalPrefixExpression(operator: string, right: Obj): Obj {
  switch (operator) {
    case "!":
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return evalBangOperatorExpression(right);
    case "-":
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return evalMinusPrefixOperatorExpression(right);
    default:
      return NULL;
  }
}

function evalBangOperatorExpression(right: Obj): Obj {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression(right: Obj): Obj {
  if (right instanceof Integer) {
    return new Integer(-right.value);
  }

  throw new Error(
    `evaluation error: minus prefix operator not implemented for ${right.inspect()}`
  );
}

function evalStatements(statements: Statement[]): Obj {
  let result: Obj = NULL;

  for (const statement of statements) {
    result = evaluate(statement);
  }

  return result;
}
