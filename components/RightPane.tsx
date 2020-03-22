import dynamic from "next/dynamic";
import { useState } from "react";

import Tab from "../components/Tab";
import { Program } from "../language/ast";
import { evaluate } from "../language/evaluator";
import { Err } from "../language/object";

const Editor = dynamic(import("../components/Editor"), { ssr: false });

enum TabName {
  AST = "AST",
  Eval = "Eval"
}

type Props = {
  output: Program;
};

export default function RightPane({ output }: Props): React.ReactElement {
  const [tab, setTab] = useState<TabName>(TabName.AST);
  let evaluated = null;

  try {
    evaluated = evaluate(output);
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
              right: 0
            }}
          >
            {tab === TabName.AST && (
              <Editor readOnly value={JSON.stringify(output, null, 2)} />
            )}
            {tab === TabName.Eval && (
              <div
                style={{
                  padding: 8,
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
