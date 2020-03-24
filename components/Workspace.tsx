import debounce from "debounce";
import { useState, useCallback } from "react";

import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import SplitPane from "../components/SplitPane";
import Divider from "../components/Divider";
import { Program } from "../language/ast";
import Lexer from "../language/lexer";
import Parser from "../language/parser";

const defaultInput = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);

result;
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
