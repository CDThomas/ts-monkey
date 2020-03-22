class Environment {
  store: { [key: string]: Obj } = {};

  get(name: string): Obj | undefined {
    return this.store[name];
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

class Err implements Obj {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  inspect(): string {
    return `Error: ${this.message}`;
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

export { Bool, Environment, Err, Integer, Null, ReturnValue };
