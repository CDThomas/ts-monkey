import Lexer from "./lexer";
import Parser from "./parser";
import { evaluate } from "./evaluator";
import { Integer, Obj } from "./object";

function doEval(input: string): Obj {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  return evaluate(program);
}

describe("evaluating", () => {
  describe("integer expressions", () => {
    const cases = [
      { input: "0", expected: 0 },
      { input: "5", expected: 5 },
      { input: "10", expected: 10 }
    ];

    cases.forEach(({ input, expected }) => {
      test(`${input} evaluates to the correct value`, () => {
        const actual = doEval(input);
        expect(actual).toBeInstanceOf(Integer);
        expect((actual as Integer).value).toBe(expected);
      });
    });
  });
});
