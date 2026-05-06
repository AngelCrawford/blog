#!/usr/bin/env node

/**
 * Fetch Umami heart events and write to data/umami_hearts.json
 *
 * Phase 0: Placeholder — writes empty object so Hugo's data pipeline doesn't break.
 * Phase 1A: Implement actual Umami Cloud API fetch (Story 2.1 / 3.1).
 *
 * Expected input (Phase 1A):
 *   ENV: UMAMI_API_KEY, UMAMI_WEBSITE_ID
 *   API: GET https://cloud.umami.is/api/websites/{id}/events?event=heart
 *
 * Output: data/umami_hearts.json
 *   { "/articles/some-post/": 42, "/logs/some-log/": 7, ... }
 */

const fs = require("fs");
const path = require("path");

const hearts = {};

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, "umami_hearts.json"),
  JSON.stringify(hearts, null, 2),
);

console.log("✓ Umami hearts fetched (Phase 0 placeholder)");
