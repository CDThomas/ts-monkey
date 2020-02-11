import * as React from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import styles from "./Editor.module.css";

type Props = {
  value: string;
  readOnly?: boolean;
  onChange?(input: string): void;
};

function Editor({
  value,
  readOnly = false,
  onChange
}: Props): React.ReactElement {
  return (
    <CodeMirror
      className={styles.Editor}
      value={value}
      autoCursor={false}
      options={{
        theme: "material",
        mode: "javascript",
        lineNumbers: true,
        readOnly
      }}
      onChange={(_editor, _data, value): void => {
        onChange && onChange(value);
      }}
    />
  );
}

export default Editor;
