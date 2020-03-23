type Props = {
  children: React.ReactNode;
};

export default function SplitPane({ children }: Props): React.ReactElement {
  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }}
      >
        {children}
      </div>
    </div>
  );
}
