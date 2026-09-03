import { ImageResponse } from "next/og";
import { siteTagline } from "@/lib/site";

// Required for a static export: the image is generated at build time, not per
// request.
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DoTo: capture it instantly, organize it later.";

/**
 * Rendered once at build time into the static export. ImageResponse supports a
 * narrow slice of CSS, so this is plain flexbox with literal colour values
 * rather than the app's design tokens, which are not available here.
 */
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
          background: "#101114",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#4c8dff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              color: "#0b0c0f",
            }}
          >
            D
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#f4f5f7" }}>
            DoTo
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.1,
              fontWeight: 600,
              color: "#f4f5f7",
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            {siteTagline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#9aa0ab",
              display: "flex",
            }}
          >
            Offline-first tasks and notes. No account, no tracking.
          </div>
        </div>
      </div>
    ),
    size
  );
}
