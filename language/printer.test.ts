import {
  ASTKind,
  Bool,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  Integer,
  LetStatement,
  PrefixExpression,
  ReturnStatment,
  Program
} from "./ast";
import { print } from "./printer";

describe("printing", () => {
  test("booleans", () => {
    const node: Bool = {
      kind: ASTKind.Bool,
      value: true
    };

    expect(print(node)).toBe("true");
  });

  test("expression statements", () => {
    const node: ExpressionStatement = {
      kind: ASTKind.ExpressionStatement,
      expression: {
        kind: ASTKind.Bool,
        value: false
      }
    };

    expect(print(node)).toBe("false;");
  });

  test("identifiers", () => {
    const node: Identifier = {
      kind: ASTKind.Identifier,
      value: "x"
    };

    expect(print(node)).toBe("x");
  });

  test("infix expressions", () => {
    const node: InfixExpression = {
      kind: ASTKind.InfixExpression,
      operator: "+",
      left: {
        kind: ASTKind.Integer,
        value: 1
      },
      right: {
        kind: ASTKind.Integer,
        value: 2
      }
    };

    expect(print(node)).toBe("(1 + 2)");
  });

  test("integers", () => {
    const node: Integer = {
      kind: ASTKind.Integer,
      value: 7
    };

    expect(print(node)).toBe("7");
  });

  test("let statements", () => {
    const node: LetStatement = {
      kind: ASTKind.Let,
      name: {
        kind: ASTKind.Identifier,
        value: "n"
      }
    };

    expect(print(node)).toBe("let n;");
  });

  test("prefix expressions", () => {
    const node: PrefixExpression = {
      kind: ASTKind.PrefixExpression,
      operator: "!",
      right: {
        kind: ASTKind.Bool,
        value: true
      }
    };

    expect(print(node)).toBe("!true");
  });

  test("return statements", () => {
    const node: ReturnStatment = {
      kind: ASTKind.Return
    };

    expect(print(node)).toBe("return;");
  });

  test("programs", () => {
    const node: Program = {
      kind: ASTKind.Program,
      statements: [
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.Integer,
            value: 8
          }
        },
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.Bool,
            value: true
          }
        }
      ]
    };

    expect(print(node)).toBe("8;\ntrue;");
  });
});
