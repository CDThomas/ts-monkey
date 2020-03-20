import Lexer from "./lexer";
import Parser from "./parser";
import { evaluate } from "./evaluator";
import { Bool, Err, Integer, Null, Obj } from "./object";

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

  describe("return statements", () => {
    const cases = [
      { input: "return 10;", expected: 10, description: "returning a literal" },
      {
        input: "return 10; 9;",
        expected: 10,
        description: "return before another statement"
      },
      {
        input: "return 2 * 5; 9;",
        expected: 10,
        description: "returning an expression"
      },
      {
        input: "9; return 2 * 5; 9;",
        expected: 10,
        description: "return between two other statements"
      },
      {
        input: `
          if (10 > 1) {
            if (10 > 1) {
              return 10;
            }

            return 1;
          }
        `,
        expected: 10,
        description: "returning in a nested block statement"
      }
    ];

    cases.forEach(({ input, expected, description }) => {
      test(description, () => {
        const result = doEval(input);
        expect(result).toBeInstanceOf(Integer);
        expect((result as Integer).value).toBe(expected);
      });
    });
  });

  describe("error handling", () => {
    const cases = [
      {
        input: "5 + true;",
        expected: "type mismatch: 5 + true",
        description: "type mismatch"
      },
      {
        input: "5 + true; 5;",
        expected: "type mismatch: 5 + true",
        description: "an error before another statement"
      },
      {
        input: "-true",
        expected: "unknown operator: -true",
        description: "unknown operator in a prefix expression"
      },
      {
        input: "true + false",
        expected: "unknown operator: true + false",
        description: "unknown operator in an infix expression"
      },
      {
        input: "5; true + false; 5;",
        expected: "unknown operator: true + false",
        description: "an error between other statements"
      },
      {
        input: "if (10 > 1) { true + false; }",
        expected: "unknown operator: true + false",
        description: "an error in a block statement"
      },
      {
        input: `
          if (10 > 1) {
            if (10 > 1) {
              return true + false;
            }

            return 1;
          }
        `,
        expected: "unknown operator: true + false",
        description: "an error in return in a nested block statement"
      },
      {
        input: `
          if (10 > 1) {
            if (10 > 1) {
              true + false;
              return 1;
            }

            return 1;
          }
        `,
        expected: "unknown operator: true + false",
        description: "an error before a return in a nested block statement"
      }
    ];

    cases.forEach(({ input, expected, description }) => {
      test(description, () => {
        const result = doEval(input);
        expect(result).toBeInstanceOf(Err);
        expect((result as Err).message).toBe(expected);
      });
    });
  });
});
