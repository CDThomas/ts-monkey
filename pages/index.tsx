import Head from "next/head";
import React from "react";

import Workspace from "../components/Workspace";

function Home(): React.ReactElement {
  return (
    <div>
      <Head>
        <title>Monkey</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100vh"
        }}
      >
        {/* Main nav */}
        <div
          style={{
            height: 32,
            backgroundColor: "#efefef",
            borderBottom: "1px solid #ddd"
          }}
        />
        <Workspace />
      </div>
    </div>
  );
}

export default Home;
