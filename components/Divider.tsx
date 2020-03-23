export default function Divider(): React.ReactElement {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        marginLeft: -2.5,
        width: 5,
        backgroundColor: "#ddd",
        zIndex: 100
      }}
    />
  );
}
