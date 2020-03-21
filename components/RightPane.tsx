import dynamic from "next/dynamic";
import { useState } from "react";

import Tab from "../components/Tab";
import { Program } from "../language/ast";

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
            <Editor readOnly value={JSON.stringify(output, null, 2)} />
          </div>
        </div>
      </div>
    </div>
  );
}
