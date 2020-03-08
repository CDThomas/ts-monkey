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
        { kind: ASTKind.Let, name: { kind: "IDENTIFIER", value: "x" } },
        { kind: ASTKind.Let, name: { kind: "IDENTIFIER", value: "y" } },
        { kind: ASTKind.Let, name: { kind: "IDENTIFIER", value: "foobar" } }
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

  test.only("if expressions with alternatives", () => {
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
