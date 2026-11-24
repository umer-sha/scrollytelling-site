import type { MetadataRoute } from "next";

const AI_BOTS = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "CCBot", "ClaudeBot", "Claude-Web", "anthropic-ai", "Google-Extended", "Bytespider", "PerplexityBot", "Amazonbot", "Applebot-Extended", "Diffbot", "ImagesiftBot", "Omgilibot", "FacebookBot", "cohere-ai"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/media/"] },
      ...AI_BOTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
  };
}
