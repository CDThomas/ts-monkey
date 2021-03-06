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
          height: "100vh",
        }}
      >
        <nav
          style={{
            height: 32,
            backgroundColor: "#efefef",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <div>
            <span
              style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 600 }}
            >
              ts-monkey
            </span>
          </div>
          <div>
            <a
              href="https://github.com/CDThomas/ts-monkey/blob/master/docs/language.md"
              rel="noopener noreferrer"
              style={{ marginRight: 8 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                style={{ color: "#000", height: 20 }}
              >
                <path
                  d="M5 0c-2.25 0-3.712.965-4.375 2.125-.663 1.16-.625 2.375-.625 2.875h2c0-.5.038-1.285.375-1.875.337-.59.875-1.125 2.625-1.125 1.333 0 2.074.332 2.469.688.395.356.531.785.531 1.313 0 1.667-.656 2.125-1.656 3-1 .875-2.344 2.167-2.344 4.5v.5h2v-.5c0-1.667.656-2.125 1.656-3 1-.875 2.344-2.167 2.344-4.5 0-.972-.364-2.043-1.219-2.813-.855-.769-2.115-1.188-3.781-1.188zm-1 14v2h2v-2h-2z"
                  transform="translate(3)"
                ></path>
              </svg>
            </a>
            <a
              href="https://github.com/CDThomas/ts-monkey"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17 16"
                fill="none"
                style={{ color: "#000", height: 22 }}
              >
                <g clipPath="url(githublogo)">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8.18391.249268C3.82241.249268.253906 3.81777.253906 8.17927c0 3.46933 2.279874 6.44313 5.451874 7.53353.3965.0991.49563-.1983.49563-.3965v-1.3878c-2.18075.4956-2.67638-.9912-2.67638-.9912-.3965-.8922-.89212-1.1895-.89212-1.1895-.69388-.4957.09912-.4957.09912-.4957.793.0992 1.1895.793 1.1895.793.69388 1.2887 1.88338.8922 2.27988.6939.09912-.4956.29737-.8921.49562-1.0904-1.78425-.1982-3.5685-.8921-3.5685-3.96496 0-.89212.29738-1.586.793-2.08162-.09912-.19825-.3965-.99125.09913-2.08163 0 0 .69387-.19825 2.18075.793.59475-.19825 1.28862-.29737 1.9825-.29737.69387 0 1.38775.09912 1.98249.29737 1.4869-.99125 2.1808-.793 2.1808-.793.3965 1.09038.1982 1.88338.0991 2.08163.4956.59475.793 1.28862.793 2.08162 0 3.07286-1.8834 3.66766-3.66764 3.86586.29737.3965.59474.8921.59474 1.586v2.1808c0 .1982.0991.4956.5948.3965 3.172-1.0904 5.4518-4.0642 5.4518-7.53353-.0991-4.3615-3.6676-7.930002-8.02909-7.930002z"
                    clipRule="evenodd"
                  ></path>
                </g>
                <defs>
                  <clipPath id="githublogo">
                    <path
                      fill="transparent"
                      d="M0 0h15.86v15.86H0z"
                      transform="translate(.253906 .0493164)"
                    ></path>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </nav>
        <Workspace />
      </div>
    </div>
  );
}

export default Home;
