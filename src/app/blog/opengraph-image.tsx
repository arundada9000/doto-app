import { ImageResponse } from "next/og";
import { posts } from "@/content/posts";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Writing on DoTo";

export default function BlogOgImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Writing"
        title="Notes on capture, offline-first apps, and getting things done"
        footnote={`${posts.length} articles. No newsletter, no sign-up.`}
      />
    ),
    size
  );
}
