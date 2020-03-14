import Lexer from "./lexer";
import Parser from "./parser";
import { evaluate } from "./evaluator";
import { Bool, Integer, Obj } from "./object";

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
      { input: "-5", expected: -5 },
      { input: "-10", expected: -10 }
    ];

    cases.forEach(({ input, expected }) => {
      test(`${input} evaluates to ${expected}`, () => {
        const actual = doEval(input);
        expect(actual).toBeInstanceOf(Integer);
        expect((actual as Integer).value).toBe(expected);
      });
    });
  });

  describe("boolean expressions", () => {
    test("true evaluates to true", () => {
      const result = doEval("true");
      expect(result).toBeInstanceOf(Bool);
      expect((result as Bool).value).toBe(true);
    });

    test("false evaluates to false", () => {
      const result = doEval("false");
      expect(result).toBeInstanceOf(Bool);
      expect((result as Bool).value).toBe(false);
    });

    test("throw an error when used with the minus prefix operator", () => {
      expect(() => doEval("-true")).toThrow(
        "evaluation error: minus prefix operator not implemented for true"
      );
    });
  });

  describe("the bang prefix operator", () => {
    const cases = [
      {
        input: "!true",
        expected: false,
        description: "negating true evaluates to false"
      },
      {
        input: "!false",
        expected: true,
        description: "negating false evalutes to true"
      },
      {
        input: "!5",
        expected: false,
        description: "negating an int coerces and evaluates to false"
      },
      {
        input: "!!true",
        expected: true,
        description: "double negating true evaluates to true"
      },
      {
        input: "!!false",
        expected: false,
        description: "double negating false evaluates to false"
      },
      {
        input: "!!5",
        expected: true,
        description: "double negating an int coerces and evaluates to true"
      }
    ];

    cases.forEach(({ input, expected, description }) => {
      test(description, () => {
        const result = doEval(input);
        expect((result as Bool).value).toBe(expected);
      });
    });
  });
});
