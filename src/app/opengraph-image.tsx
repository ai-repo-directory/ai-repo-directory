import { ImageResponse } from "next/og";

export const alt = "AI Repo Directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f6f3",
          color: "#12141a",
          padding: "64px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#7a8090",
          }}
        >
          Open-source AI discovery
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            AI Repo Directory
          </div>
          <div style={{ fontSize: 32, color: "#4a4f5c", maxWidth: 900 }}>
            Curated repositories with transparent discovery scores.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#1a4d8c",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          agents · rag · inference · local ai
        </div>
      </div>
    ),
    { ...size },
  );
}
