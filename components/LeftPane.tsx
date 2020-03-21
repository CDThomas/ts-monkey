import dynamic from "next/dynamic";

const Editor = dynamic(import("../components/Editor"), { ssr: false });

type Props = {
  input: string;
  onChange(input: string): void;
};

export default function LeftPane({
  input,
  onChange
}: Props): React.ReactElement {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "50%"
      }}
    >
      <Editor value={input} onChange={onChange} />
    </div>
  );
}
