import {
  ASTKind,
  Bool,
  Expression,
  ExpressionStatement,
  Identifier,
  Integer,
  LetStatement,
  PrefixExpression,
  Program,
  ReturnStatment,
  Statement,
  InfixExpression
} from "./ast";
import Lexer from "./lexer";
import { Token, TokenKind } from "./token";

type PrefixParseFunction = () => Expression;
type InfixParseFunction = (expression: Expression) => InfixExpression;

enum Precedence {
  Lowest,
  Equals,
  LessGreater,
  Sum,
  Product,
  Prefix,
  Call
}

const precedences: Partial<Record<TokenKind, Precedence>> = {
  [TokenKind.Equal]: Precedence.Equals,
  [TokenKind.NotEqual]: Precedence.Equals,
  [TokenKind.LessThan]: Precedence.LessGreater,
  [TokenKind.GreaterThan]: Precedence.LessGreater,
  [TokenKind.Plus]: Precedence.Sum,
  [TokenKind.Minus]: Precedence.Sum,
  [TokenKind.Slash]: Precedence.Product,
  [TokenKind.Asterisk]: Precedence.Product
};

class Parser {
  lexer: Lexer;
  curToken: Token;
  peekToken: Token;
  prefixParseFunctions: Partial<Record<TokenKind, PrefixParseFunction>>;
  infixParseFunctions: Partial<Record<TokenKind, InfixParseFunction>>;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();

    this.parseBool = this.parseBool.bind(this);
    this.parseIdentifier = this.parseIdentifier.bind(this);
    this.parseInteger = this.parseInteger.bind(this);
    this.parsePrefixExpression = this.parsePrefixExpression.bind(this);
    this.parseInfixExpression = this.parseInfixExpression.bind(this);

    this.prefixParseFunctions = {
      [TokenKind.Ident]: this.parseIdentifier,
      [TokenKind.Integer]: this.parseInteger,
      [TokenKind.Bang]: this.parsePrefixExpression,
      [TokenKind.Minus]: this.parsePrefixExpression,
      [TokenKind.True]: this.parseBool,
      [TokenKind.False]: this.parseBool
    };

    this.infixParseFunctions = {
      [TokenKind.Plus]: this.parseInfixExpression,
      [TokenKind.Minus]: this.parseInfixExpression,
      [TokenKind.Slash]: this.parseInfixExpression,
      [TokenKind.Asterisk]: this.parseInfixExpression,
      [TokenKind.Equal]: this.parseInfixExpression,
      [TokenKind.NotEqual]: this.parseInfixExpression,
      [TokenKind.LessThan]: this.parseInfixExpression,
      [TokenKind.GreaterThan]: this.parseInfixExpression
    };
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
      kind: ASTKind.ExpressionStatement,
      expression
    };
  }

  private parseExpression(precedence: Precedence): Expression {
    const prefix = this.prefixParseFunctions[this.curToken.kind];

    if (!prefix) {
      throw new Error(`No prefix parse function for ${this.curToken.kind}`);
    }

    let leftExpression = prefix();

    while (
      !this.peekTokenIs(TokenKind.Semicolon) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFunctions[this.peekToken.kind];

      if (!infix) {
        return leftExpression;
      }

      this.nextToken();

      leftExpression = infix(leftExpression);
    }

    return leftExpression;
  }

  private parseBool(): Bool {
    return {
      kind: ASTKind.Bool,
      value: this.curTokenIs(TokenKind.True)
    };
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

  private parsePrefixExpression(): PrefixExpression {
    const operator = this.curToken.literal;

    this.nextToken();

    return {
      kind: ASTKind.PrefixExpression,
      operator,
      right: this.parseExpression(Precedence.Prefix)
    };
  }

  private peekPrecedence(): Precedence {
    return precedences[this.peekToken.kind] || Precedence.Lowest;
  }

  private curPrecedence(): Precedence {
    return precedences[this.curToken.kind] || Precedence.Lowest;
  }

  private parseInfixExpression(left: Expression): InfixExpression {
    const operator = this.curToken.literal;
    const precedence = this.curPrecedence();

    this.nextToken();

    const right = this.parseExpression(precedence);

    return {
      kind: ASTKind.InfixExpression,
      operator,
      left,
      right
    };
  }
}

export default Parser;
