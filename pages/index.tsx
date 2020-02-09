import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const Editor = dynamic(import("../components/Editor"), { ssr: false });
import Lexer from "../monkey/lexer/lexer";
import * as Token from "../monkey/token/token";
import styles from "./index.module.css";

const defaultInput = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
`;

function readTokens(lexer: Lexer, tokens: Token.Token[] = []): Token.Token[] {
  const token = lexer.nextToken();

  if (token.type === Token.TokenType.EOF) return tokens;
  return readTokens(lexer, [...tokens, token]);
}

const Home = () => {
  const [input, setInput] = React.useState(defaultInput);
  const output = readTokens(new Lexer(input));

  return (
    <div>
      <Head>
        <title>Monkey</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <Editor value={input} onChange={input => setInput(input)} />
        <Editor readOnly value={JSON.stringify(output, null, 2)} />
      </main>
    </div>
  );
};

export default Home;
