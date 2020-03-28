import { TokenKind } from "./token";
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
"foobar"
"foo bar"
`;

  const tests: [TokenKind, string][] = [
    [TokenKind.Let, "let"],
    [TokenKind.Ident, "five"],
    [TokenKind.Assign, "="],
    [TokenKind.Integer, "5"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.Let, "let"],
    [TokenKind.Ident, "ten"],
    [TokenKind.Assign, "="],
    [TokenKind.Integer, "10"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.Let, "let"],
    [TokenKind.Ident, "add"],
    [TokenKind.Assign, "="],
    [TokenKind.Function, "fn"],
    [TokenKind.LParen, "("],
    [TokenKind.Ident, "x"],
    [TokenKind.Comma, ","],
    [TokenKind.Ident, "y"],
    [TokenKind.RParen, ")"],
    [TokenKind.LBrace, "{"],
    [TokenKind.Ident, "x"],
    [TokenKind.Plus, "+"],
    [TokenKind.Ident, "y"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.RBrace, "}"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.Let, "let"],
    [TokenKind.Ident, "result"],
    [TokenKind.Assign, "="],
    [TokenKind.Ident, "add"],
    [TokenKind.LParen, "("],
    [TokenKind.Ident, "five"],
    [TokenKind.Comma, ","],
    [TokenKind.Ident, "ten"],
    [TokenKind.RParen, ")"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.Bang, "!"],
    [TokenKind.Minus, "-"],
    [TokenKind.Slash, "/"],
    [TokenKind.Asterisk, "*"],
    [TokenKind.Integer, "5"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.Integer, "5"],
    [TokenKind.LessThan, "<"],
    [TokenKind.Integer, "10"],
    [TokenKind.GreaterThan, ">"],
    [TokenKind.Integer, "5"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.If, "if"],
    [TokenKind.LParen, "("],
    [TokenKind.Integer, "5"],
    [TokenKind.LessThan, "<"],
    [TokenKind.Integer, "10"],
    [TokenKind.RParen, ")"],
    [TokenKind.LBrace, "{"],
    [TokenKind.Return, "return"],
    [TokenKind.True, "true"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.RBrace, "}"],
    [TokenKind.Else, "else"],
    [TokenKind.LBrace, "{"],
    [TokenKind.Return, "return"],
    [TokenKind.False, "false"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.RBrace, "}"],
    [TokenKind.Integer, "10"],
    [TokenKind.Equal, "=="],
    [TokenKind.Integer, "10"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.Integer, "10"],
    [TokenKind.NotEqual, "!="],
    [TokenKind.Integer, "9"],
    [TokenKind.Semicolon, ";"],
    [TokenKind.String, "foobar"],
    [TokenKind.String, "foo bar"],
    [TokenKind.EOF, ""]
  ];

  const lexer = new Lexer(input);

  tests.forEach(([expectedKind, expectedLiteral]) => {
    const token = lexer.nextToken();

    expect(token.kind).toBe(expectedKind);
    expect(token.literal).toBe(expectedLiteral);
  });
});
