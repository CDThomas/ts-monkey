import { useState } from "react";
import JSONTree from "react-json-tree";

import Tab from "../components/Tab";
import { Program } from "../language/ast";
import { evaluate } from "../language/evaluator";
import { Environment, Err } from "../language/object";

enum TabName {
  AST = "AST",
  Eval = "Eval"
}

type Props = {
  output: Program;
};

export default function RightPane({ output }: Props): React.ReactElement {
  const [tab, setTab] = useState<TabName>(TabName.Eval);
  let evaluated = null;

  try {
    evaluated = evaluate(output, new Environment());
  } catch (error) {
    console.error(error);
  }

  return (
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
          flexDirection: "column",
          paddingLeft: 3
        }}
      >
        <div
          style={{
            backgroundColor: "#efefef",
            borderBottom: "1px solid #ddd",
            height: 32,
            display: "flex",
            alignItems: "center"
          }}
        >
          <Tab
            active={tab === TabName.AST}
            onClick={(): void => setTab(TabName.AST)}
            text="AST"
          />
          <Tab
            active={tab === TabName.Eval}
            onClick={(): void => setTab(TabName.Eval)}
            text="Eval"
          />
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              paddingLeft: 12,
              overflowY: "scroll"
            }}
          >
            {tab === TabName.AST && (
              <JSONTree
                data={output}
                theme={{
                  scheme: "default",
                  author: "chris kempson (http://chriskempson.com)",
                  base00: "#181818",
                  base01: "#282828",
                  base02: "#383838",
                  base03: "#585858",
                  base04: "#b8b8b8",
                  base05: "#d8d8d8",
                  base06: "#e8e8e8",
                  base07: "#f8f8f8",
                  base08: "#ab4642",
                  base09: "#dc9656",
                  base0A: "#f7ca88",
                  base0B: "#a1b56c",
                  base0C: "#86c1b9",
                  base0D: "#7cafc2",
                  base0E: "#ba8baf",
                  base0F: "#a16946"
                }}
                shouldExpandNode={(_keyname, _data, level): boolean =>
                  level < 2
                }
              />
            )}
            {tab === TabName.Eval && (
              <div
                style={{
                  paddingTop: 12,
                  fontFamily: "monospace",
                  fontSize: 16,
                  color: evaluated instanceof Err ? "#C41A16" : "inherit"
                }}
              >
                {evaluated?.inspect()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
