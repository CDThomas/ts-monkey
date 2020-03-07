import Parser from "./parser";
import Lexer from "./lexer";
import { ASTKind, Program } from "./ast";

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
      { input: "-a * b", description: "prefix operator and multiplication" },
      { input: "!-a", description: "two prefix operators" },
      { input: "a + b + c", description: "addition and addition" },
      { input: "a + b - c", description: "addition and subtraction" },
      { input: "a * b * c", description: "multiplication and multiplication" },
      { input: "a * b / c", description: "multiplication and division" },
      { input: "a + b / c", description: "addition and division" },
      {
        input: "a + b * c + d / e - f",
        description: "multiple arithmetic operators"
      },
      { input: "3 + 4; -5 * 5", description: "multiple statements" },
      { input: "3 > 5 == false", description: "greater than and equality" },
      { input: "3 < 5 == true", description: "less than and equality" }
    ];

    cases.forEach(({ input, description }) => {
      test(`${description}: ${input}`, () => {
        const AST = parse(input);
        expect(AST).toMatchSnapshot();
      });
    });
  });
});
