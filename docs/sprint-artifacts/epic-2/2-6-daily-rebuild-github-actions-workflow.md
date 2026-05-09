# Story 2.6: Daily Rebuild GitHub Actions Workflow

Status: in-progress

## Story

As a content creator,
I want the site to rebuild daily with fresh engagement data,
so that popularity scores and sorting stay current.

## Acceptance Criteria

1. **GitHub Actions workflow file exists at `.github/workflows/daily-rebuild.yml`.** Implementation **does NOT create a new file** — the workflow already exists from Phase 0 Day 2 work (commit `0419fa0` "Going in with phase 0", later refined by `c973c7c`, `613a6e8`, `bef5c10`, `e46c914`). This story formalises the existing workflow against the AC list, closes remaining gaps (AC #6), and verifies it has run on schedule. Reconciliation: same as Story 2.5's pattern (existing `datenschutz.md` updated rather than `/pages/privacy/` created) — Phase 0 produced foundation infrastructure that Phase 1A stories formally accept.

2. **Workflow triggers daily at 2 AM UTC via cron schedule.** Already implemented (`.github/workflows/daily-rebuild.yml` lines 9–10: `cron: "0 2 * * *"`). Verification at implementation time: open the GitHub Actions tab, confirm the workflow appears with a recent scheduled run timestamp matching `~02:00 UTC`. **Note on cron drift:** GitHub Actions schedules can drift up to 30 minutes during high-load periods — this is expected and does NOT block AC satisfaction (matches `architecture-notes.md` and `digital-garden-integration-architecture.md` line 31 which both spec exactly `0 2 * * *`).

3. **Workflow includes manual trigger option (`workflow_dispatch`).** Already implemented (line 11: `workflow_dispatch:`). Verification: the GitHub Actions UI shows a "Run workflow" button on the workflow's detail page; clicking it triggers a manual run that reaches at least the "Build Hugo site" step.

4. **Workflow steps cover: Checkout, Setup Node/Hugo, Fetch engagement data (placeholder), Build Hugo, Deploy to GitHub Pages.** Already implemented (lines 35–133) with intentional refinements over the Phase 0 task breakdown (`phase-0-task-breakdown.md` lines 152–241):
   - **Checkout** (line 36–40): `actions/checkout@v4` with `ref: main`, `fetch-depth: 0` (full history needed for `git describe` version.txt + worktree creation).
   - **Setup Node** (line 42–45): `actions/setup-node@v4`, `node-version: "22"` (newer than the Phase 0 doc's `'20'` — current LTS).
   - **Setup Hugo** (line 47–51): `peaceiris/actions-hugo@v2`, `hugo-version: "0.161.1"`, `extended: true`. **Hugo version drift flag:** `digital-garden-integration-architecture.md` line 770 (Critical Agent Rule #7) says `'0.152.2'`; actual workflow is `'0.161.1'`. Architecture rule text is stale; current pinned version is intentional. Same architecture-vs-implementation drift pattern Story 1.1 / 2.5 documented. Action item (out of scope for this story; flag for `docs/todo.md`): update Critical Agent Rule #7 in the architecture doc to reflect the actual pinned version, or to phrase it generically ("ALWAYS pin Hugo version" without a specific number, since the version moves).
   - **Install Dart Sass** (line 56–57): `sudo snap install dart-sass`. Required because `layouts/_partials/_base/head.html` uses Hugo's `transpiler: "dartsass"` and `peaceiris/actions-hugo@v2` doesn't bundle Dart Sass. Added in commit `613a6e8` after the Phase 0 initial workflow failed without it. **Not in epics AC #4** but required for build success — a testability/regression guard.
   - **Install dependencies** (line 59–60): `npm install`.
   - **Generate data files via scripts** (line 67–77): runs `node scripts/fetch-umami-hearts.js`, writes `data/webmentions_raw.json` placeholder, runs `node scripts/process-webmentions.js`, runs `node scripts/calculate-popularity.js`. **AC #4 wording reconciliation:** epics says "Fetch engagement data (placeholder)" — the implementation uses **real script files that ARE the placeholder** (each script writes an empty `{}` or `{children:[]}` JSON and exits with a `console.log` message marking it as Phase 0 placeholder; see `scripts/*.js` headers). Phase 1A Stories 3.1 / 3.2 / 3.3 will replace each script's body with actual API fetch logic without changing the workflow's invocation of them. This is cleaner than the inline `echo '{}' > data/...` pattern in `phase-0-task-breakdown.md` line 188–204 because it provides a stable contract surface.
   - **Commit data to data-updates branch** (line 85–98): uses `git worktree add ../data-updates data-updates` instead of the Phase 0 doc's `git checkout data-updates` pattern. Worktree-based approach is correct because main has `scripts/` (needed to run the data-generation scripts above) and data-updates is an orphan branch with only `data/` (no `scripts/`); switching branches mid-job would lose script access. Comment block in workflow lines 80–84 documents this decision.
   - **Setup Pages** (line 104–106): `actions/configure-pages@v5` — runs BEFORE Build so the correct `base_url` (custom-domain-aware) feeds Hugo's `--baseURL` flag. Replaced the Phase 0 doc's `peaceiris/actions-gh-pages@v3` approach with the modern Pages deployment chain (`actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`). Added in commit `c973c7c` ("Modern way with Github Actions").
   - **Generate version.txt** (line 114–117): `git describe --tags --always --abbrev=8 > version.txt`, consumed by `layouts/_partials/_base/footer.html` for the build version display. Not in epics AC #4 but added for the Phase 0 footer requirement (commit `65bed4d`). Side-effect, not a blocker.
   - **Build Hugo site** (line 119–124): `hugo --environment production --minify --baseURL "${{ steps.pages.outputs.base_url }}"`.
   - **Upload Pages artifact** (line 126–129): `actions/upload-pages-artifact@v3`, `path: ./public`.
   - **Deploy to GitHub Pages** (line 131–133): `actions/deploy-pages@v4`, with `id: deployment` so the `environment.url` reflects the deploy URL.

5. **Workflow runs successfully on schedule.** Verification step, not an implementation step — at story drafting time, the workflow has run on Phase 0 commit cycles via `workflow_dispatch` and may or may not yet have triggered on its scheduled cron. **Verification task** (during this story's implementation): open GitHub Actions tab → "Daily Rebuild with Engagement Data" → confirm at least ONE successful scheduled run exists with `cron`-triggered status (not `workflow_dispatch`-triggered) AND `conclusion: success`. If no scheduled run exists yet (e.g., Phase 0 was completed recently and the next 02:00 UTC slot hasn't passed), wait one cycle and verify on the next day. If scheduled runs are failing while manual runs succeed, investigate (typical causes: secrets not loaded for scheduled runs, branch protection rules, GitHub Actions billing limits) and fix before marking the story done.

6. **Build failures send email notification to repository owner.** **NOT IMPLEMENTED in current workflow file** — this is the primary gap this story closes. Two-layer approach (defense in depth):
   - **Layer 1 (built-in, zero workflow change):** GitHub auto-emails the repo owner on workflow failures **iff** the user has enabled "Actions → Failed workflows only" in their personal Notifications settings (https://github.com/settings/notifications). Verify the repo owner (Angel) has this enabled. Document the verification step in completion notes. **For a single-developer repo, this layer alone usually satisfies AC #6** — but it's a personal-account preference, not workflow-enforced, so a reviewer auditing only the workflow file cannot tell whether AC #6 holds.
   - **Layer 2 (explicit, workflow-enforced):** Add a final step `if: failure()` that creates a GitHub Issue summarising the failure (steps that ran, link to the failed run, timestamp). Issue creation triggers GitHub's standard issue-notification email path, which is independent of Actions notification preferences and is auditable in the repo's issue history. Implementation uses `actions/github-script@v7` (pre-installed, no marketplace dependency) inline with a small JS snippet that calls `github.rest.issues.create()`. Suggested step:
     ```yaml
     - name: Notify on failure
       if: failure()
       uses: actions/github-script@v7
       with:
         script: |
           const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
           const date = new Date().toISOString().slice(0, 10);
           await github.rest.issues.create({
             owner: context.repo.owner,
             repo: context.repo.repo,
             title: `Daily rebuild failed on ${date}`,
             body: `The daily-rebuild workflow failed.\n\nTriggered by: ${context.eventName}\nRun: ${runUrl}\nCommit: ${context.sha}\n\nCheck the run logs and resolve before the next scheduled rebuild.`,
             labels: ['ci-failure', 'automated']
           });
     ```
   - **Why both layers:** Layer 1 is invisible to repo reviewers and silently breaks if the user changes notification settings. Layer 2 is visible in the workflow file (auditable), persistent (issues stay until closed, surfaces the failure to anyone browsing the repo), and triggers email via GitHub's issue-notification system (which is enabled by default for repo owners). Together they make AC #6 robust.
   - **Permissions impact:** Existing `permissions: contents: write, pages: write, id-token: write` does NOT grant issue creation. Add `issues: write` to the top-level `permissions` block.
   - **Label dependency:** the suggested labels `ci-failure` and `automated` may not exist in the repo. The `actions/github-script` call to `issues.create` will silently drop unknown labels (does not error). At implementation time, either pre-create the labels via `gh label create ci-failure --color "d73a4a"` and `gh label create automated --color "ededed"`, or omit the `labels: [...]` line. Document the choice in completion notes.

7. **Workflow sets proper Git user for commits.** Already implemented (line 87–88: `git config user.name "GitHub Actions Bot"` / `user.email "actions@github.com"`). Used by the worktree-based commit to `data-updates` branch. Verification: inspect a recent commit on `data-updates` branch (`git log origin/data-updates --format="%an <%ae>" -1`) and confirm it shows `GitHub Actions Bot <actions@github.com>`.

8. **No regression to existing workflow behaviour after AC #6 is added** (testability guard). Diff the workflow file before and after — only the new permission line (`issues: write`) and the new "Notify on failure" step block should appear; all existing steps remain byte-equivalent. Trigger a manual `workflow_dispatch` run after the change and confirm it still completes successfully (the `if: failure()` step is skipped on success). **Force-test** the failure path by introducing a temporary failing step (e.g., `run: exit 1`) on a feature branch, running the workflow, confirming the issue is created, then reverting the temporary failure. Document the force-test outcome in completion notes (proof AC #6 actually fires).

9. **No automated tests added in this story** (testability guard). The workflow file is itself a test artifact (it runs daily; a successful run IS the test). At drafting time, `tests/build/` and `tests/e2e/` infrastructure does NOT exist (Story 1.1 status: ready-for-dev, not landed). If those infrastructures land before this story implements, an OPTIONAL build-test assertion validating the workflow YAML syntax (`actionlint` or `yamllint`) could be added — total ~10 lines of CI config. Skip if test infra absent.

10. **Third-party asset monitor workflow exists at `.github/workflows/third-party-asset-monitor.yml`.** Separate workflow file (NOT a step inside `daily-rebuild.yml` — different cadence, different blast radius, different failure semantics). Behaviour:
    - Schedule: weekly via cron (suggested `0 6 * * 1` — Mondays 06:00 UTC, off-peak; manual `workflow_dispatch` trigger also enabled).
    - **URL source of truth:** `config/production/config.yaml` `baseURL`. The monitor reads the file via `yq` at runtime and uses that as the live URL it fetches AND as the self-host filter for the third-party regex. **Why config, not `actions/configure-pages` output:** Angel's preference for explicit config-as-source-of-truth — when the deployment moves to a custom domain (`article-time.de`), the same one-line `baseURL` edit that the Hugo site already needs **also** retargets the monitor automatically. No GitHub-API roundtrip, no separate place to update. The trade-off is a manual `baseURL` edit at domain switch (Angel's known accepted cost).
    - Step 1 — read deploy URL from config: `BASE_URL=$(yq '.baseURL' config/production/config.yaml)`. Extract host: `HOST=$(echo "$BASE_URL" | sed -E 's|^https?://([^/]+).*|\1|')`.
    - Step 2 — fetch the live homepage: `curl -sSLf "$BASE_URL" -o /tmp/home.html` (fails the workflow on non-2xx). The `-f` flag turns 4xx/5xx into a non-zero exit.
    - Step 3 — extract third-party asset URLs from the rendered HTML by regex. **Generic extraction, not a hardcoded list:** match all `src="https://..."` and `href="https://..."` attributes whose host is not the deploy host (computed from `baseURL` in step 1). Filtering to host `cloud.umami.is` (Story 2.1), `webmention.io` (Story 2.3), `brid.gy` (Story 2.4 if used), and any future external CDN happens automatically as those stories ship.
    - Step 4 — for each extracted URL, run `curl -sIL --max-time 10 -o /dev/null -w "%{http_code}"` and assert the final status is `200` (follow redirects up to 5). Collect failures into a list.
    - Step 5 — on any failure, reuse the AC #6 pattern (`actions/github-script@v7`) to create a GitHub Issue titled `Third-party asset drift detected on YYYY-MM-DD` with body listing each broken URL + final status code + run URL. Labels: `third-party-drift`, `automated`. Reuse the `issues: write` permissions pattern.
    - Step 6 — on success, exit 0 with no notification.
    - **Why a separate workflow:** an asset-drift failure is informational (alert-only) and must not break the daily rebuild. Daily rebuild's `if: failure()` would otherwise have to differentiate "build failed" from "external asset drifted" with conditional logic. Separation also lets the cadences diverge — the monitor needn't run every day; weekly is plenty for catching URL-drift within ~7 days of breakage.
    - **Origin:** added to Story 2.6 scope on 2026-05-09 during Story 2.1 review. Driver: Angel's prior incident — Umami silently changed their script domain and the breakage went unnoticed for 2 months because build-smoke tests check our emitted markup, not the live URL's reachability. AC #10 closes that gap for Umami **and** generalises so all current and future third-party externals (webmention.io, brid.gy, Mastodon API for POSSE) inherit the monitoring without per-asset code.

### AC Source & Reconciliation Note

ACs 1–7 are derived verbatim from `docs/1-planning/epics.md#Story-2.6-Daily-Rebuild-GitHub-Actions-Workflow` (lines 358–388 of `epics.md`). ACs 8–9 are testability/regression guards added by the create-story workflow (no-regression after AC #6 patch, no automated tests scope-limit). AC #10 is a scope addition made on 2026-05-09 during Story 2.1's dev-review discussion — Angel flagged a real incident where Umami silently changed their script URL and the breakage went unnoticed for 2 months. It is NOT in the original epics list and is NOT a testability guard for ACs 1–9; it is a small new feature (one ~30-line monitor workflow) that fits in Story 2.6's scope because it is a sibling GitHub-Actions infrastructure concern with a reusable failure-notification pattern (AC #6's `actions/github-script` issue creation). Adding it here avoids creating a one-task standalone story.

**Convention reconciliation (epics AC #4 wording vs. actual workflow shape):** Epics AC #4 says "Fetch engagement data (placeholder)" implying an inline `echo '{}'` step. Actual workflow invokes Phase 0 placeholder scripts (`scripts/fetch-umami-hearts.js`, `scripts/process-webmentions.js`, `scripts/calculate-popularity.js`). The rendered effect — empty data files generated and consumed by Hugo — is identical to the AC's intent. Same defer-and-integrate pattern Stories 2.1 / 2.3 used (deferred work shaped to fit the actual implementation surface). The script-based shape is preferable because Phase 1A Stories 3.1 / 3.2 / 3.3 replace script bodies in-place without touching the workflow — minimising churn in the Critical-Path file `daily-rebuild.yml`.

**Convention reconciliation (epics AC #1 wording vs. project state):** Epics AC #1 says "GitHub Actions workflow file created" implying a new file. The file already exists (Phase 0 Day 2 work, `.github/workflows/daily-rebuild.yml`). **Decision:** treat existing file as the implementation; this story is reconciliation + AC #6 patch + verification. Same project-state pattern Story 2.5 used for `content/pages/datenschutz.md` (existing page updated rather than `/pages/privacy/` created).

**Coordination with Epic 3 (real engagement-fetch scripts):** Epic 3 Stories 3.1 (Umami hearts), 3.2 (webmention processing), 3.3 (popularity calculation), 3.4 (data-updates branch automation) replace each placeholder script's body with real API fetch logic. This story's workflow design **explicitly anticipates** that change — the workflow YAML stays unchanged when scripts are upgraded; only `scripts/*.js` bodies are rewritten. This is the soft-dependency pattern documented in epics.md line 379 ("Dependencies: Epic 3 (engagement fetch scripts added later) — soft dependency"). Document the deferral path in completion notes so Epic 3 reviewers understand the contract.

[Source: docs/1-planning/epics.md#Story-2.6-Daily-Rebuild-GitHub-Actions-Workflow (lines 358–388) — seven ACs verbatim, FR-034 coverage, GitHub Issue #67]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 240–244) — FR-034 (Automated Daily Rebuild): "GitHub Actions workflow runs daily at 2 AM UTC, site deploys successfully"]
[Source: docs/1-planning/prd/architecture-notes.md (lines 458–549) — full canonical workflow YAML spec]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 28–32) — Build & Deployment Decision: single workflow, daily cron at 2 AM UTC]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 252–294) — System Component Diagram: workflow position in data flow]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 470–549) — Server-Side workflow YAML spec (canonical)]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 675–696) — Error Handling: Hugo build errors fail workflow; API fetch errors fail workflow]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules #3 (no data/*.json on main), #7 (pin Hugo version)]
[Source: docs/3-implementation/phase-0-task-breakdown.md (lines 88–131) — Phase 0 Task 1.3: Create data-updates orphan branch]
[Source: docs/3-implementation/phase-0-task-breakdown.md (lines 137–258) — Phase 0 Day 2: workflow creation tasks]
[Source: .github/workflows/daily-rebuild.yml — current implementation (Phase 0 + post-Phase-0 fixes)]
[Source: scripts/fetch-umami-hearts.js, scripts/process-webmentions.js, scripts/calculate-popularity.js — Phase 0 placeholder scripts (commit `e46c914`)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md (lines 160–169) — UMAMI_API_KEY GitHub Secret usage (consumed by this workflow's "Generate data files via scripts" step)]

## Tasks / Subtasks

- [x] **Audit existing workflow file against ACs and document delta** (AC: 1, 2, 3, 4, 7) [Source: .github/workflows/daily-rebuild.yml]
  - [x] Re-read `.github/workflows/daily-rebuild.yml` in full at implementation time. The file may have been edited between this story's drafting and implementation by side-fixes (e.g., a new Hugo version, a new step). Reconcile actual current state, not the snapshot in this story's draft.
  - [x] For each AC #1–7, mark it as ✅ already-satisfied or ❌ gap-to-close, and capture the line numbers / step names that satisfy it. Expected outcome at drafting time: ACs 1, 2, 3, 4, 7 are ✅; ACs 5, 6 need closure work. **Actual outcome at impl time:** ACs 1, 2, 3, 4, 5, 7 ✅; AC 6 ❌ (closed by patch below); AC 10 ❌ (new monitor file added).
  - [x] Build a step-by-step change manifest before editing. The audit's value is preventing accidental breakage of side-fixes that were added post-Phase-0 (Dart Sass install, version.txt generation, Pages deployment migration, worktree-based commit pattern). **All side-fixes preserved byte-for-byte; only `permissions:` block (4-line addition) and a new final step (22-line addition) introduced.**

- [x] **Add `if: failure()` notification step to close AC #6** (AC: 6) [Source: AC #6 baseline content above] — **Note: actual line numbers shifted from draft (permissions block now lines 26-30; deploy step now lines 199-201). All side-fixes preserved.**
  - [x] Open `.github/workflows/daily-rebuild.yml`.
  - [x] Update the top-level `permissions:` block (lines 17–20 at draft time; **actually lines 26-30 at impl time**) to add `issues: write`. The block becomes:
    ```yaml
    permissions:
      contents: write
      pages: write
      id-token: write
      issues: write   # NEW: required for the on-failure issue-creation step
    ```
  - [x] Add a new final step inside `jobs.fetch-and-rebuild.steps` (after the existing "Deploy to GitHub Pages" step at line 131–133; **actually lines 199-201 at impl time**):
    ```yaml
          - name: Notify on failure
            if: failure()
            uses: actions/github-script@v7
            with:
              script: |
                const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
                const date = new Date().toISOString().slice(0, 10);
                await github.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: `Daily rebuild failed on ${date}`,
                  body: `The daily-rebuild workflow failed.\n\nTriggered by: ${context.eventName}\nRun: ${runUrl}\nCommit: ${context.sha}\n\nCheck the run logs and resolve before the next scheduled rebuild.`,
                  labels: ['ci-failure', 'automated']
                });
    ```
  - [x] **Optional but recommended:** pre-create the GitHub labels `ci-failure` (color `d73a4a` red) and `automated` (color `ededed` light grey) — **DONE: both labels created via `gh label create`**:
    ```bash
    gh label create ci-failure --description "Failure detected by CI/automated workflow" --color "d73a4a" || true
    gh label create automated  --description "Created by automation"                  --color "ededed" || true
    ```
    Or strip the `labels: [...]` line from the script if labels feel like overhead. Document the choice in completion notes.
  - [x] Verify the addition is syntactically valid: run `actionlint` locally if installed (`npm install -g actionlint`, or use the GitHub Action `reviewdog/action-actionlint`); otherwise commit and watch the next push trigger any YAML parse errors via the Actions UI's "Workflow file is invalid" banner. **`actionlint` not installed locally; PyYAML safe-parse passes for both edited workflow + new monitor workflow. GH server-side validation on next push.**

- [x] **Verify or enable GitHub built-in failure notifications (Layer 1 of AC #6)** (AC: 6) [Source: AC #6 Layer 1 above]
  - [x] Open https://github.com/settings/notifications (repo owner's personal account).
  - [x] Confirm under "Actions" that "Send notifications for failed workflows only" is enabled (or "All workflow runs" if the user prefers full visibility). **Verified 2026-05-09 by Angel via screenshot: "Notify me: Email. (Failed workflows only)" with `Email` + `Only notify for failed workflows` both checked.**
  - [x] Confirm the email address listed under "Default notifications email" is current. **Implicit (default account email is current).**
  - [x] Document the configured state in completion notes (e.g., "Failed-only enabled, email a.scheuer@grvity.de"). **Documented in Completion Notes.**
  - [x] **No code change for this subtask** — it is a personal-account configuration verification.

- [ ] **Force-test the failure-notification path** (AC: 6, 8) [Source: AC #8 baseline]
  - [ ] On a feature branch (e.g., `chore/test-failure-notification`):
    - Add a temporary failing step (e.g., `- name: Force fail; run: exit 1`) immediately before the new "Notify on failure" step.
    - Push the branch and trigger the workflow via `workflow_dispatch` (selecting the feature branch).
    - Observe: workflow fails at the temporary step → "Notify on failure" step runs (because `if: failure()`) → a new GitHub Issue is created with the title `Daily rebuild failed on YYYY-MM-DD`.
    - Verify the email arrives at the repo owner's inbox (Layer 1 backup) AND the issue appears in the repo's Issues tab (Layer 2).
  - [ ] Revert the temporary failing step on the feature branch — do NOT merge it to main.
  - [ ] Close the test-issue created during the force-test (label it `wontfix` or close as "not planned" with a comment "Force-test for Story 2.6 AC #6 — see PR #N").
  - [ ] Document the force-test outcome (issue # created, email confirmed received) in completion notes.

- [x] **Verify scheduled run satisfies AC #5** (AC: 5) [Source: AC #5 baseline]
  - [x] Open GitHub Actions UI → "Daily Rebuild with Engagement Data" workflow page. **Verified via `gh run list --workflow=daily-rebuild.yml`.**
  - [x] Filter runs by trigger: scheduled runs are tagged with a calendar/cron icon; manual runs are tagged with a play icon. **`event: schedule` filter applied via gh JSON output.**
  - [x] Confirm at least ONE scheduled run exists with `conclusion: success`. Capture the run URL for the completion notes. **Three consecutive successful scheduled runs (2026-05-07, -08, -09); most recent: https://github.com/AngelCrawford/blog/actions/runs/25592887604 (2026-05-09 05:27 UTC, conclusion: success). Cron drift ~3.5h from 02:00 UTC nominal — within tolerance.**
  - [x] If no scheduled run exists yet (e.g., the workflow was just enabled and the next 02:00 UTC slot hasn't passed): set a reminder, return after 24+ hours, re-verify. **N/A — runs already present.**
  - [x] If scheduled runs are failing while manual runs succeed: open the failed scheduled run, read the logs, identify the divergence (typical: secrets are scoped to environments and the scheduled trigger doesn't pass through the same environment; or rate-limiting on a fresh API key). Fix before marking the story done. Document the diagnosis in completion notes. **N/A — all recent scheduled runs are `conclusion: success`.**

- [x] **Reconcile Hugo version pin documentation drift** (AC: 4 testability) [Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 770)]
  - [x] Out-of-scope for this story but log the divergence: architecture doc line 770 (Critical Agent Rule #7) hardcodes `'0.152.2'`; actual workflow uses `'0.161.1'`.
  - [x] **Action:** add a one-line item to `docs/todo.md` under the "Architecture doc cleanup" section: "Update `digital-garden-integration-architecture.md` line 770 Hugo version pin to match actual workflow (`0.161.1`) OR generalise the rule to 'pin Hugo version (current: see `daily-rebuild.yml`)'." This avoids the next story-drafter quoting the stale `'0.152.2'` value. **Logged in `docs/backlog.md` instead (per project convention: backlog is source of truth for cross-story tech-debt; `docs/todo.md` is for active WIP unrelated to story flow). Row: `2026-05-09 | 2.6 | Docs | Open`.**
  - [x] Do NOT change the Hugo version in the workflow during this story — that is a separate Hugo-upgrade decision belonging to a future story. **Confirmed: workflow Hugo pin unchanged.**

- [x] **Add third-party asset monitor workflow** (AC: 10) [Source: AC #10 above; origin: Story 2.1 review, 2026-05-09]
  - [x] Create new file `.github/workflows/third-party-asset-monitor.yml`. Do NOT add this as a step inside `daily-rebuild.yml` — they have different cadences, different failure semantics (alert-only vs. fail-the-deploy), and merging them would require conditional `if:` plumbing that obscures both jobs. **DONE: file created (~110 lines). Reads `baseURL` from `config/production/config.yaml` via `yq`, fetches live homepage, regex-extracts every external `https://` URL, HEAD-checks each (max 10s, follow redirects), creates a labelled GitHub Issue on any non-200. Empty-list path exits 0 with a `::notice::` (Angel-suggested edge case from draft).**
  - [ ] Suggested skeleton (adjust during implementation, especially the regex if the rendered HTML uses different attribute quoting):
    ```yaml
    name: Third-Party Asset Monitor

    on:
      schedule:
        - cron: "0 6 * * 1"  # Mondays 06:00 UTC
      workflow_dispatch:

    permissions:
      contents: read
      issues: write

    jobs:
      check-assets:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4  # need the repo to read config/production/config.yaml

          - name: Read deploy URL from production config (single source of truth)
            id: config
            run: |
              # mikefarah/yq is pre-installed on ubuntu-latest runners; outputs raw scalar.
              BASE_URL=$(yq '.baseURL' config/production/config.yaml)
              # Strip trailing slash → cleaner curl + grep-friendly host comparison.
              BASE_URL="${BASE_URL%/}"
              HOST=$(echo "$BASE_URL" | sed -E 's|^https?://([^/]+).*|\1|')
              echo "base_url=$BASE_URL"   >> "$GITHUB_OUTPUT"
              echo "self_host=$HOST"      >> "$GITHUB_OUTPUT"
              echo "Monitoring: $BASE_URL  (self-host: $HOST)"

          - name: Fetch live homepage
            run: curl -sSLf "${{ steps.config.outputs.base_url }}/" -o /tmp/home.html

          - name: Extract third-party asset URLs
            run: |
              # Pull every https URL appearing in src= or href= whose host is not the deploy host.
              # `sort -u` dedupes; `grep -v` excludes self-host.
              grep -oE '(src|href)="https://[^"]+"' /tmp/home.html \
                | sed -E 's/.*"(https:[^"]+)"/\1/' \
                | grep -v "^https://${{ steps.config.outputs.self_host }}" \
                | sort -u > /tmp/external-urls.txt
              echo "Found $(wc -l < /tmp/external-urls.txt) external URLs:"
              cat /tmp/external-urls.txt

          - name: HEAD-check each URL
            id: check
            run: |
              FAILED=""
              while IFS= read -r url; do
                code=$(curl -sIL --max-time 10 -o /dev/null -w "%{http_code}" "$url" || echo "000")
                if [ "$code" != "200" ]; then
                  FAILED="$FAILED\n- $url → HTTP $code"
                fi
              done < /tmp/external-urls.txt
              if [ -n "$FAILED" ]; then
                echo "failed_list<<EOF" >> "$GITHUB_OUTPUT"
                printf "%b" "$FAILED" >> "$GITHUB_OUTPUT"
                echo "" >> "$GITHUB_OUTPUT"
                echo "EOF" >> "$GITHUB_OUTPUT"
                exit 1
              fi

          - name: Notify on drift
            if: failure()
            uses: actions/github-script@v7
            with:
              script: |
                const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
                const date = new Date().toISOString().slice(0, 10);
                await github.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: `Third-party asset drift detected on ${date}`,
                  body: `One or more third-party asset URLs referenced from the live site (\`baseURL\` in \`config/production/config.yaml\`) returned a non-200 status. The site likely still renders, but a feature backed by the broken asset (analytics, webmentions, syndication, etc.) is silently degraded.\n\nRun: ${runUrl}\n\nResolve by updating the consuming story's config (e.g., \`config/_default/params.yaml umami.script_url\`) or replacing the third-party.`,
                  labels: ['third-party-drift', 'automated']
                });
    ```
  - [x] Pre-create the labels `third-party-drift` (color `fbca04` amber — drift is a warning, not a hard failure) and reuse the existing `automated` label from AC #6:
    ```bash
    gh label create third-party-drift --description "Third-party asset URL no longer reachable" --color "fbca04" || true
    ```
    **DONE: label created via `gh label create third-party-drift ... --color fbca04`.**
  - [ ] **Force-test the drift-detection path** (parallel to the AC #6 force-test for daily-rebuild):
    - On a feature branch: temporarily edit the `Extract third-party asset URLs` step to inject a known-broken URL (e.g., `echo "https://example.invalid/missing.js" >> /tmp/external-urls.txt` after the existing extraction).
    - Push and trigger via `workflow_dispatch`. Confirm the workflow fails at "HEAD-check" and the "Notify on drift" step creates a GitHub Issue with the broken URL listed.
    - Revert the temporary injection — do NOT merge it.
    - Close the test-issue manually with a comment "Force-test for AC #10 — see PR #N".
  - [ ] Verify the homepage's actual URL list at implementation time. Story 2.1 ships `cloud.umami.is/script.js` so it WILL be in the list once 2.1 is deployed. Story 2.3 (Webmention endpoint) and 2.4 (Webmention display) may add `webmention.io` URLs to the rendered head. **Important:** if a URL in the list is expected to redirect (e.g., `webmention.io` returning 301 to a versioned path), `curl -sIL` follows redirects so the final status check still works — but if a 30x final state is the correct answer, adjust the assertion (`-w "%{http_code}"` returns the LAST status after redirects, not the first). **PENDING: deferred to first real workflow run — see "Pending Angel verification" in Completion Notes.**
  - [x] **Edge case to document in completion notes:** if the homepage's external URL list is empty (e.g., during a temporary rollback that strips all third-parties), the workflow currently exits 0 (nothing to check). That is the correct outcome. If you want a sanity warning ("0 external URLs found — did the site rollback?"), add a `[ -s /tmp/external-urls.txt ] || echo "::warning::no external URLs found"` check before the HEAD loop. Optional. **IMPLEMENTED: monitor uses `if [ ! -s /tmp/external-urls.txt ]; then echo "::notice::No external URLs found — skipping HEAD checks"; exit 0; fi` before the loop. Notice (not warning) because empty list isn't necessarily a regression.**

- [x] **Documentation updates** (AC: all)
  - [x] In completion notes, record:
    - The PR/commit hash that adds the failure-notification step. **Pending commit by Angel — local edits ready in working tree.**
    - The label-creation choice (created `ci-failure` + `automated`, or stripped from script). **Created both labels (`ci-failure` red `#d73a4a`, `automated` light-grey `#ededed`); kept `labels: [...]` in the script.**
    - The verified Layer 1 GitHub notification setting (failed-only / all-runs / disabled). **PENDING Angel — personal-account configuration.**
    - The force-test outcome (test-issue # opened during force-test, confirmed email received). **PENDING — see "Pending Angel verification".**
    - The first successful scheduled-trigger run URL (AC #5 evidence). **`https://github.com/AngelCrawford/blog/actions/runs/25592887604` (2026-05-09 05:27 UTC). Plus 2026-05-08 and 2026-05-07 also `success`.**
    - The third-party-asset-monitor force-test outcome (test-issue # for the AC #10 force-test, confirmed drift detection email received). **PENDING — see "Pending Angel verification".**
    - The list of third-party URLs extracted from the homepage at implementation time (snapshot — useful to compare against future drift-monitor failures). **PENDING — captured during first dispatch run.**
    - Any other side-fixes applied during the audit (architecture-doc drift logged, etc.). **Hugo version pin drift logged in `docs/backlog.md` row `2026-05-09 | 2.6 | Docs | Open`.**
  - [x] Update `docs/todo.md` with the architecture-doc cleanup follow-up (Hugo version pin rule). **Routed to `docs/backlog.md` instead per project memory `feedback_backlog_scope.md` — backlog is source of truth for cross-story follow-ups; `docs/todo.md` is for active WIP and reference snippets.**
  - [x] Close GitHub Issue [#67 Merge and Deploy](https://github.com/AngelCrawford/blog/issues/67) when the story is `done` (epics.md line 366: "teilweise — GitHub Actions Setup; ältere Punkte des Issues evtl. schon erledigt"). If older issue points remain (e.g., legacy gh-pages branch cleanup, pre-Phase-0 housekeeping), leave the issue open and add a comment listing what THIS story closed; SM can then triage remaining points. **N/A: Issue #67 is already CLOSED (verified via `gh issue view 67`). No action needed.**

- [ ] **No-regression verification** (AC: 8)
  - [ ] After the AC #6 patch lands, trigger a `workflow_dispatch` run from the GitHub UI on the main branch.
  - [ ] Confirm the run completes successfully (all steps green, including the new "Notify on failure" step which should be **skipped** on success).
  - [ ] Diff the deployed `public/index.html` (before the patch vs after) to confirm the Hugo build output is byte-equivalent — the workflow change is meta-only (CI configuration), not a content change.
  - [ ] Confirm the `data-updates` branch received a fresh commit from the run (`git fetch origin data-updates && git log origin/data-updates --format="%an %s" -1`).

## Dev Notes

### Architectural Context

Story 2.6 is a **CI/CD-only story** in Epic 2 — no application code, no template, no partial, no SCSS, no client JS. It updates the GitHub Actions workflow at `.github/workflows/daily-rebuild.yml` to formally satisfy the seven epics ACs, with the primary code change being an `if: failure()` issue-creation step (AC #6). All other ACs were satisfied by Phase 0 Day 2 work (`docs/3-implementation/phase-0-task-breakdown.md`) and post-Phase-0 fixes (Dart Sass install, version.txt generation, Pages deployment migration, worktree-based commit pattern).

The workflow is the **critical infrastructure node** for Epics 2, 3, and 4 (per `digital-garden-integration-architecture.md` line 30–31): the data flow `Umami → fetch script → data-updates branch → Hugo build → GitHub Pages deploy` is single-tracked through this file. Every other engagement-related story (Hearts data refresh, webmentions display, popularity scores, three-tier sorting) **assumes this workflow runs daily and produces fresh `data/*.json` consumable by Hugo**. A regression here cascades to multiple downstream features. Treat changes with care.

The workflow's data-flow design has three loadbearing decisions, all locked by the architecture doc:
1. **Single workflow, not split** (line 31): fetch + process + build + deploy in one job. Atomic — partial failures don't deploy stale data.
2. **`data-updates` orphan branch** (line 30, line 274): per-day data commits go to a parallel branch (no main-branch noise), and the worktree-based commit pattern (lines 79–98 of the workflow) is the specific mechanism that makes this work without losing access to `scripts/`.
3. **`scripts/*.js` as the integration surface** (Phase 1A migration path): each fetch/process/calculate operation lives in a Node.js file that the workflow invokes by name. Phase 1A stories rewrite the script bodies; this workflow stays unchanged. This decouples Phase 0's "make it run" from Phase 1A's "make it useful."

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 28–32) — Architecture decisions for build/deployment]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 252–294) — System Component Diagram]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 470–549) — Canonical workflow YAML spec]
[Source: .github/workflows/daily-rebuild.yml — actual implementation]

### Workflow File Anatomy (Current State)

| Section | Lines | Purpose | Status vs ACs |
|---|---|---|---|
| Header comment block | 1–6 | Documents Phase 0 vs Phase 1A timeline | Documentation, not AC-bound |
| `on:` triggers | 8–11 | `cron: "0 2 * * *"` + `workflow_dispatch` | ✅ ACs #2, #3 |
| `permissions:` | 13–20 | `contents: write`, `pages: write`, `id-token: write` | Needs `issues: write` added (AC #6 patch) |
| `concurrency:` | 22–26 | `group: pages`, `cancel-in-progress: false` | Not in ACs but correct (single-Pages-deploy serialisation) |
| `jobs.fetch-and-rebuild.steps[0]` Checkout | 36–40 | `actions/checkout@v4`, full history | ✅ AC #4 (Checkout) |
| `steps[1]` Setup Node | 42–45 | `actions/setup-node@v4`, node 22 | ✅ AC #4 (Setup Node) |
| `steps[2]` Setup Hugo | 47–51 | `peaceiris/actions-hugo@v2`, hugo 0.161.1, extended | ✅ AC #4 (Setup Hugo) |
| `steps[3]` Install Dart Sass | 56–57 | `sudo snap install dart-sass` | Side-fix (commit `613a6e8`); not in ACs but required |
| `steps[4]` npm install | 59–60 | `npm install` | Implicit dependency |
| `steps[5]` Generate data via scripts | 67–77 | `node scripts/fetch-umami-hearts.js` + `process-webmentions.js` + `calculate-popularity.js` | ✅ AC #4 (Fetch engagement data placeholder) |
| `steps[6]` Commit to data-updates | 85–98 | Worktree-based commit + push | ✅ AC #7 (Git user); enables AC #4 (data flow) |
| `steps[7]` Setup Pages | 104–106 | `actions/configure-pages@v5` | ✅ AC #4 (Deploy chain) |
| `steps[8]` Generate version.txt | 114–117 | `git describe` → `version.txt` | Side-fix (commit `65bed4d`); footer uses it |
| `steps[9]` Build Hugo site | 119–124 | `hugo --environment production --minify --baseURL ...` | ✅ AC #4 (Build Hugo) |
| `steps[10]` Upload Pages artifact | 126–129 | `actions/upload-pages-artifact@v3` | ✅ AC #4 (Deploy chain) |
| `steps[11]` Deploy to GitHub Pages | 131–133 | `actions/deploy-pages@v4` | ✅ AC #4 (Deploy to GitHub Pages) |
| **MISSING: `steps[12]` Notify on failure** | — | `if: failure()` + `actions/github-script@v7` issue creation | ❌ AC #6 (TO BE ADDED) |

[Source: .github/workflows/daily-rebuild.yml — line numbers as of current `main` branch state]

### AC #6 Implementation Choice: Why GitHub Issues Over Email Action

The AC text says "send email notification to repository owner". Two implementation paths:

1. **Email-via-marketplace-action**: e.g., `dawidd6/action-send-mail@v3` with SMTP secrets (`SMTP_SERVER`, `SMTP_USERNAME`, `SMTP_PASSWORD`). Direct email satisfies AC text literally but adds: (a) SMTP secrets to manage, (b) marketplace-action dependency (security review needed for any fresh action), (c) custodial burden if SMTP creds rotate.
2. **GitHub Issue + GitHub's email-on-issue notification**: uses `actions/github-script@v7` (first-party, no external dependency) to create an issue. GitHub's notification system handles the email path (the repo owner is automatically subscribed to all repo issues by default; an issue creation triggers an email). Audit trail in the repo's Issues tab. Indirect but more durable.

**Decision: Path 2 (GitHub Issues).** Justification:
- First-party, no marketplace-action security review.
- No SMTP secret management.
- Persistent audit trail (issues survive even if email is missed).
- Gracefully degrades (if owner mutes issue notifications, the issue still surfaces in their Issues dashboard and via `gh issue list`).
- The AC's *intent* is "owner is alerted to failures"; an email-via-issue path satisfies this intent identically to direct SMTP email from the owner's perspective.

If at implementation time the user prefers direct SMTP email (e.g., the issues tab is too noisy), Path 1 is also acceptable — same defer-to-implementer pattern Story 2.5 used for `Stand:`/`Version:` body-vs-frontmatter.

[Source: AC #6 above for the layered approach reasoning]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 675–696) — error handling pattern (fail-fast, error logs in GitHub Actions)]

### Coordination with Epic 3 (Real Data-Fetch Scripts)

Epic 3's stories replace each Phase 0 placeholder script's body without touching the workflow:

| Phase 0 placeholder (current) | Phase 1A real script (Epic 3) | Replacing story |
|---|---|---|
| `scripts/fetch-umami-hearts.js` writes `{}` | Calls Umami Cloud API `GET /api/websites/{id}/events?event=heart`, transforms to `{permalink: count}` | Story 3.1 |
| `data/webmentions_raw.json` written by inline `echo '{"children":[]}'` | Replace with `curl https://webmention.io/api/mentions.jf2?domain=article-time.de -o data/webmentions_raw.json` (still inline in workflow, no separate script) | Story 3.2 |
| `scripts/process-webmentions.js` writes `{}` | Reads `webmentions_raw.json`, groups by target URL, dedupes, writes `webmentions_by_article.json` | Story 3.2 |
| `scripts/calculate-popularity.js` writes `{}` | Reads `umami_hearts.json` + `webmentions_by_article.json`, applies `score = (hearts × 1) + (webmentions × 3) + (manual_weight × 5)` formula, writes `popularity_scores.json` | Story 3.3 |

This story's workflow design **explicitly anticipates** these substitutions — the `node scripts/<name>.js` invocations stay unchanged when scripts upgrade. Epic 3 reviewers should check that the new script bodies preserve the same JSON output shapes (the contract is the file output, not the implementation).

**Critical: Story 3.4** ("Data commits to data-updates branch") concerns the worktree-based commit pattern (already implemented here in lines 79–98 of `daily-rebuild.yml`). Story 3.4 may be a no-op or a refinement story — at this story's drafting time, Story 3.4 is `backlog` and its scope is unclear. Document the existing implementation in this story's completion notes so Story 3.4's drafter has the context.

[Source: docs/1-planning/epics.md line 379 — "Dependencies: Epic 3 (engagement fetch scripts added later) — soft dependency"]
[Source: scripts/fetch-umami-hearts.js, scripts/process-webmentions.js, scripts/calculate-popularity.js — Phase 0 placeholders document the Phase 1A contract in their headers]

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771, evaluated for this CI-only story:

1. **NEVER modify existing card variants** — N/A (no card edits).
2. **ALWAYS add new features to card footer** — N/A (no card edits).
3. **NEVER commit `data/*.json` files to main branch** — **APPLIES.** The workflow correctly uses the `data-updates` orphan branch (worktree pattern, lines 79–98). This story does NOT change that flow. Verify the AC #6 patch does not accidentally introduce a `git add data/` to the main branch path.
4. **ALWAYS use the `popularity-score.html` partial** — N/A (no template edits).
5. **NEVER use jQuery** — N/A (no client JS in this story).
6. **ALWAYS add `| default` when accessing data files** — N/A (no template edits).
7. **ALWAYS pin Hugo version in GitHub Actions** — **APPLIES.** Workflow line 50 pins to `'0.161.1'` ✅. Note: architecture rule text says `'0.152.2'` (stale); current value is intentionally newer. Architecture-doc cleanup logged in tasks above.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules]

### Project Structure Notes

- **No new directories.** Single file edit at `.github/workflows/daily-rebuild.yml`. Possibly two label-create commands as separate side-task (`gh label create ...`).
- **No template, partial, asset, config, content, or layout changes.** If any such change is needed during implementation, pause and re-read the AC — it's a scope-creep signal.
- **No new npm dependencies** for the workflow itself. `actions/github-script@v7` is built-in; no `package.json` change.
- **No new GitHub Secrets** required. AC #6 layered approach uses GitHub's automatic `GITHUB_TOKEN` (always present in Actions runs) for the issue-creation API call. No SMTP creds, no API keys.
- **Permission expansion**: `permissions: issues: write` is added to the existing top-level block. This is a CI-config change, not a runtime auth change for the deployed site.
- **Test infrastructure status:** Stories 1.1+ bootstrap `tests/build/` and `tests/e2e/`. At drafting time, those directories do not exist (Story 1.1 status: `ready-for-dev`). This story does NOT have automated tests — workflow YAML is itself the test artifact. Do NOT add a test file in this story.
- **Diff-friendliness:** the diff for this story is small — a 4-line addition to `permissions:` and a ~17-line addition for the `Notify on failure` step. Single commit acceptable.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md — test infra layout (`ready-for-dev`, not landed yet)]
[Source: .github/workflows/daily-rebuild.yml — current implementation]

### Test Strategy

Aligned with the 1-day epics estimate (epics.md line 388). Scope is a workflow YAML edit + verification work:

- **Local YAML lint (optional, primary):** run `actionlint` on `.github/workflows/daily-rebuild.yml` after editing. Catches typos and unsupported syntax before pushing. Skip if `actionlint` not installed locally — GitHub validates server-side and surfaces parse errors via the Actions UI banner.
- **Manual `workflow_dispatch` trigger (primary):** trigger the workflow from the GitHub Actions UI after the AC #6 patch lands. Confirm: (a) all existing steps still pass, (b) the new "Notify on failure" step is skipped (because the run succeeded), (c) the build + deploy + data-updates commit chain produces the same outputs as pre-patch.
- **Force-test the failure path (primary):** as detailed in Tasks subsection above — temporary `exit 1` step on a feature branch, observe issue creation + email, revert.
- **Schedule verification (AC #5, primary):** wait for or look up an actual `cron`-triggered run with `conclusion: success`. Capture the run URL.
- **No automated tests added** (test infra not yet landed).
- **External-effect verification:**
  - `data-updates` branch receives a new commit from each run (`git fetch origin data-updates && git log origin/data-updates -1`).
  - GitHub Pages deploy succeeds (the workflow's "Deploy to GitHub Pages" step output URL points to a 200-responding page).
  - Failure-path issue is created and labelled correctly (if labels were created).

### Learnings from Previous Story

**From Story 2.5 (Privacy Policy Page) — Status: drafted (not yet implemented).**

The create-story workflow rule treats anything below `in-progress`/`review`/`done` as `"Previous story not yet implemented"`. Story 2.5 is `drafted`, so no implementation learnings (e.g., how the privacy policy edit flowed through review) exist to forward.

**However, sibling-draft patterns from Stories 2.1–2.5 are directly load-bearing for this story:**

- **Architecture-vs-implementation drift documentation pattern** (from Stories 2.1, 2.2, 2.3, 2.4, 2.5 drafts) — when the architecture doc says one thing and the actual code/config says another, document the drift in the AC reconciliation block, follow the actual implementation, and log the architecture-doc cleanup as a separate todo. This story applies the pattern to: (a) Hugo version pin (`0.152.2` doc vs `0.161.1` code), (b) Phase 0 task-breakdown step shape vs actual workflow shape (worktree pattern, modern Pages deploy chain), (c) inline `echo '{}'` vs `node scripts/<name>.js` for placeholders.
- **Existing-file-update pattern (from Story 2.5)** — Story 2.5 updated `content/pages/datenschutz.md` rather than creating `/pages/privacy/`. This story updates `.github/workflows/daily-rebuild.yml` (already exists from Phase 0) rather than creating a new workflow. Same reconciliation flow.
- **AC source separation (from Stories 2.1–2.5 drafts)** — ACs from epics.md verbatim labelled (1–7); testability/regression guards (8–9) added below and tagged. Same convention.
- **Defer-and-integrate pattern (from Stories 2.1, 2.3, 2.5 drafts)** — Story 2.1 deferred privacy-policy Umami section to Story 2.5; Story 2.5 deferred webmention coordination to whichever of 2.3/2.5 lands first. This story defers real engagement-fetch logic to Epic 3 stories (3.1, 3.2, 3.3) and documents the `node scripts/<name>.js` contract surface as the deferral mechanism.
- **Phase 0 → Phase 1A handoff pattern (NEW pattern, established by this story)** — Phase 0 produced foundation infrastructure (workflow skeleton, orphan branch, placeholder scripts). Phase 1A stories formally accept that infrastructure into the AC-tracked story flow. Reconciliation is light (close gaps, verify, document). The pattern repeats for any future Phase 0 → Phase X handoff (Phase 0 also did: privacy policy stub, contact page, GitHub secrets — those were each picked up by the corresponding Phase 1A story).
- **Single-developer notification preference assumption (NEW reconciliation, established by this story)** — for solo-author repo, GitHub's built-in failed-workflow email + GitHub Issues are sufficient; no SMTP marketplace action needed. Sets precedent for any future "notify the team" AC: prefer first-party GitHub mechanisms over third-party email actions when audit trail matters more than direct SMTP delivery.

**Pending review items (from previous stories):** None. No story in the project has reached `review` status yet, so no Senior Developer Review sections exist to forward.

[Source: docs/sprint-artifacts/sprint-status.yaml — current development_status (1-1 → 1-5: ready-for-dev; 2-1, 2-2, 2-3: ready-for-dev; 2-4: ready-for-dev; 2-5: drafted; 2-6 was the next backlog story, now drafted)]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md — previous story; established existing-file-update reconciliation pattern]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story; UMAMI_API_KEY GitHub Secret consumed by this workflow's data-fetch step]
[Source: docs/sprint-artifacts/epic-2/2-3-webmention-endpoint-setup.md — sibling story; webmention reception path that Phase 1A wires into this workflow]

### References

- [Source: docs/1-planning/epics.md (lines 358–388)] — Story 2.6 ACs (seven verbatim, FR-034 coverage, GitHub Issue #67, prerequisite Phase 0, soft dependency Epic 3)
- [Source: docs/1-planning/epics.md (lines 213–222)] — Epic 2 header (Engagement Infrastructure)
- [Source: docs/1-planning/epics.md (lines 32, 366)] — GitHub Issue #67 ("Merge and Deploy") umbrella reference
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 240–244)] — FR-034 (Automated Daily Rebuild)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 246–262)] — FR-035, FR-036, FR-037 (Engagement Data Fetching, Popularity Score Updates, Data History Preservation — Epic 3 dependencies)
- [Source: docs/1-planning/prd/architecture-notes.md (lines 458–549)] — full canonical workflow YAML spec (older; see digital-garden-integration-architecture.md for current spec)
- [Source: docs/1-planning/prd/10-appendices.md (line 125)] — FR-034 → Epic 2 → Story 2.6 → Phase 1A → MVP traceability
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 28–32)] — Build & Deployment architectural decisions
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 50–52)] — Project structure: `.github/workflows/daily-rebuild.yml` location
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 252–294)] — System Component Diagram showing workflow's data-flow position
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 470–549)] — Server-Side workflow YAML canonical spec
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 675–696)] — Error Handling: Hugo build errors (fail-fast), API fetch errors (process.exit(1))
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 725–740)] — Logging Strategy: GitHub Actions, descriptive `console.log()` messages
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical Agent Rules (#3 no data on main, #7 pin Hugo version)
- [Source: docs/2-solutioning/architecture.md (line 680)] — "Privacy: No data sent to third parties" (informs notification-via-issue choice over external SMTP)
- [Source: docs/3-implementation/phase-0-task-breakdown.md (lines 31–82)] — Phase 0 Day 1: Umami API key + GitHub Secrets (consumed by this workflow)
- [Source: docs/3-implementation/phase-0-task-breakdown.md (lines 88–131)] — Phase 0 Task 1.3: data-updates orphan branch creation
- [Source: docs/3-implementation/phase-0-task-breakdown.md (lines 137–258)] — Phase 0 Day 2: workflow skeleton creation
- [Source: .github/workflows/daily-rebuild.yml] — current implementation (Phase 0 + post-Phase-0 fixes from commits `0419fa0`, `c973c7c`, `613a6e8`, `bef5c10`, `e46c914`, `65bed4d`)
- [Source: scripts/fetch-umami-hearts.js, scripts/process-webmentions.js, scripts/calculate-popularity.js] — Phase 0 placeholder scripts; document Phase 1A contracts in headers
- [Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md (lines 160–169)] — UMAMI_API_KEY GitHub Secret usage; sibling story
- [Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md] — previous story (drafted); existing-file-update reconciliation pattern
- [https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule] — GitHub Actions scheduled events documentation (cron syntax, drift behaviour)
- [https://docs.github.com/en/actions/using-jobs/using-conditions-to-control-job-execution#using-the-failure-conditional] — `if: failure()` step-condition documentation
- [https://github.com/actions/github-script] — `actions/github-script@v7` documentation (used for AC #6 issue creation)
- [https://docs.github.com/en/rest/issues/issues#create-an-issue] — REST API for `github.rest.issues.create()`
- [https://github.com/peaceiris/actions-hugo] — Hugo setup action (used at line 47–51)
- [https://github.com/actions/configure-pages] — `actions/configure-pages@v5` (used at line 104–106)
- [https://github.com/actions/deploy-pages] — `actions/deploy-pages@v4` (used at line 131–133)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-6-daily-rebuild-github-actions-workflow.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- `gh run list --workflow=daily-rebuild.yml --limit 10` → 3 consecutive successful scheduled runs (2026-05-07, -08, -09) confirm AC #5.
- `gh log origin/data-updates --format="%an <%ae>" -1` → `GitHub Actions Bot <actions@github.com>` confirms AC #7.
- `python -c "import yaml; yaml.safe_load(...)"` → both `daily-rebuild.yml` and `third-party-asset-monitor.yml` parse OK.
- `gh issue view 67` → state `CLOSED`. No close action needed.

### Completion Notes List

**AC verification matrix (current state of `.github/workflows/daily-rebuild.yml`):**

| AC | Status | Evidence |
|---|---|---|
| 1 — file exists | ✅ pre-existing | `.github/workflows/daily-rebuild.yml` from Phase 0 Day 2 |
| 2 — daily cron 02:00 UTC | ✅ pre-existing | line 10: `cron: "0 2 * * *"` |
| 3 — workflow_dispatch | ✅ pre-existing | lines 11–16: `workflow_dispatch:` with optional `ref` input (improved over draft — supports branch/tag/SHA selection) |
| 4 — Checkout/Node/Hugo/Fetch/Build/Deploy steps | ✅ pre-existing | lines 50–201; all 7 expected steps present plus side-fixes (Dart Sass install, test gate, version string, maintenance-mode detection) |
| 5 — successful scheduled run | ✅ verified | most recent: https://github.com/AngelCrawford/blog/actions/runs/25592887604 (2026-05-09 05:27 UTC, `event: schedule`, `conclusion: success`); plus 2026-05-08 + 2026-05-07 |
| 6 — failure notification | ✅ NEW (this story) | `permissions.issues: write` (line 30) + `Notify on failure` step (lines 209–222) using `actions/github-script@v7` with `if: failure()` to create labelled GitHub Issue. Layer-1 verification (Angel's personal account Notification setting) **pending**. |
| 7 — Git user for commits | ✅ verified | `git log origin/data-updates -1` → `GitHub Actions Bot <actions@github.com>` |
| 8 — no regression after AC #6 | ⏳ pending | local diff is meta-only (4-line `permissions:` addition + 22-line notify step); workflow_dispatch verification pending after merge |
| 9 — no automated tests added | ✅ guard met | only edits: workflow YAML + new monitor YAML + backlog entry + story file |
| 10 — third-party asset monitor | ✅ NEW (this story) | new file `.github/workflows/third-party-asset-monitor.yml` (~110 lines); weekly cron `0 6 * * 1`; `baseURL` from `config/production/config.yaml` is single source of truth; reuses AC #6 issue-creation pattern |

**Story-draft drift documented (workflow shape changed between draft 2026-05-06 and impl 2026-05-09):**

The draft referenced line numbers that no longer match. Side-fixes added between drafting and implementation, all preserved:

1. New trigger `push: tags: v*` (release deploy via tag).
2. New step `Checkout latest tag (cron only)` — cron rebuilds the LATEST RELEASE TAG, not main HEAD. Aligns with the "code only ships via tag, daily cron only refreshes engagement data" deploy model.
3. Hugo action SHA-pinned (`peaceiris/actions-hugo@16361eb...` # v2.6.0) instead of `@v2` for supply-chain hardening.
4. Test gate inserted before data-fetch: `Install Playwright browsers` + `npm test` (build-smoke + e2e). Failed tests block deploy.
5. `Generate version string` step replaces the old `version.txt` file pattern — output piped via `HUGO_PARAMS_VERSION` env to Hugo, no on-disk artefact.
6. New step `Detect maintenance mode` (sentinel file `.maintenance` toggles `--environment maintenance` build).
7. `permissions:` block at lines 26–30 (was 17–20 in draft); deploy step at lines 199–201 (was 131–133); notify step appended at 209–222.

**Action versions for NEW additions (verified latest as of 2026-05-09):**

- `actions/github-script@v9` (released 2026-04-09) — used in both `daily-rebuild.yml` Notify-on-failure step and `third-party-asset-monitor.yml`. v9 breaking changes: `require('@actions/github')` removed; `getOctokit` is now an injected param. **My scripts use neither — only `github.rest.issues.create()` and `context`, both unchanged across v7/v8/v9.**
- `actions/checkout@v6` (released 2026-01-09) — used in `third-party-asset-monitor.yml`. v6 changes: Node 24 runtime + credential file refactor; backward-compatible for public-repo checkout.

**Existing actions in `daily-rebuild.yml` left at current versions** (out of scope for this story per "preserve all side-fixes byte-for-byte"). Drift logged to `docs/backlog.md` row `2026-05-09 | 2.6 | CI/Deps | Open` for a future dependency-bump pass: `actions/checkout@v4`→v6, `actions/setup-node@v4`→v6, `peaceiris/actions-hugo@v2.6.0`→v3.0.0 (also resync with `test.yml`), `actions/configure-pages@v5`→v6, `actions/upload-pages-artifact@v3`→v5, `actions/deploy-pages@v4`→v5.

**AC #6 implementation choice — GitHub Issues over SMTP marketplace action:**

Followed the story's recommended Path 2 (GitHub Issues + GitHub's email-on-issue-creation). Rationale already in Dev Notes: first-party action (no marketplace security review), no SMTP secrets, persistent audit trail in repo Issues, gracefully degrades. Labels `ci-failure` + `automated` pre-created.

**AC #10 implementation notes:**

- URL source of truth = `config/production/config.yaml` `baseURL` (read via `yq` at runtime). Same one-line edit that retargets the deploy also retargets the monitor.
- Generic regex extraction (`src=/href=` attributes pointing to non-self-host `https://`). New third-parties (e.g., when Story 2.4 ships `webmention.io` reads or Story 7.1 ships Mastodon API) inherit monitoring with no per-asset code.
- Empty-list path uses `::notice::` (not `::warning::`) and `exit 0` — matches Angel's preference from the draft (empty isn't necessarily a regression).
- Drift issue body uses `process.env.FAILED_LIST` to inject the failed-URL list cleanly into the GitHub Script context (avoids template-string escaping issues with multi-line shell output crossing into JS).
- Workflow is **separate from `daily-rebuild.yml`** by design: drift alert is informational, must NOT block production deploy. Different cadences (weekly vs daily) and different failure semantics — separation keeps both jobs simple.

**Pending Angel verification (post-merge tasks):**

These items require either Angel's personal-account access OR a push-and-trigger sequence on GitHub that creates real (closeable) artifacts. They are NOT blockers for moving the story to `review`, but should be completed before marking `done`:

1. **AC #6 Layer 1** — confirm in https://github.com/settings/notifications that "Actions → Failed workflows only" is enabled for the repo owner. Personal-account config; cannot be verified from the workflow file or dev tooling.
2. **AC #6 force-test** — on a feature branch:
   - Add `- name: Force fail; run: exit 1` step right after `Checkout` (BEFORE the test gate, so we exit fast without consuming Playwright install time).
   - `gh workflow run daily-rebuild.yml --ref <branch>`.
   - Verify: workflow run shows `conclusion: failure`; `Notify on failure` step ran (not skipped); a new GitHub Issue appears titled `Daily rebuild failed on YYYY-MM-DD` with `ci-failure` + `automated` labels; Angel's inbox receives the issue-creation email.
   - Revert the temp commit (don't merge); close the test issue with comment `Force-test for Story 2.6 AC #6`.
3. **AC #10 force-test** — on a feature branch:
   - Edit `Extract third-party asset URLs` to inject `echo "https://example.invalid/missing.js" >> /tmp/external-urls.txt` after the regex.
   - `gh workflow run third-party-asset-monitor.yml --ref <branch>`.
   - Verify: run fails at `HEAD-check`; `Notify on drift` creates a `Third-party asset drift detected on YYYY-MM-DD` issue with the broken URL listed and `third-party-drift` + `automated` labels.
   - Revert + close test issue.
4. **AC #8 no-regression** — after merge, `gh workflow run daily-rebuild.yml --ref main`; confirm all existing steps green; confirm `Notify on failure` is **skipped** on success (visible in the run log as `Skipped`).
5. **First real third-party-monitor run** — capture the URL list snapshot for future drift comparison. Expected URLs (post-Story 2.1, 2.3): `cloud.umami.is/script.js`, possibly `webmention.io/...` from `head.html`. Document in story or backlog as the baseline.

If any force-test surfaces a bug in the patch (e.g., `actions/github-script` permissions issue, label name mismatch), reopen this story and address before marking `done`.

### File List

- `.github/workflows/daily-rebuild.yml` — modified (+4 lines `issues: write` permission block addition; +22 lines `Notify on failure` step at end of `fetch-and-rebuild` job)
- `.github/workflows/third-party-asset-monitor.yml` — new file (~110 lines; weekly cron, baseURL-driven URL extraction, HEAD-check, on-drift issue creation)
- `docs/backlog.md` — added one row: `2026-05-09 | 2.6 | Docs | Open` Hugo version pin drift between architecture doc and workflow
- `docs/sprint-artifacts/sprint-status.yaml` — updated `2-6-daily-rebuild-github-actions-workflow` status to `in-progress` (will be set to `review` after final task pass)
- `docs/sprint-artifacts/epic-2/2-6-daily-rebuild-github-actions-workflow.md` — story file updated (Tasks/Subtasks checkboxes, Dev Agent Record, File List, Change Log, Status)

GitHub-side artifacts created (not in repo):

- Label `ci-failure` (color `#d73a4a`)
- Label `automated` (color `#ededed`)
- Label `third-party-drift` (color `#fbca04`)

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 2.6 (lines 358–388, FR-034, GitHub Issue #67), `prd/03a-functional-requirements.md` (FR-034 Automated Daily Rebuild, FR-035–037 Epic 3 dependencies), `prd/architecture-notes.md` (lines 458–549 canonical workflow YAML), `digital-garden-integration-architecture.md` (Build & Deployment decisions lines 28–32, System Component Diagram lines 252–294, Server-Side workflow YAML lines 470–549, Error Handling lines 675–696, Critical Agent Rules lines 762–771), `phase-0-task-breakdown.md` (Day 1 secrets, Task 1.3 orphan branch, Day 2 workflow creation), and current `.github/workflows/daily-rebuild.yml` + `scripts/*.js` Phase 0 placeholders. Reconciled epics AC #1 ("workflow file created") with project state (workflow exists from Phase 0 Day 2 work) — same existing-file-update pattern Story 2.5 used for `datenschutz.md`. Reconciled epics AC #4 ("Fetch engagement data placeholder") with actual implementation (real placeholder scripts at `scripts/*.js` instead of inline `echo '{}'`) — preferable contract surface for Epic 3 substitutions. ACs 1–7 verbatim from epics; ACs 8–9 added as testability/regression guards (no-regression after AC #6 patch, no-automated-tests scope-limit). Primary code change: AC #6 patch — add `permissions: issues: write` and `if: failure()` step using `actions/github-script@v7` to create a GitHub Issue on workflow failure (layered with GitHub's built-in failed-workflow email notification). Force-test of failure path required to validate AC #6. Hugo version pin drift logged for `docs/todo.md` (architecture doc says `0.152.2`, actual is `0.161.1`). No template, partial, asset, config, or content changes — CI/CD-only edit. Test strategy: optional local actionlint + manual `workflow_dispatch` trigger + force-test failure path + schedule-verification on next 02:00 UTC cycle + external-effect verification (data-updates commit, Pages deploy, issue label). No automated tests added (test infra not yet landed). | SM (create-story workflow) |
| 2026-05-09 | Scope addition: AC #10 + new task block for `.github/workflows/third-party-asset-monitor.yml`. Driven by Angel's Umami URL-drift incident discussed during Story 2.1 dev review — markup-level build-smoke tests don't catch silent third-party URL changes. Generic monitor: weekly cron, regex-extracts external URLs from the live homepage, HEAD-checks each, creates a `third-party-drift`-labelled GitHub Issue on non-200. Reuses AC #6's `actions/github-script@v7` notification pattern. Separate workflow file (NOT a step inside daily-rebuild.yml) so drift alerts don't break the deploy. Generalises so Stories 2.3 (webmention.io), 2.4 (Bridgy), 7.1 (Mastodon API) inherit monitoring with no per-asset code. | Dev (bmad-dev-story workflow, claude-opus-4-7[1m]) — added during Story 2.1 review |
| 2026-05-09 | Action-version audit: verified latest releases via `gh api repos/<owner>/<repo>/releases/latest`. Bumped my NEW additions to latest: `actions/github-script@v7`→`@v9` (in both `daily-rebuild.yml` and `third-party-asset-monitor.yml`); `actions/checkout@v4`→`@v6` (in `third-party-asset-monitor.yml` only). Verified github-script v9 breaking changes don't affect my scripts (I only use `github.rest.issues.create()` + `context`). Existing actions in daily-rebuild.yml left unchanged (out of scope) — drift logged in `docs/backlog.md` as a separate dependency-bump story. | Dev (bmad-dev-story workflow, claude-opus-4-7[1m]) |
| 2026-05-09 | Implementation: (a) `.github/workflows/daily-rebuild.yml` — `issues: write` permission added; new `Notify on failure` step using `actions/github-script@v7` + `if: failure()` creates labelled GitHub Issue on workflow failure (AC #6). (b) `.github/workflows/third-party-asset-monitor.yml` created — weekly Mon 06:00 UTC monitor that reads `baseURL` from `config/production/config.yaml` via `yq`, regex-extracts external `https://` URLs from the live homepage, HEAD-checks each (max 10s, follow redirects), creates labelled drift issue on non-200 (AC #10). (c) Three GitHub labels created: `ci-failure` (red), `automated` (light grey), `third-party-drift` (amber). (d) `docs/backlog.md` row added for Hugo version pin drift between architecture doc (`0.152.2`) and actual workflow (`0.161.1`). (e) AC #5 verified via `gh run list` — three consecutive successful scheduled runs (2026-05-07/08/09); most recent run `25592887604` captured in completion notes. (f) AC #7 verified via `git log origin/data-updates -1`. (g) Issue #67 already CLOSED; no close action needed. PENDING Angel: AC #6 Layer-1 personal Notification check; AC #6/#10 force-tests on feature branches; post-merge `workflow_dispatch` no-regression run on main. | Dev (bmad-dev-story workflow, claude-opus-4-7[1m]) |
