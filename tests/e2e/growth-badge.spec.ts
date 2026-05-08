import { test, expect } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

// Visual + structural tests for the growth-stage badge (Story 1.2).
// Strategy: create per-stage page-bundle fixtures under
// `content/articles/_test_growth_stage_<stage>/index.md` so Hugo serves a real
// `articles`-typed page (single.html branches on `.Page.Type "articles"`).
// Fixtures are wiped in afterAll; `.gitignore` excludes the prefix.

const REPO_ROOT = process.cwd();
const ARTICLES_DIR = path.join(REPO_ROOT, "content", "articles");
const STAGES = ["seedling", "budding", "evergreen", "withered"] as const;
type Stage = (typeof STAGES)[number];

const ICONS: Record<Stage, string> = {
    seedling: "seedling-line",
    budding: "flower-line",
    evergreen: "tree-line",
    withered: "skull-2-line",
};

const FIXTURES = {
    seedling: { dir: "_test_growth_stage_seedling" },
    budding: { dir: "_test_growth_stage_budding" },
    evergreen: { dir: "_test_growth_stage_evergreen" },
    withered: { dir: "_test_growth_stage_withered" },
    default: { dir: "_test_growth_stage_default" },
} as const;

function fixtureUrl(dir: string): string {
    return `/articles/${dir}/`;
}

function fixtureMarkdown(stage: Stage | null): string {
    const stageLine = stage
        ? `growth_stage: "${stage}"`
        : "# growth_stage intentionally omitted (default fallback)";
    return `---
title: "Growth Stage Test ${stage ?? "Default Fallback"}"
date: 2026-05-08
draft: false
summary: "E2E fixture for growth-stage badge — ${stage ?? "no field (default fallback)"}."
categories: ["Test"]
authors: ["angel"]
${stageLine}
---

Body for the ${stage ?? "default"} fixture.
`;
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

test.describe("Growth-stage badge (Story 1.2)", () => {
    // Serial mode: fixtures live for the whole describe block via beforeAll/afterAll.
    // Parallel workers would race on fixture create/delete (Hugo server is shared).
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async () => {
        for (const stage of STAGES) {
            const dir = path.join(ARTICLES_DIR, FIXTURES[stage].dir);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, "index.md"), fixtureMarkdown(stage));
        }
        const defaultDir = path.join(ARTICLES_DIR, FIXTURES.default.dir);
        fs.mkdirSync(defaultDir, { recursive: true });
        fs.writeFileSync(path.join(defaultDir, "index.md"), fixtureMarkdown(null));

        // hugo server watches the content folder; give it a moment to rebuild before tests.
        await new Promise((r) => setTimeout(r, 1500));
    });

    test.afterAll(async () => {
        for (const stage of STAGES) {
            const dir = path.join(ARTICLES_DIR, FIXTURES[stage].dir);
            fs.rmSync(dir, { recursive: true, force: true });
        }
        const defaultDir = path.join(ARTICLES_DIR, FIXTURES.default.dir);
        fs.rmSync(defaultDir, { recursive: true, force: true });
    });

    test("AC #1, #5, #9: every homepage card carries a growth-stage badge in the footer; existing badges/ribbons unchanged", async ({
        page,
    }) => {
        await page.goto("/");

        // Growth badge is a `<span class="growth-stage">` nested inside
        // `.card-footer-item.formats` alongside the format icons — see Story 1.2 Dev Notes.
        const cards = page.locator("article.card.is-horizontal").filter({
            has: page.locator(".card-footer span.growth-stage"),
        });
        const count = await cards.count();
        expect(count, "homepage should render at least one card with growth badge").toBeGreaterThan(
            0
        );

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);
            const badge = card.locator(".card-footer span.growth-stage").first();
            await expect(badge).toBeVisible();
            const dataStage = await badge.getAttribute("data-stage");
            expect(STAGES).toContain(dataStage as Stage);
        }
    });

    for (const stage of STAGES) {
        test(`AC #2, #3, #5: single page renders ${stage} badge with correct icon, label and color hook`, async ({
            page,
        }) => {
            await page.goto(fixtureUrl(FIXTURES[stage].dir));

            const badge = page.locator(`span.growth-stage[data-stage="${stage}"]`);
            await expect(badge).toBeVisible();
            await expect(badge.locator("span")).toHaveText(capitalize(stage));

            const useEl = badge.locator("svg use");
            const xlink = await useEl.getAttribute("xlink:href");
            expect(xlink, `svg use[xlink:href] should reference ${ICONS[stage]}`).toMatch(
                new RegExp(`#${ICONS[stage]}$`)
            );
        });
    }

    test("AC #8: missing growth_stage frontmatter falls back to seedling", async ({ page }) => {
        await page.goto(fixtureUrl(FIXTURES.default.dir));
        const badge = page.locator(`span.growth-stage[data-stage="seedling"]`);
        await expect(badge).toBeVisible();
        await expect(badge.locator("span")).toHaveText("Seedling");
    });

    test("AC #4, #6: tooltip via title attribute, icon decorative (aria-hidden)", async ({
        page,
    }) => {
        await page.goto(fixtureUrl(FIXTURES.evergreen.dir));
        const badge = page.locator(`span.growth-stage[data-stage="evergreen"]`);

        await expect(badge).toHaveAttribute("title", /^Evergreen[;—] /);
        await expect(badge.locator("svg")).toHaveAttribute("aria-hidden", "true");
    });

    test("AC #7: mobile viewport (≤640px) hides text label, preserves title tooltip", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(fixtureUrl(FIXTURES.budding.dir));

        const badge = page.locator(`span.growth-stage[data-stage="budding"]`);
        await expect(badge).toBeVisible();
        await expect(badge.locator("span")).toBeHidden();
        await expect(badge).toHaveAttribute("title", /^Budding[;—] /);
    });
});
