import Parser from "./parser";
import Lexer from "./lexer";
import { ASTKind, Program } from "./ast";
import { print } from "./printer";

function parse(input: string): Program {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  return parser.parseProgram();
}

describe("parsing", () => {
  test("let statements", () => {
    const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
    `;

    const AST = parse(input);

    expect(AST).toEqual({
      kind: ASTKind.Program,
      statements: [
        {
          kind: ASTKind.Let,
          name: { kind: "IDENTIFIER", value: "x" },
          value: { kind: ASTKind.Integer, value: 5 }
        },
        {
          kind: ASTKind.Let,
          name: { kind: "IDENTIFIER", value: "y" },
          value: { kind: ASTKind.Integer, value: 10 }
        },
        {
          kind: ASTKind.Let,
          name: { kind: "IDENTIFIER", value: "foobar" },
          value: { kind: ASTKind.Integer, value: 838383 }
        }
      ]
    });
  });

  test("return statements", () => {
    const input = `
    return 5;
    return 10;
    return 993322;
    `;

    const AST = parse(input);

    expect(AST).toEqual({
      kind: ASTKind.Program,
      statements: [
        { kind: ASTKind.Return },
        { kind: ASTKind.Return },
        { kind: ASTKind.Return }
      ]
    });
  });

  test("identifier expressions", () => {
    const input = "foobar";

    const AST = parse(input);

    expect(AST).toEqual({
      kind: ASTKind.Program,
      statements: [
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.Identifier,
            value: "foobar"
          }
        }
      ]
    });
  });

  test("if expressions", () => {
    const input = "if (x < y) { x }";

    const AST = parse(input);

    expect(AST).toEqual({
      kind: ASTKind.Program,
      statements: [
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.IfExpression,
            condition: {
              kind: ASTKind.InfixExpression,
              left: { kind: ASTKind.Identifier, value: "x" },
              operator: "<",
              right: { kind: ASTKind.Identifier, value: "y" }
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
          }
        }
      ]
    });
  });

  test("if expressions with alternatives", () => {
    const input = "if (x < y) { x } else { y }";

    const AST = parse(input);

    expect(AST).toEqual({
      kind: ASTKind.Program,
      statements: [
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.IfExpression,
            condition: {
              kind: ASTKind.InfixExpression,
              left: { kind: ASTKind.Identifier, value: "x" },
              operator: "<",
              right: { kind: ASTKind.Identifier, value: "y" }
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
          }
        }
      ]
    });
  });

  test("integer literal expressions", () => {
    const input = "5;";

    const AST = parse(input);

    expect(AST).toEqual({
      kind: ASTKind.Program,
      statements: [
        {
          kind: ASTKind.ExpressionStatement,
          expression: {
            kind: ASTKind.Integer,
            value: 5
          }
        }
      ]
    });
  });

  describe("prefix operators", () => {
    const cases = [
      { input: "!5", description: "bang integer" },
      { input: "-5", description: "negative integer" },
      { input: "!true", description: "bang true" },
      { input: "!false", description: "bang false" }
    ];

    cases.forEach(({ input, description }) => {
      test(`${description}: ${input}`, () => {
        const AST = parse(input);
        expect(AST).toMatchSnapshot();
      });
    });
  });

  describe("infix operators", () => {
    const cases = [
      { input: "5 + 5", description: "adding integers" },
      { input: "5 - 5", description: "subtracting integers" },
      { input: "5 * 5", description: "multiplying integers" },
      { input: "5 / 5", description: "dividing integers" },
      { input: "5 > 5", description: "integer greater than integer" },
      { input: "5 < 5", description: "integer less then integer" },
      { input: "5 == 5", description: "integer equal to integer" },
      { input: "5 != 5", description: "integer not equal to integer" },
      { input: "false == true", description: "boolean equal to boolean" },
      { input: "true != false", description: "boolean not equal to boolean" }
    ];

    cases.forEach(({ input, description }) => {
      test(`${description}: ${input}`, () => {
        const AST = parse(input);
        expect(AST).toMatchSnapshot();
      });
    });
  });

  describe("boolean literals", () => {
    test("true", () => {
      const input = "true;";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.Bool,
              value: true
            }
          }
        ]
      });
    });

    test("false", () => {
      const input = "false;";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.Bool,
              value: false
            }
          }
        ]
      });
    });
  });

  describe("function literals", () => {
    test("with multiple params", () => {
      const input = "fn(x, y) { x + y }";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.FunctionLiteral,
              parameters: [
                {
                  kind: ASTKind.Identifier,
                  value: "x"
                },
                {
                  kind: ASTKind.Identifier,
                  value: "y"
                }
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
            }
          }
        ]
      });
    });

    test("with one param", () => {
      const input = "fn(x) { x }";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.FunctionLiteral,
              parameters: [
                {
                  kind: ASTKind.Identifier,
                  value: "x"
                }
              ],
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
            }
          }
        ]
      });
    });

    test("with no params", () => {
      const input = "fn() { 1 }";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
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
            }
          }
        ]
      });
    });
  });

  describe("call expressions", () => {
    test("with no args", () => {
      const input = "f()";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.CallExpression,
              function: {
                kind: ASTKind.Identifier,
                value: "f"
              },
              arguments: []
            }
          }
        ]
      });
    });

    test("with one arg", () => {
      const input = "f(a)";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.CallExpression,
              function: {
                kind: ASTKind.Identifier,
                value: "f"
              },
              arguments: [{ kind: ASTKind.Identifier, value: "a" }]
            }
          }
        ]
      });
    });

    test("with multiple args", () => {
      const input = "f(a, b)";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.CallExpression,
              function: {
                kind: ASTKind.Identifier,
                value: "f"
              },
              arguments: [
                { kind: ASTKind.Identifier, value: "a" },
                { kind: ASTKind.Identifier, value: "b" }
              ]
            }
          }
        ]
      });
    });

    test("on function literals", () => {
      const input = "fn(){}()";
      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.CallExpression,
              function: {
                kind: ASTKind.FunctionLiteral,
                parameters: [],
                body: {
                  kind: ASTKind.BlockStatement,
                  statements: []
                }
              },
              arguments: []
            }
          }
        ]
      });
    });
  });

  describe("operator precedence", () => {
    const cases = [
      {
        input: "-a * b",
        expected: "((-a) * b);",
        description: "prefix operator and multiplication"
      },
      {
        input: "!-a",
        expected: "(!(-a));",
        description: "two prefix operators"
      },
      {
        input: "a + b + c",
        expected: "((a + b) + c);",
        description: "addition and addition"
      },
      {
        input: "a + b - c",
        expected: "((a + b) - c);",
        description: "addition and subtraction"
      },
      {
        input: "a * b * c",
        expected: "((a * b) * c);",
        description: "multiplication and multiplication"
      },
      {
        input: "a * b / c",
        expected: "((a * b) / c);",
        description: "multiplication and division"
      },
      {
        input: "a + b / c",
        expected: "(a + (b / c));",
        description: "addition and division"
      },
      {
        input: "a + b * c + d / e - f",
        expected: "(((a + (b * c)) + (d / e)) - f);",
        description: "multiple arithmetic operators"
      },
      {
        input: "3 + 4; -5 * 5",
        expected: "(3 + 4);\n((-5) * 5);",
        description: "multiple statements"
      },
      {
        input: "5 > 4 == 3 < 4",
        expected: "((5 > 4) == (3 < 4));",
        description: "Greater than, less than, and equality"
      },
      {
        input: "5 < 4 != 3 > 4",
        expected: "((5 < 4) != (3 > 4));",
        description: "Greater than, less than, and inequality"
      },
      {
        input: "3 + 4 * 5 ==  3 * 1 + 4 * 5",
        expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)));",
        description: "Arithmetic operators and comparison operators"
      },
      {
        input: "1 + (2 + 3) + 4",
        expected: "((1 + (2 + 3)) + 4);",
        description: "Grouped expressions with addition"
      },
      {
        input: "(5 + 5) * 2",
        expected: "((5 + 5) * 2);",
        description: "Grouped expressions with addition and multiplication"
      },
      {
        input: "2 / (5 + 5)",
        expected: "(2 / (5 + 5));",
        description: "Grouped expressions with addition and division"
      },
      {
        input: "-(5 + 5)",
        expected: "(-(5 + 5));",
        description: "Grouped expressions with addition and infix operator"
      },
      {
        input: "!(true == true)",
        expected: "(!(true == true));",
        description:
          "Grouped expressions with comparison operator and infix operator"
      },
      {
        input: "a + add(b * c) + d",
        expected: "((a + add((b * c))) + d);",
        description: "Addition and call expression"
      },
      {
        input: "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
        expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)));",
        description: "Call expression with multiple expression types as args"
      },
      {
        input: "add(a + b + c * d / f + g)",
        expected: "add((((a + b) + ((c * d) / f)) + g));",
        description:
          "Call expression with multiple arithmetic operators in one arg"
      }
    ];

    cases.forEach(({ input, description, expected }) => {
      test(`${description}: ${input}`, () => {
        const AST = parse(input);
        expect(print(AST)).toBe(expected);
      });
    });
  });
});
