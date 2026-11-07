import { ImageResponse } from "next/og";

export const alt = "THE JOURNEY: the story of everything, and then there was you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Share image: typographic only, so nothing in it can be mistaken for a photograph. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 75% 30%, #2a2140 0%, #0d1220 45%, #080b12 100%)",
          color: "#f2ede4",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12, color: "#d6a96c" }}>THE JOURNEY</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>The story of everything,</div>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>and then there was you.</div>
        </div>
        <div style={{ fontSize: 28, color: "#a9a49b" }}>13.8 billion years · ten chapters · told through the evidence</div>
      </div>
    ),
    size,
  );
}
