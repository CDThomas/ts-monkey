import {
  ASTKind,
  Expression,
  ExpressionStatement,
  Identifier,
  Integer,
  LetStatement,
  Program,
  ReturnStatment,
  Statement
} from "./ast";
import Lexer from "./lexer";
import { Token, TokenKind } from "./token";

type PrefixParseFunction = () => Expression;
type InfixParseFunction = (expression: Expression) => Expression;

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
  curToken: Token;
  peekToken: Token;
  // TODO: Remove Partial here once all fn's are implemented
  prefixParseFunctions: Partial<Record<TokenKind, PrefixParseFunction>>;
  infixParseFunctions: Partial<Record<TokenKind, InfixParseFunction>>;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();

    this.prefixParseFunctions = {
      [TokenKind.Ident]: this.parseIdentifier.bind(this),
      [TokenKind.Integer]: this.parseInteger.bind(this)
    };
    this.infixParseFunctions = {};
  }

  parseProgram(): Program {
    const statements: Statement[] = [];
    while (this.curToken.kind !== TokenKind.EOF) {
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
    switch (this.curToken.kind) {
      case TokenKind.Let:
        return this.parseLetStatement();
      case TokenKind.Return:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseLetStatement(): LetStatement | null {
    this.expectPeek(TokenKind.Ident);

    const name: Identifier = {
      kind: ASTKind.Identifier,
      value: this.curToken.literal
    };

    this.expectPeek(TokenKind.Assign);

    // TODO: don't skip expressions
    while (!this.curTokenIs(TokenKind.Semicolon)) {
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
    while (!this.curTokenIs(TokenKind.Semicolon)) {
      this.nextToken();
    }

    return {
      kind: ASTKind.Return
    };
  }

  private curTokenIs(tokenType: TokenKind): boolean {
    return this.curToken.kind === tokenType;
  }

  private peekTokenIs(tokenType: TokenKind): boolean {
    return this.peekToken.kind === tokenType;
  }

  private expectPeek(tokenType: TokenKind): void {
    if (!this.peekTokenIs(tokenType)) {
      throw new Error(
        `expected next token to be ${tokenType}, got ${this.peekToken.kind} instead`
      );
    }

    this.nextToken();
  }

  private parseExpressionStatement(): ExpressionStatement {
    const expression = this.parseExpression(Precedence.Lowest);

    if (this.peekTokenIs(TokenKind.Semicolon)) {
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
    const prefix = this.prefixParseFunctions[this.curToken.kind];

    if (!prefix) {
      throw new Error(`No prefix parse function for ${this.curToken.kind}`);
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

  private parseInteger(): Integer {
    return {
      kind: ASTKind.Integer,
      value: parseInt(this.curToken.literal, 10)
    };
  }
}

export default Parser;
