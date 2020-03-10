import {
  ASTKind,
  BlockStatement,
  Bool,
  CallExpression,
  ExpressionStatement,
  FunctionLiteral,
  Identifier,
  IfExpression,
  InfixExpression,
  Integer,
  LetStatement,
  PrefixExpression,
  Program,
  ReturnStatment
} from "./ast";
import { print } from "./printer";

describe("printing", () => {
  test("block statements", () => {
    const node: BlockStatement = {
      kind: ASTKind.BlockStatement,
      statements: [
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.Identifier,
            value: "x"
          }
        },
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.Identifier,
            value: "y"
          }
        }
      ]
    };

    expect(print(node)).toBe("x;\ny;");
  });

  test("booleans", () => {
    const node: Bool = {
      kind: ASTKind.Bool,
      value: true
    };

    expect(print(node)).toBe("true");
  });

  test("call expressions with no arguments", () => {
    const node: CallExpression = {
      kind: ASTKind.CallExpression,
      function: {
        kind: ASTKind.Identifier,
        value: "f"
      },
      arguments: []
    };

    expect(print(node)).toBe("f()");
  });

  test("call expressions with one argument", () => {
    const node: CallExpression = {
      kind: ASTKind.CallExpression,
      function: {
        kind: ASTKind.Identifier,
        value: "f"
      },
      arguments: [{ kind: ASTKind.Identifier, value: "a" }]
    };

    expect(print(node)).toBe("f(a)");
  });

  test("call expressions with multiple arguments", () => {
    const node: CallExpression = {
      kind: ASTKind.CallExpression,
      function: {
        kind: ASTKind.Identifier,
        value: "f"
      },
      arguments: [
        { kind: ASTKind.Identifier, value: "a" },
        { kind: ASTKind.Identifier, value: "b" }
      ]
    };

    expect(print(node)).toBe("f(a, b)");
  });

  test("call expressions on function literals", () => {
    const node: CallExpression = {
      kind: ASTKind.CallExpression,
      function: {
        kind: ASTKind.FunctionLiteral,
        parameters: [],
        body: {
          kind: ASTKind.BlockStatement,
          statements: [
            {
              kind: ASTKind.ExpressionStatement,
              expression: { kind: ASTKind.Integer, value: 1 }
            }
          ]
        }
      },
      arguments: []
    };

    expect(print(node)).toBe("fn() {\n  1;\n}()");
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

  test("function literals", () => {
    const node: FunctionLiteral = {
      kind: ASTKind.FunctionLiteral,
      parameters: [
        { kind: ASTKind.Identifier, value: "x" },
        { kind: ASTKind.Identifier, value: "y" }
      ],
      body: {
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.InfixExpression,
              left: { kind: ASTKind.Identifier, value: "x" },
              operator: "+",
              right: { kind: ASTKind.Identifier, value: "y" }
            }
          }
        ]
      }
    };

    expect(print(node)).toBe("fn(x, y) {\n  (x + y);\n}");
  });

  test("function literals with one param", () => {
    const node: FunctionLiteral = {
      kind: ASTKind.FunctionLiteral,
      parameters: [{ kind: ASTKind.Identifier, value: "x" }],
      body: {
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.Identifier,
              value: "x"
            }
          }
        ]
      }
    };

    expect(print(node)).toBe("fn(x) {\n  x;\n}");
  });

  test("function literals with no params", () => {
    const node: FunctionLiteral = {
      kind: ASTKind.FunctionLiteral,
      parameters: [],
      body: {
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.Integer,
              value: 1
            }
          }
        ]
      }
    };

    expect(print(node)).toBe("fn() {\n  1;\n}");
  });

  test("identifiers", () => {
    const node: Identifier = {
      kind: ASTKind.Identifier,
      value: "x"
    };

    expect(print(node)).toBe("x");
  });

  test("if expressions", () => {
    const node: IfExpression = {
      kind: ASTKind.IfExpression,
      condition: {
        kind: ASTKind.Bool,
        value: true
      },
      consequence: {
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: { kind: ASTKind.Identifier, value: "x" }
          }
        ]
      }
    };

    expect(print(node)).toBe("if (true) {\n  x;\n}");
  });

  test("if expressions with alternatives", () => {
    const node: IfExpression = {
      kind: ASTKind.IfExpression,
      condition: {
        kind: ASTKind.Bool,
        value: true
      },
      consequence: {
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: { kind: ASTKind.Identifier, value: "x" }
          }
        ]
      },
      alternative: {
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: { kind: ASTKind.Identifier, value: "y" }
          }
        ]
      }
    };

    expect(print(node)).toBe("if (true) {\n  x;\n} else {\n  y;\n}");
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
      },
      value: {
        kind: ASTKind.Integer,
        value: 2
      }
    };

    expect(print(node)).toBe("let n = 2;");
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

    expect(print(node)).toBe("(!true)");
  });

  test("return statements", () => {
    const node: ReturnStatment = {
      kind: ASTKind.Return,
      returnValue: { kind: ASTKind.Integer, value: 9 }
    };

    expect(print(node)).toBe("return 9;");
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
