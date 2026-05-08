import { test, expect } from "@playwright/test";

// E2E smoke test — Hugo-update regression canary.
// One assertion: homepage loads with HTTP 200 AND emits a Hugo generator meta tag.
// Visual regression / journey / a11y tests come in Story 1.2+ per
// docs/2-solutioning/test-design-system.md. Don't expand scope here.
test("homepage loads and Hugo generator meta is present", async ({ page }) => {
  const response = await page.goto("/");

  expect(response, "homepage navigation returned no response").not.toBeNull();
  expect(response!.status()).toBe(200);

  const generator = page.locator('meta[name="generator"]');
  await expect(generator).toHaveAttribute("content", /Hugo/i);
});
