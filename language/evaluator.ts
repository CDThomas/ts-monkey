/* eslint-disable @typescript-eslint/no-use-before-define */
import { ASTKind, IfExpression, Node, Statement } from "./ast";
import { Bool, Err, Integer, Null, Obj, ReturnValue } from "./object";

const TRUE = new Bool(true);
const FALSE = new Bool(false);
const NULL = new Null();

export function evaluate(node: Node): Obj {
  switch (node.kind) {
    case ASTKind.BlockStatement:
      return evalStatements(node.statements);
    case ASTKind.Bool:
      return nativeBooleanToBooleanObject(node.value);
    case ASTKind.IfExpression:
      return evalIfExpression(node);
    case ASTKind.ExpressionStatement:
      return evaluate(node.expression);
    case ASTKind.InfixExpression: {
      const left = evaluate(node.left);
      if (isError(left)) return left;

      const right = evaluate(node.right);
      if (isError(right)) return right;

      return evalInfixExpression(node.operator, left, right);
    }
    case ASTKind.Integer:
      return new Integer(node.value);
    case ASTKind.PrefixExpression: {
      const right = evaluate(node.right);
      if (isError(right)) return right;

      return evalPrefixExpression(node.operator, right);
    }
    case ASTKind.Return: {
      const value = evaluate(node.returnValue);
      if (isError(value)) return value;

      return new ReturnValue(value);
    }
    case ASTKind.Program:
      return evalProgram(node.statements);
  }

  throw new Error(`eval not implemented for ${node.kind}`);
}

function evalIfExpression(node: IfExpression): Obj {
  const condition = evaluate(node.condition);

  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(node.consequence);
  }

  if (node.alternative) {
    return evaluate(node.alternative);
  }

  return NULL;
}

function evalInfixExpression(operator: string, left: Obj, right: Obj): Obj {
  if (left instanceof Bool && right instanceof Bool) {
    return evalBooleanInfixOperator(operator, left, right);
  }
  if (left instanceof Integer && right instanceof Integer) {
    return evalIntegerInfixOperator(operator, left, right);
  }

  return new Err(
    `type mismatch: ${left.inspect()} ${operator} ${right.inspect()}`
  );
}

function evalBooleanInfixOperator(
  operator: string,
  left: Bool,
  right: Bool
): Bool | Err {
  switch (operator) {
    case "==":
      return nativeBooleanToBooleanObject(left === right);
    case "!=":
      return nativeBooleanToBooleanObject(left !== right);
  }

  return new Err(
    `unknown operator: ${left.inspect()} ${operator} ${right.inspect()}`
  );
}

function evalIntegerInfixOperator(
  operator: string,
  left: Integer,
  right: Integer
): Integer | Bool | Err {
  switch (operator) {
    case "+":
      return new Integer(left.value + right.value);
    case "-":
      return new Integer(left.value - right.value);
    case "*":
      return new Integer(left.value * right.value);
    case "/":
      if (right.value === 0) {
        throw new Error("evaluation error: cannot divide by zero");
      }
      return new Integer(Math.floor(left.value / right.value));
    case "<":
      return nativeBooleanToBooleanObject(left.value < right.value);
    case ">":
      return nativeBooleanToBooleanObject(left.value > right.value);
    case "==":
      return nativeBooleanToBooleanObject(left.value == right.value);
    case "!=":
      return nativeBooleanToBooleanObject(left.value != right.value);
  }

  return new Err(
    `unknown operator: ${left.inspect()} ${operator} ${right.inspect()}`
  );
}

function evalPrefixExpression(operator: string, right: Obj): Obj {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return new Err(`unknown operator: ${operator}${right.inspect()}`);
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

  return new Err(`unknown operator: -${right.inspect()}`);
}

function evalStatements(statements: Statement[]): Obj {
  let result: Obj = NULL;

  for (const statement of statements) {
    result = evaluate(statement);

    if (result instanceof Err || result instanceof ReturnValue) {
      return result;
    }
  }

  return result;
}

function evalProgram(statements: Statement[]): Obj {
  let result: Obj = NULL;

  for (const statement of statements) {
    result = evaluate(statement);

    if (result instanceof Err) {
      return result;
    }
    if (result instanceof ReturnValue) {
      return result.value;
    }
  }

  return result;
}

function nativeBooleanToBooleanObject(bool: boolean): Bool {
  return bool ? TRUE : FALSE;
}

function isTruthy(obj: Obj): boolean {
  return obj !== FALSE && obj !== NULL;
}

function isError(obj: Obj): boolean {
  return obj instanceof Err;
}
