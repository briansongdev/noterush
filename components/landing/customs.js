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

export const getRank = (elo) => {
  let ranks = [
    "GILDED",
    "STEELED",
    "REFINED",
    "LAPIS",
    "EMERALD",
    "CRYSTALLINE",
    "GLISTENING",
  ];
  let colors = [
    "#B8860B",
    "#D9DADB",
    "#FBCEB1",
    "#00008B",
    "#98FB98",
    "#CF9FFF",
    "",
  ];
  let rankObject = {
    name: elo != 0 ? ranks[Math.floor(elo / 200)] : "UNRANKED",
    color: elo != 0 ? colors[Math.floor(elo / 200)] : "#bee3f8",
    isGradientRank: elo >= 1200 ? true : false,
    eloPoints: elo % 200,
    nextRank: ranks[Math.min(ranks.length - 1, Math.floor(elo / 200) + 1)],
    nextRankColor:
      colors[Math.min(ranks.length - 1, Math.floor(elo / 200) + 1)],
  };
  return rankObject;
};
