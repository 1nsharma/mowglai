# Mowglai crawler and SEO operating notes

## Crawl policy
- Public pages are crawlable by default.
- `/api/`, `/_next/`, `/private/`, and `/offline/` are not intended as search landing pages.
- The generated sitemap is available at `https://mowglai.com/sitemap.xml`.
- The public AI-readable overview is `https://mowglai.com/llms.txt`.
- Do not serve crawler-specific, hidden, or materially different page content. Search bots and human visitors should receive the same useful page content.

## Search and answer-engine discoverability
1. Keep meaningful page copy in server-rendered HTML; do not hide essential content behind client-only interactions.
2. Give every indexable route a unique title, description, canonical URL, one descriptive H1, and contextual internal links.
3. Use JSON-LD only for facts visible on the page. Keep Organization, WebSite, Service, BreadcrumbList, and FAQ data accurate; never invent reviews, addresses, or prices.
4. Keep sitemap entries limited to canonical, indexable URLs. Exclude private, utility, duplicate, and thank-you pages.
5. Validate sitemap and robots output after each static export and submit the sitemap in Google Search Console and Bing Webmaster Tools.
6. Monitor crawl errors, index coverage, Core Web Vitals, and structured-data reports. Robots.txt permission does not guarantee crawling or indexing.

## Interactive pet
The site-wide pet is a progressive-enhancement UI feature. It must not be required to discover navigation, page copy, service details, or contact information. It respects reduced-motion preferences, supports touch devices, can be dismissed, and does not intercept page interactions outside its own controls.
