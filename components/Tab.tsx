import React from "react";

type Props = {
  active?: boolean;
  onClick(): void;
  text: string;
};

export default function Tab({
  active = false,
  onClick,
  text
}: Props): React.ReactElement {
  return (
    <button onClick={onClick}>
      <style jsx>{`
        button {
          padding: 0px 8px;
          line-height: 28px;
          border: none;
          border-bottom: 3px solid ${active ? "#1293D8" : "transparent"};
          background-color: transparent;
          font-size: 16px;
          cursor: pointer;
        }
        button:focus {
          outline: none;
        }
      `}</style>
      {text}
    </button>
  );
}
