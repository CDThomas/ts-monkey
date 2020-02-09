import * as Token from "../token/token";

export default class Lexer {
  input: string;
  position: number = 0;
  readPosition: number = 0;
  ch: string | null = "";

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = null;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  nextToken(): Token.Token {
    let token: Token.Token;

    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = this.newToken(Token.TokenType.EQ, literal);
        } else {
          token = this.newToken(Token.TokenType.Assign, this.ch);
        }
        break;
      case "+":
        token = this.newToken(Token.TokenType.Plus, this.ch);
        break;
      case "-":
        token = this.newToken(Token.TokenType.Minus, this.ch);
        break;
      case "!":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = this.newToken(Token.TokenType.NOT_EQ, literal);
        } else {
          token = this.newToken(Token.TokenType.Bang, this.ch);
        }
        break;
      case "/":
        token = this.newToken(Token.TokenType.Slash, this.ch);
        break;
      case "*":
        token = this.newToken(Token.TokenType.Asterisk, this.ch);
        break;
      case "<":
        token = this.newToken(Token.TokenType.LT, this.ch);
        break;
      case ">":
        token = this.newToken(Token.TokenType.GT, this.ch);
        break;
      case ";":
        token = this.newToken(Token.TokenType.Semicolon, this.ch);
        break;
      case "(":
        token = this.newToken(Token.TokenType.LParen, this.ch);
        break;
      case ")":
        token = this.newToken(Token.TokenType.RParen, this.ch);
        break;
      case ",":
        token = this.newToken(Token.TokenType.Comma, this.ch);
        break;
      case "+":
        token = this.newToken(Token.TokenType.Plus, this.ch);
        break;
      case "{":
        token = this.newToken(Token.TokenType.LBrace, this.ch);
        break;
      case "}":
        token = this.newToken(Token.TokenType.RBrace, this.ch);
        break;
      case null:
        token = this.newToken(Token.TokenType.EOF, "");
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          return this.newToken(Token.lookupIdentifier(literal), literal);
        } else if (this.isDigit(this.ch)) {
          return this.newToken(Token.TokenType.Int, this.readNumber());
        } else {
          token = this.newToken(Token.TokenType.Illegal, this.ch);
        }
    }

    this.readChar();
    return token;
  }

  private newToken(tokenType: Token.TokenType, ch: string): Token.Token {
    return { type: tokenType, literal: ch };
  }

  private readIdentifier(): string {
    const position = this.position;
    while (this.ch && this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  // TODO: unicode support
  private isLetter(ch: string): boolean {
    return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch == "_";
  }

  private skipWhitespace() {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  private readNumber(): string {
    const position = this.position;
    while (this.ch && this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  private isDigit(ch: string): boolean {
    return "0" <= ch && ch <= "9";
  }

  private peekChar(): string | null {
    if (this.readPosition >= this.input.length) {
      return null;
    }
    return this.input[this.readPosition];
  }
}
