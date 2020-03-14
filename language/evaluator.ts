/* eslint-disable @typescript-eslint/no-use-before-define */
import { ASTKind, Node, Statement } from "./ast";
import { Integer, Null, Obj, Bool } from "./object";

const TRUE = new Bool(true);
const FALSE = new Bool(false);
const NULL = new Null();

export function evaluate(node: Node): Obj {
  switch (node.kind) {
    case ASTKind.Bool:
      return nativeBooleanToBooleanObject(node.value);
    case ASTKind.ExpressionStatement:
      return evaluate(node.expression);
    case ASTKind.InfixExpression: {
      const left = evaluate(node.left);
      const right = evaluate(node.right);
      return evalInfixExpression(node.operator, left, right);
    }
    case ASTKind.Integer:
      return new Integer(node.value);
    case ASTKind.PrefixExpression: {
      const right = evaluate(node.right);
      return evalPrefixExpression(node.operator, right);
    }
    case ASTKind.Program:
      return evalStatements(node.statements);
  }

  throw new Error(`eval not implemented for ${node.kind}`);
}

function evalInfixExpression(operator: string, left: Obj, right: Obj): Obj {
  if (left instanceof Bool && right instanceof Bool) {
    return evalBooleanInfixOperator(operator, left, right);
  }
  if (left instanceof Integer && right instanceof Integer) {
    return evalIntegerInfixOperator(operator, left, right);
  }

  throw new Error(
    `evaluation error: ${operator} infix operator not implemented for ${left.inspect()} and ${right.inspect()}`
  );
}

function evalBooleanInfixOperator(
  operator: string,
  left: Bool,
  right: Bool
): Bool {
  switch (operator) {
    case "==":
      return nativeBooleanToBooleanObject(left === right);
    case "!=":
      return nativeBooleanToBooleanObject(left !== right);
  }

  throw new Error(`evaluation error: ${operator} not implemented for booleans`);
}

function evalIntegerInfixOperator(
  operator: string,
  left: Integer,
  right: Integer
): Integer | Bool {
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

  throw new Error(
    `evaluation error: ${operator} prefix operator not implemented for integers`
  );
}

function evalPrefixExpression(operator: string, right: Obj): Obj {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
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

function nativeBooleanToBooleanObject(bool: boolean): Bool {
  return bool ? TRUE : FALSE;
}
