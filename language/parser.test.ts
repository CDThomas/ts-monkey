import Parser from "./parser";
import Lexer from "./lexer";
import { ASTKind, Program } from "./ast";

function checkParserErrors(parser: Parser): void {
  if (parser.errors.length === 0) {
    return;
  }

  throw new Error(
    `parser has ${parser.errors.length} errors.\n` +
      parser.errors.map(message => `parser error: ${message}\n`).join("")
  );
}

function parse(input: string): Program {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  checkParserErrors(parser);
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
});
