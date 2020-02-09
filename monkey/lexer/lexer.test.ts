import * as Token from "../token/token";
import Lexer from "../lexer/lexer";

test("nextToken", () => {
  const input = `let five = 5;
let ten = 10;
let add = fn(x, y) {
  x + y;
};
let result = add(five, ten);
`;
  const tests: [Token.TokenType, string][] = [
    [Token.TokenType.Let, "let"],
    [Token.TokenType.Ident, "five"],
    [Token.TokenType.Assign, "="],
    [Token.TokenType.Int, "5"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.Let, "let"],
    [Token.TokenType.Ident, "ten"],
    [Token.TokenType.Assign, "="],
    [Token.TokenType.Int, "10"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.Let, "let"],
    [Token.TokenType.Ident, "add"],
    [Token.TokenType.Assign, "="],
    [Token.TokenType.Function, "fn"],
    [Token.TokenType.LParen, "("],
    [Token.TokenType.Ident, "x"],
    [Token.TokenType.Comma, ","],
    [Token.TokenType.Ident, "y"],
    [Token.TokenType.RParen, ")"],
    [Token.TokenType.LBrace, "{"],
    [Token.TokenType.Ident, "x"],
    [Token.TokenType.Plus, "+"],
    [Token.TokenType.Ident, "y"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.RBrace, "}"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.Let, "let"],
    [Token.TokenType.Ident, "result"],
    [Token.TokenType.Assign, "="],
    [Token.TokenType.Ident, "add"],
    [Token.TokenType.LParen, "("],
    [Token.TokenType.Ident, "five"],
    [Token.TokenType.Comma, ","],
    [Token.TokenType.Ident, "ten"],
    [Token.TokenType.RParen, ")"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.EOF, ""]
  ];

  const lexer = new Lexer(input);

  tests.forEach(([expectedType, expectedLiteral]) => {
    const token = lexer.nextToken();

    expect(token.type).toBe(expectedType);
    expect(token.literal).toBe(expectedLiteral);
  });
});
