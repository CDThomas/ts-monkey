/* eslint-disable @typescript-eslint/no-use-before-define */
import clone from "clone";
import {
  ArrayLiteral,
  ASTKind,
  IfExpression,
  Node,
  Statement,
  Identifier,
  Expression,
  IndexExpression
} from "./ast";
import { builtins } from "./builtins";
import {
  Arr,
  Bool,
  Environment,
  Err,
  Func,
  Integer,
  Null,
  Obj,
  ReturnValue,
  Str,
  Builtin
} from "./object";

const TRUE = new Bool(true);
const FALSE = new Bool(false);
const NULL = new Null();

export function evaluate(node: Node, environment: Environment): Obj {
  switch (node.kind) {
    case ASTKind.ArrayLiteral:
      return evalArrayLiteral(node, environment);
    case ASTKind.BlockStatement:
      return evalStatements(node.statements, environment);
    case ASTKind.Bool:
      return nativeBooleanToBooleanObject(node.value);
    case ASTKind.CallExpression: {
      const func = evaluate(node.function, environment);
      if (isError(func)) {
        return func;
      }
      const args = evalExpressions(node.arguments, environment);
      if (args.length === 1 && isError(args[0])) {
        return args[0];
      }

      return applyFunction(func, args);
    }
    case ASTKind.IfExpression:
      return evalIfExpression(node, environment);
    case ASTKind.ExpressionStatement:
      return evaluate(node.expression, environment);
    case ASTKind.FunctionLiteral:
      return new Func(node.parameters, node.body, clone(environment));
    case ASTKind.IndexExpression:
      return evalIndexExpression(node, environment);
    case ASTKind.InfixExpression: {
      const left = evaluate(node.left, environment);
      if (isError(left)) return left;

      const right = evaluate(node.right, environment);
      if (isError(right)) return right;

      return evalInfixExpression(node.operator, left, right);
    }
    case ASTKind.Integer:
      return new Integer(node.value);
    case ASTKind.Let: {
      const value = evaluate(node.value, environment);
      if (isError(value)) {
        return value;
      }
      environment.set(node.name.value, value);
      return NULL;
    }
    case ASTKind.Identifier:
      return evalIdentifier(node, environment);
    case ASTKind.PrefixExpression: {
      const right = evaluate(node.right, environment);
      if (isError(right)) return right;

      return evalPrefixExpression(node.operator, right);
    }
    case ASTKind.Program:
      return evalProgram(node.statements, environment);
    case ASTKind.Return: {
      const value = evaluate(node.returnValue, environment);
      if (isError(value)) return value;

      return new ReturnValue(value);
    }
    case ASTKind.String:
      return new Str(node.value);
  }
}

function evalArrayLiteral(
  node: ArrayLiteral,
  environment: Environment
): Arr | Err {
  const elements = evalExpressions(node.elements, environment);

  const first = elements[0];
  if (elements.length === 1 && isError(first)) {
    return first;
  }

  return new Arr(elements);
}

function evalIfExpression(node: IfExpression, environment: Environment): Obj {
  const condition = evaluate(node.condition, environment);

  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(node.consequence, environment);
  }

  if (node.alternative) {
    return evaluate(node.alternative, environment);
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
  if (left instanceof Str && right instanceof Str) {
    return evalStringInfixOperator(operator, left, right);
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

function evalIdentifier(node: Identifier, environment: Environment): Obj {
  const value = environment.get(node.value);
  if (value) return value;

  const builtin = builtins[node.value];
  if (builtin) return builtin;

  return new Err(`identifier not found: ${node.value}`);
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

function evalStringInfixOperator(
  operator: string,
  left: Str,
  right: Str
): Str | Err {
  if (operator === "+") {
    return new Str(left.value + right.value);
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

function evalIndexExpression(
  node: IndexExpression,
  environment: Environment
): Obj {
  const left = evaluate(node.left, environment);
  const index = evaluate(node.index, environment);

  if (isError(left)) {
    return left;
  }

  if (isError(index)) {
    return index;
  }

  if (left instanceof Arr && index instanceof Integer) {
    const value = left.elements[index.value];
    return value || NULL;
  }

  return new Err(
    `index operator not supported: ${left.inspect()}[${index.inspect()}]`
  );
}

function evalExpressions(
  expressions: Expression[],
  environment: Environment
): Obj[] {
  const result: Obj[] = [];

  for (const expression of expressions) {
    const evaluated = evaluate(expression, environment);

    if (isError(evaluated)) {
      return [evaluated];
    }

    result.push(evaluated);
  }

  return result;
}

function evalStatements(
  statements: Statement[],
  environment: Environment
): Obj {
  let result: Obj = NULL;

  for (const statement of statements) {
    result = evaluate(statement, environment);

    if (result instanceof Err || result instanceof ReturnValue) {
      return result;
    }
  }

  return result;
}

function evalProgram(statements: Statement[], environment: Environment): Obj {
  let result: Obj = NULL;

  for (const statement of statements) {
    result = evaluate(statement, environment);

    if (result instanceof Err) {
      return result;
    }
    if (result instanceof ReturnValue) {
      return result.value;
    }
  }

  return result;
}

function applyFunction(func: Obj, args: Obj[]): Obj {
  if (func instanceof Func) {
    const extendedEnv = extendFunctionEnv(func, args);
    const evaluated = evaluate(func.body, extendedEnv);
    return unwrapReturnValue(evaluated);
  }

  if (func instanceof Builtin) {
    return func.function(...args);
  }

  return new Err(`not a function: ${func.inspect()}`);
}

function extendFunctionEnv(func: Func, args: Obj[]): Environment {
  const environment = new Environment(func.environment);
  const params = func.parameters;

  for (let i = 0; i < args.length; i++) {
    environment.set(params[i].value, args[i]);
  }

  return environment;
}

function unwrapReturnValue(obj: Obj): Obj {
  if (obj instanceof ReturnValue) {
    return obj.value;
  }

  return obj;
}

function nativeBooleanToBooleanObject(bool: boolean): Bool {
  return bool ? TRUE : FALSE;
}

function isTruthy(obj: Obj): boolean {
  return obj !== FALSE && obj !== NULL;
}

function isError(obj: Obj): obj is Err {
  return obj instanceof Err;
}
