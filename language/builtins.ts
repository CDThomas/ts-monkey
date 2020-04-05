import { Arr, Builtin, Err, Integer, Obj, Str } from "./object";
import { NULL } from "./evaluator";

export const builtins: { [key: string]: Builtin } = {
  len: new Builtin(
    (...args: Obj[]): Obj => {
      if (args.length !== 1) {
        return new Err(
          `wrong number of arguments. expected 1, got ${args.length}`
        );
      }

      const arg = args[0];

      if (arg instanceof Str) {
        return new Integer(arg.value.length);
      }

      if (arg instanceof Arr) {
        return new Integer(arg.elements.length);
      }

      return new Err(`argument to \`len\` not supported. got ${arg.inspect()}`);
    }
  ),
  first: new Builtin(
    (...args: Obj[]): Obj => {
      if (args.length !== 1) {
        return new Err(
          `wrong number of arguments. expected 1, got ${args.length}`
        );
      }

      const arg = args[0];

      if (arg instanceof Arr) {
        return arg.elements[0] || NULL;
      }

      return new Err(
        `argument to \`first\` not supported. got ${arg.inspect()}`
      );
    }
  ),
  last: new Builtin(
    (...args: Obj[]): Obj => {
      if (args.length !== 1) {
        return new Err(
          `wrong number of arguments. expected 1, got ${args.length}`
        );
      }

      const arg = args[0];

      if (arg instanceof Arr) {
        return arg.elements[arg.elements.length - 1] || NULL;
      }

      return new Err(
        `argument to \`last\` not supported. got ${arg.inspect()}`
      );
    }
  ),
  rest: new Builtin(
    (...args: Obj[]): Obj => {
      if (args.length !== 1) {
        return new Err(
          `wrong number of arguments. expected 1, got ${args.length}`
        );
      }

      const arg = args[0];

      if (arg instanceof Arr) {
        const rest = arg.elements.slice(1, arg.elements.length);
        return rest.length > 0 ? new Arr(rest) : NULL;
      }

      return new Err(
        `argument to \`rest\` not supported. got ${arg.inspect()}`
      );
    }
  ),
  push: new Builtin(
    (...args: Obj[]): Obj => {
      if (args.length !== 2) {
        return new Err(
          `wrong number of arguments. expected 2, got ${args.length}`
        );
      }

      const [array, element] = args;

      if (array instanceof Arr) {
        return new Arr([...array.elements, element]);
      }

      return new Err(
        `first argument to \`push\` must be an array. got ${array.inspect()}`
      );
    }
  )
};
