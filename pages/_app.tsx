import * as React from "react";
import { AppProps } from "next/app";
import "../styles/global.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />;
}

export default App;
