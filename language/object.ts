import { BlockStatement, Identifier } from "./ast";
import { print } from "./printer";

class Environment {
  store: { [key: string]: Obj };
  outer: Environment | null;

  constructor(outer: Environment | null = null) {
    this.outer = outer;
    this.store = {};
  }

  get(name: string): Obj | undefined {
    const value = this.store[name];

    if (!value && this.outer) {
      return this.outer.get(name);
    }

    return value;
  }

  set(name: string, value: Obj): Obj {
    this.store[name] = value;
    return value;
  }
}

// Objects

export interface Obj {
  inspect(): string;
}

class Arr implements Obj {
  elements: Obj[];

  constructor(elements: Obj[]) {
    this.elements = elements;
  }

  inspect(): string {
    const elements = this.elements.map(element => element.inspect());
    return `[${elements.join(", ")}]`;
  }
}

class Bool implements Obj {
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toString();
  }
}

type BuiltinFunction = (...args: Obj[]) => Obj;

class Builtin implements Obj {
  function: BuiltinFunction;

  constructor(func: BuiltinFunction) {
    this.function = func;
  }

  inspect(): string {
    return "builtin function";
  }
}

class Err implements Obj {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  inspect(): string {
    return `Error: ${this.message}`;
  }
}

class Func implements Obj {
  parameters: Identifier[];
  body: BlockStatement;
  environment: Environment;

  constructor(
    parameters: Identifier[],
    body: BlockStatement,
    environment: Environment
  ) {
    this.parameters = parameters;
    this.body = body;
    this.environment = environment;
  }

  inspect(): string {
    const parameters = this.parameters.map(param => param.value).join(", ");
    const body = print(this.body);
    return `fn(${parameters}) {\n  ${body}\n}`;
  }
}

export type HashKey = string | number | boolean;

export type HashPair = {
  key: Str | Integer | Bool;
  value: Obj;
};

export type HashPairs = Map<HashKey, HashPair>;

class Hash implements Obj {
  pairs: HashPairs = new Map();

  inspect(): string {
    const pairs = [];

    for (const { key, value } of this.pairs.values()) {
      pairs.push(`${key.inspect()}: ${value.inspect()}`);
    }

    return `{${pairs.join(", ")}}`;
  }
}

class Integer implements Obj {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toFixed(0);
  }
}

class Null implements Obj {
  inspect(): string {
    return "null";
  }
}

class ReturnValue implements Obj {
  value: Obj;

  constructor(value: Obj) {
    this.value = value;
  }

  inspect(): string {
    return this.value.inspect();
  }
}

class Str implements Obj {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  inspect(): string {
    return `"${this.value}"`;
  }
}

export {
  Arr,
  Bool,
  Builtin,
  Environment,
  Err,
  Func,
  Hash,
  Integer,
  Null,
  ReturnValue,
  Str
};
