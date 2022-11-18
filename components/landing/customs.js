export default function HighlightText({ children }) {
  return (
    <span
      style={{
        color: "black",
        fontWeight: "bold",
        padding: "0em 0.2em",
        backgroundImage:
          "linear-gradient(to bottom, transparent 50%, #008080 50%)",
      }}
    >
      <span id="textGradient">{children}</span>
    </span>
  );
}
