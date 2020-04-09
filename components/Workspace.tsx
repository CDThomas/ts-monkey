import debounce from "debounce";
import { useState, useCallback } from "react";

import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import SplitPane from "../components/SplitPane";
import Divider from "../components/Divider";
import { Program } from "../language/ast";
import Lexer from "../language/lexer";
import Parser from "../language/parser";

const defaultInput = `puts("This is a TypeScript implementation of the Monkey language!")

let x = 10 / 2 * 3 + 5 - 5
let word = "Hi" + "!"
let bool = !(1 < 2)

puts("Monkey supports integers, strings, and booleans:", x, word, bool)

let array = [1, 2, 3]
let hash = {"key": "value"}

puts("Monkey also supports arrays and hashes:", array, hash)

let addOne = fn (x) { x + 1 };
let doTwice = fn (x, func) {
  func(func(x))
}

puts(
  "You can define your own functions and pass functions as arguments:",
  doTwice(3, addOne)
)

puts("For more info, click the '?' (help) link in the top right of the main nav.")
`;

const parse = (input: string): Program => {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  return parser.parseProgram();
};

export default function Workspace(): React.ReactElement {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState<Program>(parse(defaultInput));
  const doParse = useCallback(
    debounce((value: string) => {
      try {
        const output = parse(value);
        setOutput(output);
      } catch (error) {
        console.error(error);
      }
    }, 200),
    []
  );
  const handleChange = useCallback((value: string): void => {
    setInput(value);
    doParse(value);
  }, []);

  return (
    <SplitPane>
      <LeftPane input={input} onChange={handleChange} />
      <Divider />
      <RightPane output={output} />
    </SplitPane>
  );
}
