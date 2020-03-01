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
    test("!", () => {
      const input = "!5";

      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.PrefixExpression,
              operator: "!",
              right: {
                kind: ASTKind.Integer,
                value: 5
              }
            }
          }
        ]
      });
    });

    test("-", () => {
      const input = "-15";

      const AST = parse(input);

      expect(AST).toEqual({
        kind: ASTKind.Program,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.PrefixExpression,
              operator: "-",
              right: {
                kind: ASTKind.Integer,
                value: 15
              }
            }
          }
        ]
      });
    });
  });
});
