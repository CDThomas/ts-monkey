import Lexer from "./lexer";
import Parser from "./parser";
import { evaluate } from "./evaluator";
import {
  Arr,
  Bool,
  Environment,
  Err,
  Func,
  Integer,
  Null,
  Obj,
  Str
} from "./object";
import { ASTKind } from "./ast";

function doEval(input: string): Obj | null {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  return evaluate(program, new Environment());
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

  describe("strings", () => {
    test("literals", () => {
      const input = '"Hello world!"';

      const result = doEval(input);

      expect(result).toBeInstanceOf(Str);
      expect((result as Str).value).toBe("Hello world!");
    });

    test("concatenation", () => {
      const input = '"Hello" + " " + "world!"';

      const result = doEval(input);

      expect(result).toBeInstanceOf(Str);
      expect((result as Str).value).toBe("Hello world!");
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

  describe("arrays", () => {
    test("literals", () => {
      const input = "[1, 2 * 2, 3 + 3]";
      const result = doEval(input);

      expect(result).toBeInstanceOf(Arr);
      expect((result as Arr).elements).toEqual([
        new Integer(1),
        new Integer(4),
        new Integer(6)
      ]);
    });

    describe("index expressions", () => {
      const cases = [
        { input: "[1, 2, 3][0]", expected: 1, description: "index of 0" },
        { input: "[1, 2, 3][1]", expected: 2, description: "index of 1" },
        { input: "[1, 2, 3][2]", expected: 3, description: "index of 2" },
        {
          input: "let i = 0; [1][i]",
          expected: 1,
          description: "identifier as index"
        },
        {
          input: "[1, 2, 3][1 + 1]",
          expected: 3,
          description: "arithmetic in index expression"
        },
        {
          input: "let myArray = [1, 2, 3]; myArray[2]",
          expected: 3,
          description: "identifier as left side"
        },
        {
          input:
            "let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];",
          expected: 6,
          description: "used in an expression"
        },
        {
          input: "[1, 2, 3][3]",
          expected: null,
          description: "positive out-of-bounds index"
        },
        {
          input: "[1, 2, 3][-1]",
          expected: null,
          description: "negative out-of-bounds index"
        }
      ];

      cases.forEach(({ input, expected, description }) => {
        test(description, () => {
          expect.assertions(1);
          const result = doEval(input);

          if (expected) {
            expect(result).toEqual(new Integer(expected));
          } else {
            expect(result).toEqual(new Null());
          }
        });
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

  describe("function literals", () => {
    const input = "fn(x) { x + 2; };";
    const evaluated = doEval(input) as Func;

    test("returns a Func object", () => {
      expect(evaluated).toBeInstanceOf(Func);
    });

    test("sets the correct parameters", () => {
      expect(evaluated.parameters).toEqual([
        { kind: ASTKind.Identifier, value: "x" }
      ]);
    });

    test("sets the correct body", () => {
      expect(evaluated.body).toEqual({
        kind: ASTKind.BlockStatement,
        statements: [
          {
            kind: ASTKind.ExpressionStatement,
            expression: {
              kind: ASTKind.InfixExpression,
              operator: "+",
              left: { kind: ASTKind.Identifier, value: "x" },
              right: { kind: ASTKind.Integer, value: 2 }
            }
          }
        ]
      });
    });

    test("sets the correct environment", () => {
      expect(evaluated.environment).toEqual(new Environment());
    });
  });

  describe("function calls", () => {
    const cases = [
      {
        input: "let identity = fn(x) { x; }; identity(5);",
        expected: 5,
        description: "implicit return value"
      },
      {
        input: "let identity = fn(x) { return x; }; identity(5);",
        expected: 5,
        description: "explicit return value"
      },
      {
        input: "let double = fn(x) { x * 2; }; double(5);",
        expected: 10,
        description: "using parameters in expressions"
      },
      {
        input: "let add = fn(x, y) { x + y; }; add(5, 5);",
        expected: 10,
        description: "multiple parameters"
      },
      {
        input: "let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));",
        expected: 20,
        description: "evaluating arguments before calling"
      },
      {
        input: "fn(x) { x; }(5)",
        expected: 5,
        description: "calling a function literal"
      },
      {
        input: `
        let x = 12;
        let add_to_x = fn(y) {
          x + y;
        };
        let x = 1;

        let result = add_to_x(5);
        result;
        `,
        expected: 17,
        description: "uses environment from when function is defined"
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

  describe("let statements", () => {
    const cases = [
      {
        input: "let a = 5; a;",
        expected: 5,
        description: "assigning an integer literal"
      },
      {
        input: "let a = 5 * 5; a;",
        expected: 25,
        description: "assigning an infix expression"
      },
      {
        input: "let a = 5; let b = a; a;",
        expected: 5,
        description: "assigning the value of another identifier"
      },
      {
        input: "let a = 5; let b = a; let c = a + b + 5; c;",
        expected: 15,
        description: "assigning an expression using multiple identifiers"
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
      },
      {
        input: "foobar",
        expected: "identifier not found: foobar",
        description: "unbound identifier"
      },
      {
        input: '"Hello" - "world!"',
        expected: 'unknown operator: "Hello" - "world!"',
        description: "unknown string infix operator"
      },
      {
        input: "[foo]",
        expected: "identifier not found: foo",
        description: "an error in an array literal"
      },
      {
        input: "foo[1]",
        expected: "identifier not found: foo",
        description: "an error in left of index operator"
      },
      {
        input: "[1][foo]",
        expected: "identifier not found: foo",
        description: "an error in index of index operator"
      },
      {
        input: "1[1]",
        expected: "index operator not supported: 1[1]",
        description: "index operator on unsupported type"
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

  describe("builtin functions", () => {
    describe("len", () => {
      test("empty string returns 0", () => {
        const input = 'len("")';

        const result = doEval(input);

        expect(result).toBeInstanceOf(Integer);
        expect((result as Integer).value).toBe(0);
      });

      test("non-empty strings return the correct length", () => {
        const input = 'len("four")';

        const result = doEval(input);

        expect(result).toBeInstanceOf(Integer);
        expect((result as Integer).value).toBe(4);
      });

      test("empty array returns 0", () => {
        const input = "len([])";

        const result = doEval(input);

        expect(result).toBeInstanceOf(Integer);
        expect((result as Integer).value).toBe(0);
      });

      test("non-empty array returns the correct length", () => {
        const input = "len([1, 2, 3])";

        const result = doEval(input);

        expect(result).toBeInstanceOf(Integer);
        expect((result as Integer).value).toBe(3);
      });

      test("returns an error given an argument of the wrong type", () => {
        const input = "len(1)";

        const result = doEval(input);

        expect(result).toBeInstanceOf(Err);
        expect((result as Err).message).toBe(
          "argument to `len` not supported. got 1"
        );
      });

      test("returns an error given the wrong number of arguments", () => {
        const input = 'len("one", "two")';

        const result = doEval(input);

        expect(result).toBeInstanceOf(Err);
        expect((result as Err).message).toBe(
          "wrong number of arguments. expected 1, got 2"
        );
      });
    });
  });
});
