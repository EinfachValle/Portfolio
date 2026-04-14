import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Valentin Röhle — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase" as const,
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          FULL-STACK DEVELOPER
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 200,
            color: "#e4e4e7",
            lineHeight: 1.1,
          }}
        >
          Valentin <span style={{ fontWeight: 700 }}>Röhle</span>
        </div>
        <div
          style={{
            width: 80,
            height: 2,
            background:
              "linear-gradient(90deg, #6366f1, rgba(167, 139, 250, 0.5))",
          }}
        />
        <div
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: "#71717a",
            maxWidth: 500,
            textAlign: "center" as const,
          }}
        >
          React &middot; Next.js &middot; TypeScript &middot; Node.js
        </div>
      </div>
    </div>,
    { ...size },
  );
}
