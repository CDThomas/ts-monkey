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

export { Bool, Integer, Null, ReturnValue };
