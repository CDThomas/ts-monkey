import * as Token from "../token/token";
import Lexer from "./lexer";

test("nextToken", () => {
  const input = `let five = 5;
let ten = 10;
let add = fn(x, y) {
  x + y;
};
let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
  return true;
} else {
  return false;
}
10 == 10;
10 != 9;
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
    [Token.TokenType.Bang, "!"],
    [Token.TokenType.Minus, "-"],
    [Token.TokenType.Slash, "/"],
    [Token.TokenType.Asterisk, "*"],
    [Token.TokenType.Int, "5"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.Int, "5"],
    [Token.TokenType.LT, "<"],
    [Token.TokenType.Int, "10"],
    [Token.TokenType.GT, ">"],
    [Token.TokenType.Int, "5"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.If, "if"],
    [Token.TokenType.LParen, "("],
    [Token.TokenType.Int, "5"],
    [Token.TokenType.LT, "<"],
    [Token.TokenType.Int, "10"],
    [Token.TokenType.RParen, ")"],
    [Token.TokenType.LBrace, "{"],
    [Token.TokenType.Return, "return"],
    [Token.TokenType.True, "true"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.RBrace, "}"],
    [Token.TokenType.Else, "else"],
    [Token.TokenType.LBrace, "{"],
    [Token.TokenType.Return, "return"],
    [Token.TokenType.False, "false"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.RBrace, "}"],
    [Token.TokenType.Int, "10"],
    [Token.TokenType.EQ, "=="],
    [Token.TokenType.Int, "10"],
    [Token.TokenType.Semicolon, ";"],
    [Token.TokenType.Int, "10"],
    [Token.TokenType.NOT_EQ, "!="],
    [Token.TokenType.Int, "9"],
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
