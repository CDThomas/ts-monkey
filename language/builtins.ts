import { Builtin, Err, Integer, Obj, Str } from "./object";

export const builtins: { [key: string]: Builtin } = {
  len: new Builtin(
    (...args: Obj[]): Obj => {
      if (args.length !== 1) {
        return new Err(
          `wrong number of arguments. expected 1, got ${args.length}`
        );
      }

      const arg = args[0];

      if (!(arg instanceof Str)) {
        return new Err(
          `argument to \`len\` not supported. got ${arg.inspect()}`
        );
      }

      return new Integer(arg.value.length);
    }
  )
};
