import { Token, TokenType, lookupIdentifier } from "./token";

export default class Lexer {
  input: string;
  position = 0;
  readPosition = 0;
  ch: string | null = "";

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = null;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  nextToken(): Token {
    let token: Token;

    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = this.newToken(TokenType.EQ, literal);
        } else {
          token = this.newToken(TokenType.Assign, this.ch);
        }
        break;
      case "+":
        token = this.newToken(TokenType.Plus, this.ch);
        break;
      case "-":
        token = this.newToken(TokenType.Minus, this.ch);
        break;
      case "!":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = this.newToken(TokenType.NOT_EQ, literal);
        } else {
          token = this.newToken(TokenType.Bang, this.ch);
        }
        break;
      case "/":
        token = this.newToken(TokenType.Slash, this.ch);
        break;
      case "*":
        token = this.newToken(TokenType.Asterisk, this.ch);
        break;
      case "<":
        token = this.newToken(TokenType.LT, this.ch);
        break;
      case ">":
        token = this.newToken(TokenType.GT, this.ch);
        break;
      case ";":
        token = this.newToken(TokenType.Semicolon, this.ch);
        break;
      case "(":
        token = this.newToken(TokenType.LParen, this.ch);
        break;
      case ")":
        token = this.newToken(TokenType.RParen, this.ch);
        break;
      case ",":
        token = this.newToken(TokenType.Comma, this.ch);
        break;
      case "{":
        token = this.newToken(TokenType.LBrace, this.ch);
        break;
      case "}":
        token = this.newToken(TokenType.RBrace, this.ch);
        break;
      case null:
        token = this.newToken(TokenType.EOF, "");
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          return this.newToken(lookupIdentifier(literal), literal);
        } else if (this.isDigit(this.ch)) {
          return this.newToken(TokenType.Int, this.readNumber());
        } else {
          token = this.newToken(TokenType.Illegal, this.ch);
        }
    }

    this.readChar();
    return token;
  }

  private newToken(tokenType: TokenType, ch: string): Token {
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

  private skipWhitespace(): void {
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
