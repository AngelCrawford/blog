#!/usr/bin/env node

/**
 * Calculate per-article popularity scores from engagement data.
 *
 * Phase 0: Placeholder — writes empty object.
 * Phase 1A: Read data/umami_hearts.json + data/webmentions_by_article.json,
 *           apply scoring formula, write per-article scores (Story 3.3).
 *
 * Expected formula (Phase 1A — see architecture doc Decision Summary):
 *   score = (hearts × 1) + (webmentions × 3) + (manual_weight × 5)
 *   Higher score = more popular content. Used by Three-Tier Sorting (Epic 4).
 *
 * Output: data/popularity_scores.json
 *   { "/articles/some-post/": 42, "/logs/some-log/": 7, ... }
 */

const fs = require("fs");
const path = require("path");

const popularityScores = {};

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, "popularity_scores.json"),
  JSON.stringify(popularityScores, null, 2),
);

console.log("✓ Popularity scores calculated (Phase 0 placeholder)");
