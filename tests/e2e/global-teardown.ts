import * as fs from "node:fs";
import * as path from "node:path";
import { FIXTURE_DIRS, WITHERED_BANNER_FIXTURES } from "./fixtures";

// Playwright globalTeardown — runs ONCE after all tests complete.
// Removes the fixture bundles created by build-and-serve.mjs so the working
// tree stays clean. `.gitignore` already excludes the `_test_growth_stage_`
// prefix, so a crash that skips this teardown still won't pollute commits.

const REPO_ROOT = process.cwd();
const ARTICLES_DIR = path.join(REPO_ROOT, "content", "articles");

export default async function globalTeardown() {
    const allDirs = [
        ...Object.values(FIXTURE_DIRS),
        ...Object.values(WITHERED_BANNER_FIXTURES),
    ];
    for (const dirName of allDirs) {
        const dir = path.join(ARTICLES_DIR, dirName);
        fs.rmSync(dir, { recursive: true, force: true });
    }
}
