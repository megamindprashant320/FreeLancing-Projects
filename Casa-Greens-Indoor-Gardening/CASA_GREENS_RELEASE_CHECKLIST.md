# Casa Greens Release Checklist

Updated: 2026-11-24 (Asia/Kolkata). Latest implementation and final executed evidence take precedence over historical audit snapshots.

**Code/Git: READY FOR COMMIT REVIEW, with documented lab-performance variability.**

**Production: NO-GO until the account-dependent and essential live checks below pass.**

Exact steps for every owner action are in [CASA_GREENS_OWNER_SETUP_GUIDE.md](CASA_GREENS_OWNER_SETUP_GUIDE.md). Current endpoint integration and fresh regression results are in `CASA_GREENS_FINAL_INTEGRATION_REPORT.md` in the original workspace. Previous performance measurements and fixes remain recorded in the historical `CASA_GREENS_FINAL_AUDIT.md`. Neither document authorizes release actions.

## Completed local candidate checks

- [x] Correct repository, review branch and audited HEAD verified; remote main remained unchanged.
- [x] No source deletion, no staged files, no conflict markers, no reset/clean/merge, no commit/push/deployment/workflow dispatch.
- [x] Original assets and hero MP4 preserved byte-for-byte; unrelated repository files protected with SHA-256 checks.
- [x] All approved code and required setup/checklist documentation synchronized only inside `Casa-Greens-Indoor-Gardening/`; no temporary artifacts or credentials copied.
- [x] Six-page architecture, navbar, mobile menu, keyboard operation, responsive grids and enquiry navigation preserved.
- [x] WebKit pointer-induced menu closure fixed and navigation retested across all six pages in all four engines.
- [x] Google Sheets primary bridge, strict pending-request confirmation, validation, UUID/idempotency, loading/failure/timeout handling and explicit email fallback implemented.
- [x] Owner-approved public `/exec` endpoint configured in both local candidates; Send Enquiry and Prepare Email Draft are enabled by the existing script. Empty-endpoint behavior remains covered in isolated regression fixtures. No private spreadsheet ID, recipient or credential invented.
- [x] Four-engine mocked success/failure/retry/fallback checks passed; backend VM/shim tests include formula injection, locks, duplicate requests, limits and sanitized warning categories.
- [x] Email subject/body encoding, body-only customer values, empty recipient, explicit activation, retained values and duplicate-risk guidance verified. No live email sent.
- [x] Authoritative production base established from deployment status, workflow mapping and read-only live GETs.
- [x] Six unique canonical URLs, absolute Open Graph/Twitter metadata, existing concept sharing image, valid JSON-LD and six-entry sitemap implemented and locally checked.
- [x] Original concept/stock and demonstration disclosures retained; no fabricated inventory, client work, ratings, prices or business details.
- [x] Filter controls/counts reserve their real initial layout; obsolete hiding CSS removed. Mobile/desktop startup geometry checks passed.
- [x] Chrome, Edge, Firefox and WebKit tested at 320, 375, 390, 768, 1024, 1280, 1440 and 1920px. Headless engine coverage is not physical-device certification.
- [x] Forty-eight fresh automated axe scans and semantic/keyboard checks completed with no reported violations; image-dependent contrast remains a manual qualification.
- [x] Four representative screenshots visually inspected; primary flat color pairs and large-text contrast checked. No full WCAG certification claimed.
- [x] Repeated mobile Lighthouse measurements completed under comparable settings. All ten final score-budget runs met Performance 90 / other categories 95 targets.

## Final integration regression (2026-11-24)

- [x] Final synchronized candidate: **419 named case bundles: 416 passed, 0 failed, 2 blocked, 1 skipped**. Totals count final unique bundles; discovery/reruns are retained separately.
- [x] Six pages at all eight widths in Chrome, Edge, Firefox and WebKit; navigation, media, filters, enquiries, local assets and 48 axe scans passed. WebKit failed-media behavior was verified using an actual HTTP 503.
- [x] Forty mocked Google-response bundles, 28 email-fallback bundles and 30 backend VM/shim bundles passed. These are simulated storage, not real Google Sheets evidence.
- [x] Initial Firefox fixture setup timeouts were retested successfully in isolation on unchanged production code; their precise timing cause is unproven. No test was marked passed without execution.
- [ ] Blocked: real storage/exact-one-row retry and published-candidate acceptance. Skipped: physical-device/interactive assistive-technology access. No live enquiry submission or email delivery was performed.

## Measured performance qualification

- [x] Projects CLS measured 0 after the startup fix in all three final runs; both baseline Projects runs measured approximately 0.038845.
- [ ] LCP at or below 2500ms in **every** repeated run: Services run 2 was **2661ms** and Projects run 3 was **2709ms**. Other final runs met that target. These two lab-budget misses remain visible; repeat stable-host/production tracing rather than treating the best score as a guarantee.
- [ ] Real-user Core Web Vitals/INP verified when enough field data exists. Lab TBT and automated click tests are not field INP.

## Owner-reported configuration and independently checked connection

- [x] **Owner-reported:** private Sheet and Script Properties configured; private property values were not accessed or independently verified.
- [x] **Owner-reported:** Apps Script authorized and web app deployed; no redeployment performed here.
- [x] **Independently checked:** approved endpoint GET returned HTTP 200 with HTML-service wrapper and no sign-in redirect.
- [x] **Independently checked:** signed-out Chrome, Edge, Firefox and WebKit received a trusted, channel-matched ready message under the authorized origin in a read-only fixture. No enquiry payload or storage method was invoked. This is not candidate publication or storage verification.

## Requires owner configuration/authorization

- [ ] Approve restricted access, retention/deletion, backups/log access, public privacy wording and incident/quota monitoring responsibilities.
- [ ] Review public-endpoint abuse risk; origin checks are not authentication and cache-based limits do not stop determined abuse.
- [ ] Confirm rights/approval for original business-supplied concept imagery and retained stock attribution. Genuine completed-project/before-after assets remain a future optional content task; no fabricated results are published.
- [ ] If a verified business email is later supplied, separately approve its use; none is invented now. The current draft intentionally requires manual recipient selection.
- [ ] Review the exact scoped Git diff, including inherited LF/CRLF behavior before staging. Historical reports already present in the clone are not runtime requirements; do not stage them indiscriminately.
- [ ] Obtain separate permission for commit, push, merge or deployment. A push to main invokes a shared multi-site Pages workflow. No shared workflow modification is included.

## Requires production/live verification

- [ ] Controlled real enquiry stored with its exact confirmation ID and all nine columns/Status New verified.
- [ ] Lost-response/unchanged-retry test produces the same confirmation and exactly **one** sheet row. Do not infer storage from an opaque request or mock.
- [ ] Real submission/result communication under intended browser privacy/content-blocking settings verified on an authorized candidate host. Default signed-out ready handshakes passed; real write/result and stricter privacy modes remain unverified.
- [ ] Owner confirms the deployed backend revision matches the reviewed `google-apps-script/Code.gs`; local VM checks do not prove deployed code identity.
- [ ] Newly released candidate, not the currently published older code, verified on all six production URLs and nested paths after separately authorized deployment.
- [ ] Published canonical, sitemap, JSON-LD and social image/page metadata verified; preview caches refreshed where appropriate.
- [ ] Actual HTTP security/cache/compression behavior reviewed. Root robots is outside this project's subpath; its current 404 does not block crawling. Root policy changes, if wanted, require separate owner-controlled hosting scope; direct sitemap submission is available.
- [ ] Real desktop/mobile email-client draft handling verified, including no-handler and long-message limitations; never label draft preparation as delivery.
- [ ] Physical mobile and assistive-technology reading/contrast checks completed. Windows WebKit automation is not Safari/iOS hardware testing.

## Decision gate

Local code is reviewable and no known local functional failure remains in the final executed cases. Two explicit lab LCP targets were missed in the 2026-11-23 audit; they were not remeasured for this endpoint-only update. External production checks remain open. Production stays **NO-GO** until real Sheets storage/retry, owner data-handling decisions and essential candidate deployment verification are complete. No release action is authorized or executed by this checklist.
