import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/_next/", "/private/", "/offline/"],
            },
            {
                // Explicitly permit major search and answer-engine crawlers.
                // Public HTML content remains the source of truth for every crawler.
                userAgent: [
                    "Googlebot",
                    "Bingbot",
                    "Applebot",
                    "GPTBot",
                    "OAI-SearchBot",
                    "ChatGPT-User",
                    "PerplexityBot",
                    "Perplexity-User",
                    "ClaudeBot",
                    "Claude-SearchBot",
                    "Google-Extended",
                    "GoogleOther",
                    "Applebot-Extended",
                    "CCBot",
                ],
                allow: "/",
                disallow: ["/api/", "/_next/", "/offline/"],
            },
            {
                userAgent: "Googlebot-Image",
                allow: "/",
            },
        ],
        sitemap: "https://mowglai.com/sitemap.xml",
        host: "https://mowglai.com",
    };
}
