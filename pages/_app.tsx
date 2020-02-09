import { AppProps } from "next/app";
import "../styles/global.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
