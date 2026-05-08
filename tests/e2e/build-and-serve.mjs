// E2E test entrypoint: write fixtures → hugo build → serve public-test/.
// Replaces both globalSetup and webServer.command-only approaches with a single
// deterministic startup. Playwright's `webServer.url` ping then waits naturally
// for the static server to start AFTER the Hugo build has populated public-test/.
//
// Test build writes to `public-test/` (not `public/`) so a developer can keep
// `hugo server` running on `public/` without colliding with the test build.
// On Windows, hugo's static-file copy fails with "directory not empty" if any
// file inside `public/articles/` is held open by another process; isolating
// the test output dir eliminates that race.

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, normalize, sep, join } from "node:path";

const REPO_ROOT = process.cwd();
const ARTICLES_DIR = path.join(REPO_ROOT, "content", "articles");

const STAGES = ["seedling", "budding", "evergreen", "withered"];

const FIXTURE_DIRS = {
    seedling: "_test_growth_stage_seedling",
    budding: "_test_growth_stage_budding",
    evergreen: "_test_growth_stage_evergreen",
    withered: "_test_growth_stage_withered",
    default: "_test_growth_stage_default",
};

// Story 1.4 banner-specific fixtures (mirrors WITHERED_BANNER_FIXTURES in fixtures.ts).
const WITHERED_BANNER_FIXTURES = {
    full: "_test_withered_banner_full",
    replacementTarget: "_test_withered_banner_replacement_target",
};

function fixtureMarkdown(stage) {
    const stageLine = stage
        ? `growth_stage: "${stage}"`
        : "# growth_stage intentionally omitted (default fallback)";
    // Story 1.4: withered articles MUST declare withered_date or Hugo build fails.
    const witheredDate = stage === "withered" ? `withered_date: "2026-05-01"\n` : "";
    return `---
title: "Growth Stage Test ${stage ?? "Default Fallback"}"
date: 2026-05-08
draft: false
summary: "E2E fixture for growth-stage badge — ${stage ?? "no field (default fallback)"}."
categories: ["Test"]
authors: ["angel"]
${stageLine}
${witheredDate}---

Body for the ${stage ?? "default"} fixture.
`;
}

// 1. Write fixtures.
process.stdout.write("[build-and-serve] writing fixtures\n");
for (const stage of STAGES) {
    const dir = path.join(ARTICLES_DIR, FIXTURE_DIRS[stage]);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.md"), fixtureMarkdown(stage));
}
const defaultDir = path.join(ARTICLES_DIR, FIXTURE_DIRS.default);
fs.rmSync(defaultDir, { recursive: true, force: true });
fs.mkdirSync(defaultDir, { recursive: true });
fs.writeFileSync(path.join(defaultDir, "index.md"), fixtureMarkdown(null));

// Story 1.4: withered-banner E2E fixtures.
// `_test_withered_banner_full` — withered article with all three banner fields populated.
// `_test_withered_banner_replacement_target` — destination of the replacement_url click test.
function witheredBannerFullMarkdown() {
    return `---
title: "Withered Banner Full Fixture"
date: 2026-04-01
draft: false
summary: "E2E fixture for Story 1.4 — full withered banner with date, reason, and replacement link."
categories: ["Test"]
authors: ["angel"]
growth_stage: "withered"
withered_date: "2026-04-15"
withered_reason: "E2E reason: framework deprecated."
replacement_url: "/articles/${WITHERED_BANNER_FIXTURES.replacementTarget}/"
---

Body for the withered banner full fixture.
`;
}

function witheredBannerReplacementTargetMarkdown() {
    return `---
title: "Withered Banner Replacement Target"
date: 2026-04-20
draft: false
summary: "E2E fixture for Story 1.4 — destination of the replacement_url click navigation."
categories: ["Test"]
authors: ["angel"]
growth_stage: "evergreen"
---

Body for the replacement target fixture.
`;
}

const fullDir = path.join(ARTICLES_DIR, WITHERED_BANNER_FIXTURES.full);
fs.rmSync(fullDir, { recursive: true, force: true });
fs.mkdirSync(fullDir, { recursive: true });
fs.writeFileSync(path.join(fullDir, "index.md"), witheredBannerFullMarkdown());

const replacementDir = path.join(ARTICLES_DIR, WITHERED_BANNER_FIXTURES.replacementTarget);
fs.rmSync(replacementDir, { recursive: true, force: true });
fs.mkdirSync(replacementDir, { recursive: true });
fs.writeFileSync(path.join(replacementDir, "index.md"), witheredBannerReplacementTargetMarkdown());

// 2. Hugo build (production env so PurgeCSS runs).
process.stdout.write("[build-and-serve] running hugo build\n");
const TEST_PUBLIC = path.join(REPO_ROOT, "public-test");
const result = spawnSync(
    "hugo",
    ["--environment", "production", "--logLevel", "error", "--destination", TEST_PUBLIC],
    {
        cwd: REPO_ROOT,
        encoding: "utf8",
        shell: process.platform === "win32",
    }
);
if (result.status !== 0) {
    process.stderr.write(
        `[build-and-serve] hugo build failed (exit ${result.status})\n` +
        `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
    process.exit(result.status || 1);
}
process.stdout.write("[build-and-serve] hugo build OK\n");

// 3. Static server.
const PORT = parseInt(process.env.PORT || "1314", 10);
const ROOT = TEST_PUBLIC;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".map": "application/json",
};

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
    res.writeHead(status, { "Content-Type": contentType });
    res.end(body);
}

const server = createServer(async (req, res) => {
    try {
        const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
        let resolved = normalize(join(ROOT, urlPath));

        if (!(resolved === ROOT || resolved.startsWith(ROOT + sep))) {
            return send(res, 403, "Forbidden");
        }

        let info;
        try {
            info = await stat(resolved);
        } catch {
            try {
                info = await stat(resolved + ".html");
                resolved += ".html";
            } catch {
                return send(res, 404, "Not Found");
            }
        }
        if (info.isDirectory()) {
            resolved = join(resolved, "index.html");
            try {
                info = await stat(resolved);
            } catch {
                return send(res, 404, "Not Found");
            }
        }

        const buf = await readFile(resolved);
        const mime = MIME[extname(resolved).toLowerCase()] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime, "Content-Length": buf.length });
        res.end(buf);
    } catch (err) {
        send(res, 500, `Server error: ${err && err.message}`);
    }
});

server.listen(PORT, () => {
    process.stdout.write(`[build-and-serve] http://localhost:${PORT}/ (root=${ROOT})\n`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
    process.on(sig, () => server.close(() => process.exit(0)));
}
