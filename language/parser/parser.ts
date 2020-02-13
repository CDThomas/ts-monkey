import {
  ASTKind,
  Identifier,
  LetStatement,
  Program,
  Statement
} from "../ast/ast";
import Lexer from "../lexer/lexer";
import { Token, TokenType } from "../token/token";

class Parser {
  lexer: Lexer;
  curToken: Token;
  peekToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
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
      return false;
    }
  }
}

export default Parser;
