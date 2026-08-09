import { test, expect, FIXTURE_DIRS } from "./fixtures";

// Visual + structural tests for the growth-stage badge (Story 1.2).
// Per-stage page-bundle fixtures at `content/articles/_test_growth_stage_<stage>/`
// are written by `tests/e2e/build-and-serve.mjs` BEFORE hugo runs, so the static
// export picks them up. Cleanup happens in `tests/e2e/global-teardown.ts`.
// `.gitignore` excludes the `_test_growth_stage_` prefix as a backstop.

const STAGES = ["seedling", "budding", "evergreen", "withered"] as const;
type Stage = (typeof STAGES)[number];

const ICONS: Record<Stage, string> = {
    seedling: "seedling-line",
    budding: "flower-line",
    evergreen: "tree-line",
    withered: "skull-2-line",
};

function fixtureUrl(stage: Stage | "default"): string {
    return `/articles/${FIXTURE_DIRS[stage]}/`;
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

test.describe("Growth-stage badge (Story 1.2)", () => {

    test("AC #1, #5, #9: every non-log homepage card carries a growth-stage badge in the footer; existing badges/ribbons unchanged", async ({
        page,
    }) => {
        await page.goto("/");

        // SELECTORS FOLLOW THE CARD, THE ASSERTION DOES NOT. The card moved to the
        // garden theme, so `article.card.is-horizontal` with a `.card-footer` is
        // now `article.at-card` with an `.at-card-footer`, and the badge is
        // `span.at-growth` instead of `span.growth-stage`. What is being checked
        // is unchanged: every non-note card on the front page carries a
        // growth-stage marker, and its stage is one of the four.
        const allCards = page.locator("article.at-card").filter({
            has: page.locator(".at-card-footer"),
        });
        const count = await allCards.count();
        expect(count, "homepage should render at least one article card").toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const card = allCards.nth(i);
            // Note cards show the lightbulb and bookmark cards the bookmark glyph
            // instead of a growth badge — a note has no maturity to report and a
            // saved link does not ripen. Skip both.
            const isNote = (await card.locator(".at-card-footer [data-tooltip='Notiz']").count()) > 0;
            const isBookmark = (await card.locator(".at-card-footer [data-tooltip='Lesezeichen']").count()) > 0;
            if (isNote || isBookmark) continue;

            const badge = card.locator(".at-card-footer span.at-growth").first();
            await expect(badge, `card ${i} should have a growth-stage badge`).toBeVisible();
            const dataStage = await badge.getAttribute("data-stage");
            expect(STAGES).toContain(dataStage as Stage);
        }
    });

    // The single-page header carries ONE growth-badge per page in `.info.widget`.
    // Any related-articles card on the same page renders its own growth-badge in
    // `.card-footer-item.formats`, so a bare `span.growth-stage[data-stage=...]`
    // selector matches multiple elements and breaks `.toBeVisible()`.
    // Scope to `.info.widget` so we always assert against the article's own badge.
    for (const stage of STAGES) {
        test(`AC #2, #3, #5: single page renders ${stage} badge with correct icon, label and color hook`, async ({
            page,
        }) => {
            await page.goto(fixtureUrl(stage));

            const badge = page.locator(`.info.widget span.growth-stage[data-stage="${stage}"]`);
            await expect(badge).toBeVisible();
            await expect(badge.locator("span")).toHaveText(capitalize(stage));

            const useEl = badge.locator("svg use");
            const href = await useEl.getAttribute("href");
            expect(href, `svg use[href] should reference ${ICONS[stage]}`).toMatch(
                new RegExp(`#${ICONS[stage]}$`)
            );
        });
    }

    test("AC #8: missing growth_stage frontmatter falls back to seedling", async ({ page }) => {
        await page.goto(fixtureUrl("default"));
        const badge = page.locator(`.info.widget span.growth-stage[data-stage="seedling"]`);
        await expect(badge).toBeVisible();
        await expect(badge.locator("span")).toHaveText("Seedling");
    });

    test("AC #4, #6: tooltip via title attribute, icon decorative (aria-hidden)", async ({
        page,
    }) => {
        await page.goto(fixtureUrl("evergreen"));
        const badge = page.locator(`.info.widget span.growth-stage[data-stage="evergreen"]`);

        await expect(badge).toHaveAttribute("title", /^Evergreen[;—] /);
        await expect(badge.locator("svg")).toHaveAttribute("aria-hidden", "true");
    });

    test("AC #7 (revised): mobile viewport (≤640px) keeps stage text and title tooltip in the status tile", async ({
        page,
    }) => {
        // Story 1.2 AC #7 originally asserted "mobile hides text label" for
        // the legacy inline/card badge layout (compact card-footer context).
        // The 2026-05 redesign moves the single-page badge into its own
        // status tile (article-info.scss, `.info-tile[data-tile="status"]`)
        // with a dedicated row — text fits even at narrow widths, and
        // hiding it on mobile would leave the wrapper visually empty
        // (the inline svg is also suppressed inside the tile, since the
        // standalone tile-left icon already renders the stage glyph).
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(fixtureUrl("budding"));

        const badge = page.locator(`.info.widget span.growth-stage[data-stage="budding"]`);
        await expect(badge).toBeVisible();
        await expect(badge.locator("span")).toBeVisible();
        await expect(badge.locator("span")).toHaveText("Budding");
        await expect(badge).toHaveAttribute("title", /^Budding[;—] /);
    });
});
