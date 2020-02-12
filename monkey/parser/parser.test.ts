import Parser from "./parser";
import Lexer from "../lexer/lexer";
import * as AST from "../ast/ast";

function assertLetStatement(
  statement: AST.Statement,
  expectedName: string
): void {
  expect(statement.tokenLiteral()).toBe("let");
  expect(statement).toBeInstanceOf(AST.LetStatement);
  if (statement instanceof AST.LetStatement) {
    expect(statement.name.value).toBe(expectedName);
    expect(statement.name.tokenLiteral()).toBe(expectedName);
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
