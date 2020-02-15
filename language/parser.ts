import {
  ASTKind,
  Expression,
  ExpressionStatement,
  Identifier,
  LetStatement,
  Program,
  ReturnStatment,
  Statement
} from "./ast";
import Lexer from "./lexer";
import { Token, TokenType } from "./token";

type PrefixParseFunction = () => Expression;
type InfixParseFunction = (epxression: Expression) => Expression;

enum Precedence {
  Lowest,
  Equals,
  LessGreater,
  Sum,
  Product,
  Prefix,
  Call
}

class Parser {
  lexer: Lexer;
  errors: string[];
  curToken: Token;
  peekToken: Token;
  // TODO: Remove Partial here once all fn's are implemented
  prefixParseFunctions: Partial<Record<TokenType, PrefixParseFunction>>;
  infixParseFunctions: Partial<Record<TokenType, InfixParseFunction>>;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();

    this.prefixParseFunctions = {
      [TokenType.Ident]: this.parseIdentifier.bind(this)
    };
    this.infixParseFunctions = {};
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
        return this.parseExpressionStatement();
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

  private parseExpressionStatement(): ExpressionStatement {
    const expression = this.parseExpression(Precedence.Lowest);

    if (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return {
      kind: ASTKind.Expression,
      expression
    };
  }

  // TODO: remove eslint-disable once arg is used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private parseExpression(_precedence: Precedence): Expression {
    const prefix = this.prefixParseFunctions[this.curToken.type];

    if (!prefix) {
      throw new Error(`No prefix parse function for ${this.curToken.type}`);
    }

    const leftExpression = prefix();

    return leftExpression;
  }

  private parseIdentifier(): Identifier {
    return {
      kind: ASTKind.Identifier,
      value: this.curToken.literal
    };
  }
}

export default Parser;
