import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, useCallback } from "react";
import debounce from "debounce";

const Editor = dynamic(import("../components/Editor"), { ssr: false });
import { Program } from "../language/ast";
import Lexer from "../language/lexer";
import Parser from "../language/parser";
import styles from "./index.module.css";

const defaultInput = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
`;

const parse = (input: string): Program => {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  return parser.parseProgram();
};

function Home(): React.ReactElement {
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
    <div>
      <Head>
        <title>Monkey</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <Editor value={input} onChange={handleChange} />
        <Editor readOnly value={JSON.stringify(output, null, 2)} />
      </main>
    </div>
  );
}

export default Home;
