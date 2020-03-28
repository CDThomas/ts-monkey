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
  Bool,
  Builtin,
  Environment,
  Err,
  Func,
  Integer,
  Null,
  ReturnValue,
  Str
};
