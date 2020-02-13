import Parser from "./parser";
import Lexer from "./lexer";
import * as AST from "./ast";

function assertLetStatement(
  statement: AST.Statement,
  expectedName: string
): void {
  expect(statement.kind).toBe(AST.ASTKind.Let);
  if (statement.kind === AST.ASTKind.Let) {
    expect(statement.name.value).toBe(expectedName);
  }
}

test("let statements", () => {
  const input = `
  let x = 5;
  let y = 10;
  let foobar = 838383;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);

  const program = parser.parseProgram();

  expect(program).not.toBe(null);
  expect(program.statements).toHaveLength(3);

  ["x", "y", "foobar"].forEach((expectedName, i) => {
    const statement = program.statements[i];
    assertLetStatement(statement, expectedName);
  });
});
