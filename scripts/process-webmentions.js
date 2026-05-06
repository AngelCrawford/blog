#!/usr/bin/env node

/**
 * Process raw webmentions and group by article URL.
 *
 * Phase 0: Placeholder — writes empty object.
 * Phase 1A: Read data/webmentions_raw.json (fetched separately from webmention.io),
 *           group by target URL, dedupe, output structured data (Story 2.3 / 3.2).
 *
 * Expected input (Phase 1A):
 *   data/webmentions_raw.json (from `curl https://webmention.io/api/mentions.jf2?domain=...`)
 *
 * Output: data/webmentions_by_article.json
 *   {
 *     "/articles/some-post/": [
 *       { type: "in-reply-to", author: "...", content: "...", published: "..." },
 *       ...
 *     ],
 *     ...
 *   }
 */

const fs = require("fs");
const path = require("path");

const webmentionsByArticle = {};

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, "webmentions_by_article.json"),
  JSON.stringify(webmentionsByArticle, null, 2),
);

console.log("✓ Webmentions processed (Phase 0 placeholder)");
