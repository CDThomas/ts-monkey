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

      <div
        id="root"
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100vh"
        }}
      >
        <div
          id="main-nav"
          style={{
            height: 32,
            backgroundColor: "#efefef",
            borderBottom: "1px solid #ddd"
          }}
        />
        <div id="splitpane-content" className={styles.container}>
          <div
            id="splitpane"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "50%"
              }}
            >
              <Editor value={input} onChange={handleChange} />
            </div>
            <div
              id="divider"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                marginLeft: -2.5,
                width: 5,
                backgroundColor: "#ddd",
                zIndex: 100
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "50%"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div
                  style={{
                    backgroundColor: "#efefef",
                    borderBottom: "1px solid #ddd",
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 3
                  }}
                >
                  <a href="#" style={{ padding: "0 16px" }}>
                    AST
                  </a>
                  <a href="#" style={{ padding: "0 16px" }}>
                    Eval
                  </a>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0
                    }}
                  >
                    <Editor readOnly value={JSON.stringify(output, null, 2)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
