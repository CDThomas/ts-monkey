import * as Token from "../token/token";

export type Node = {
  tokenLiteral(): string;
};

export type Statement = LetStatement;
export type Expression = Identifier;

class Program implements Node {
  statements: Statement[] = [];

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

class LetStatement implements Node {
  token: Token.Token; // the token.Let token
  name: Identifier;
  value?: Expression; // TODO: required

  constructor(token: Token.Token, name: Identifier, value?: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class Identifier implements Node {
  token: Token.Token; // the token.Ident token
  value: string;

  constructor(token: Token.Token, value: string) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export { LetStatement, Identifier, Program };
