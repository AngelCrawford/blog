import { test, expect } from "./fixtures";

// E2E smoke test — Hugo-update regression canary.
// One assertion: homepage loads with HTTP 200 AND emits a Hugo generator meta tag.
// Deliberately narrow — see docs/testing.md. Don't expand scope here.
test("homepage loads and Hugo generator meta is present", async ({ page }) => {
  const response = await page.goto("/");

  expect(response, "homepage navigation returned no response").not.toBeNull();
  expect(response!.status()).toBe(200);

  const generator = page.locator('meta[name="generator"]');
  await expect(generator).toHaveAttribute("content", /Hugo/i);
});
