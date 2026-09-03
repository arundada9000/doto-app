import { ImageResponse } from "next/og";
import { siteTagline } from "@/lib/site";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

// Required for a static export: the image is generated at build time, not per
// request.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "DoTo: capture it instantly, organize it later.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        title={siteTagline}
        footnote="Offline-first tasks and notes. No account, no tracking."
      />
    ),
    size
  );
}
