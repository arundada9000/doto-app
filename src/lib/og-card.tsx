import { siteName } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#f4f5f7";
const MUTED = "#9aa0ab";
const GROUND = "#101114";
const BRAND = "#4c8dff";

/**
 * One card layout for every social image, so the landing page, the writing
 * index, and each article share an identity. ImageResponse supports a narrow
 * slice of CSS, so this is plain flexbox with literal colours rather than the
 * app's design tokens, which are not available in that renderer.
 */
export function OgCard({
  eyebrow,
  title,
  footnote,
}: {
  eyebrow?: string;
  title: string;
  footnote?: string;
}) {
  // Long headlines step down a size rather than overflowing the card.
  const titleSize = title.length > 70 ? 56 : title.length > 45 ? 64 : 74;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GROUND,
        padding: "68px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 15,
            background: BRAND,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
            color: GROUND,
          }}
        >
          D
        </div>
        <div style={{ fontSize: 31, fontWeight: 600, color: INK }}>
          {siteName}
        </div>
        {eyebrow ? (
          <div
            style={{
              marginLeft: 8,
              fontSize: 25,
              color: BRAND,
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: titleSize,
            lineHeight: 1.1,
            fontWeight: 600,
            color: INK,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {footnote ? (
          <div
            style={{
              marginTop: 26,
              fontSize: 27,
              color: MUTED,
              display: "flex",
            }}
          >
            {footnote}
          </div>
        ) : null}
      </div>
    </div>
  );
}
