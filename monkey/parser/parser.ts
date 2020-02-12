import * as ast from "../ast/ast";
import Lexer from "../lexer/lexer";
import * as token from "../token/token";

class Parser {
  lexer: Lexer;
  curToken: token.Token;
  peekToken: token.Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram(): ast.Program {
    const program = new ast.Program();

    while (this.curToken.type !== token.TokenType.EOF) {
      const statement = this.parseStatement();
      if (statement) {
        program.statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  private nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private parseStatement(): ast.Statement | null {
    switch (this.curToken.type) {
      case token.TokenType.Let:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  private parseLetStatement(): ast.LetStatement | null {
    const statementToken = this.curToken;

    if (!this.expectPeek(token.TokenType.Ident)) {
      return null;
    }

    const name = new ast.Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(token.TokenType.Assign)) {
      return null;
    }

    // TODO: don't skip expressions
    while (!this.curTokenIs(token.TokenType.Semicolon)) {
      this.nextToken();
    }

    return new ast.LetStatement(statementToken, name);
  }

  private curTokenIs(tokenType: token.TokenType): boolean {
    return this.curToken.type === tokenType;
  }

  private peekTokenIs(tokenType: token.TokenType): boolean {
    return this.peekToken.type === tokenType;
  }

  private expectPeek(tokenType: token.TokenType): boolean {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }
}

export default Parser;