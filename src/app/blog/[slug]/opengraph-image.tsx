import { ImageResponse } from "next/og";
import { getPost, posts } from "@/content/posts";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "An article on DoTo";

/** One image per article, generated at build time into the static export. */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Writing"
        title={post?.title ?? "Writing"}
        footnote={
          post ? `${post.readingMinutes} minute read` : "Notes on capture"
        }
      />
    ),
    size
  );
}
