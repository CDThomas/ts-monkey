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
import { Token, TokenType } from "./token";

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
  prefixParseFunctions: Partial<Record<TokenType, PrefixParseFunction>>;
  infixParseFunctions: Partial<Record<TokenType, InfixParseFunction>>;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();

    this.prefixParseFunctions = {
      [TokenType.Ident]: this.parseIdentifier.bind(this),
      [TokenType.Integer]: this.parseInteger.bind(this)
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
    this.expectPeek(TokenType.Ident);

    const name: Identifier = {
      kind: ASTKind.Identifier,
      value: this.curToken.literal
    };

    this.expectPeek(TokenType.Assign);

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

  private expectPeek(tokenType: TokenType): void {
    if (!this.peekTokenIs(tokenType)) {
      throw new Error(
        `expected next token to be ${tokenType}, got ${this.peekToken.type} instead`
      );
    }

    this.nextToken();
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

  private parseInteger(): Integer {
    return {
      kind: ASTKind.Integer,
      value: parseInt(this.curToken.literal, 10)
    };
  }
}

export default Parser;
