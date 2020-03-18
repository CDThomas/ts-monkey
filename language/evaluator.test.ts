import Lexer from "./lexer";
import Parser from "./parser";
import { evaluate } from "./evaluator";
import { Bool, Integer, Null, Obj } from "./object";

function doEval(input: string): Obj {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  return evaluate(program);
}

describe("evaluating", () => {
  describe("if else expressions", () => {
    const cases = [
      {
        input: "if (true) { 10 }",
        expected: 10,
        description: "literal true condition"
      },
      {
        input: "if (false) { 10 }",
        description: "literal false condition"
      },
      { input: "if (1) { 10 }", expected: 10, description: "truthy condition" },
      {
        input: "if (1 < 2) { 10 }",
        expected: 10,
        description: "condition expression that evaluates to true"
      },
      {
        input: "if (1 > 2) { 10 }",
        description: "condition expression that evaluates to false"
      },
      {
        input: "if (1 < 2) { 10 } else { 20 }",
        expected: 10,
        description: "true condition with alternative"
      },
      {
        input: "if (1 > 2) { 10 } else { 20 }",
        expected: 20,
        description: "false condition with alternative"
      }
    ];

    cases.forEach(({ input, expected, description }) => {
      test(`${description}: ${input}`, () => {
        expect.assertions(1);
        const result = doEval(input);

        if (expected) {
          expect(result).toEqual(new Integer(expected));
        } else {
          expect(result).toBeInstanceOf(Null);
        }
      });
    });
  });

  describe("integer expressions", () => {
    const cases = [
      { input: "0", expected: 0 },
      { input: "5", expected: 5 },
      { input: "-5", expected: -5 },
      { input: "-10", expected: -10 },
      { input: "1 + 2", expected: 3 },
      { input: "2 - 1", expected: 1 },
      { input: "2 * 3", expected: 6 },
      { input: "3 / 3", expected: 1 },
      { input: "3 / 2", expected: 1 },
      { input: "5 + 5 + 5 + 5 - 10", expected: 10 },
      { input: "2 * 2 * 2 * 2 * 2", expected: 32 },
      { input: "-50 + 100 + -50", expected: 0 },
      { input: "5 * 2 + 10", expected: 20 },
      { input: "5 + 2 * 10", expected: 25 },
      { input: "20 + 2 * -10", expected: 0 },
      { input: "50 / 2 * 2 + 10", expected: 60 },
      { input: "2 * (5 + 10)", expected: 30 },
      { input: "3 * 3 * 3 + 10", expected: 37 },
      { input: "3 * (3 * 3) + 10", expected: 37 },
      { input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50 }
    ];

    cases.forEach(({ input, expected }) => {
      test(`${input} evaluates to ${expected}`, () => {
        const actual = doEval(input);
        expect(actual).toBeInstanceOf(Integer);
        expect((actual as Integer).value).toBe(expected);
      });
    });

    test("dividing by 0 throws an error", () => {
      expect(() => doEval("5 / 0")).toThrow(
        "evaluation error: cannot divide by zero"
      );
    });
  });

  describe("boolean expressions", () => {
    const cases = [
      { input: "true", expected: true },
      { input: "false", expected: false },
      { input: "1 < 2", expected: true },
      { input: "1 > 2", expected: false },
      { input: "1 < 1", expected: false },
      { input: "1 > 1", expected: false },
      { input: "1 == 1", expected: true },
      { input: "1 != 1", expected: false },
      { input: "1 == 2", expected: false },
      { input: "1 != 2", expected: true },
      { input: "true == true", expected: true },
      { input: "false == false", expected: true },
      { input: "true == false", expected: false },
      { input: "true != false", expected: true },
      { input: "false != true", expected: true },
      { input: "(1 < 2) == true", expected: true },
      { input: "(1 < 2) == false", expected: false },
      { input: "(1 > 2) == true", expected: false },
      { input: "(1 > 2) == false", expected: true }
    ];

    cases.forEach(({ input, expected }) => {
      test(`${input} evaluates to ${expected}`, () => {
        const result = doEval(input);
        expect(result).toBeInstanceOf(Bool);
        expect((result as Bool).value).toBe(expected);
      });
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
