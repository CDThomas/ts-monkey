import {
  ASTKind,
  Identifier,
  LetStatement,
  Program,
  ReturnStatment,
  Statement
} from "./ast";
import Lexer from "./lexer";
import { Token, TokenType } from "./token";

class Parser {
  lexer: Lexer;
  curToken: Token;
  peekToken: Token;
  errors: string[];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram(): Program {
    const statements: Statement[] = [];
    while (this.curToken.type !== TokenType.EOF) {
      const statement = this.parseStatement();
      if (statement) {
        statements.push(statement);
      }
      this.nextToken();
    }

    return {
      kind: ASTKind.Program,
      statements
    };
  }

  private nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private parseStatement(): Statement | null {
    switch (this.curToken.type) {
      case TokenType.Let:
        return this.parseLetStatement();
      case TokenType.Return:
        return this.parseReturnStatement();
      default:
        return null;
    }
  }

  private parseLetStatement(): LetStatement | null {
    if (!this.expectPeek(TokenType.Ident)) {
      return null;
    }

    const name: Identifier = {
      kind: ASTKind.Identifier,
      value: this.curToken.literal
    };

    if (!this.expectPeek(TokenType.Assign)) {
      return null;
    }

    // TODO: don't skip expressions
    while (!this.curTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return {
      kind: ASTKind.Let,
      name
    };
  }

  private parseReturnStatement(): ReturnStatment {
    this.nextToken();

    // TODO: don't skip expressions
    while (!this.curTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return {
      kind: ASTKind.Return
    };
  }

  private curTokenIs(tokenType: TokenType): boolean {
    return this.curToken.type === tokenType;
  }

  private peekTokenIs(tokenType: TokenType): boolean {
    return this.peekToken.type === tokenType;
  }

  private expectPeek(tokenType: TokenType): boolean {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(tokenType);
      return false;
    }
  }

  private peekError(token: TokenType): void {
    const message = `expected next token to be ${token}, got ${this.peekToken.type} instead`;
    this.errors.push(message);
  }
}

export default Parser;