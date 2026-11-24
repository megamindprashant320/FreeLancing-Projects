# Casa Greens Owner Setup Guide

Updated: 2026-11-24 (Asia/Kolkata). This is the single configuration and live-verification guide. No commit, push, merge, deployment or workflow run is authorized by this document. Do not paste credentials, private spreadsheet identifiers or customer data into chat, repository files, issues or audit reports.

## 1. Confirmed hosting destination

Production base: **https://megamindprashant320.github.io/FreeLancing-Projects/Casa-Greens-Indoor-Gardening/**

Evidence: the successful repository deployment [status](https://api.github.com/repos/megamindprashant320/FreeLancing-Projects/deployments/7460601401/statuses) records `https://megamindprashant320.github.io/FreeLancing-Projects/`; the existing workflow copies this project to `Casa-Greens-Indoor-Gardening/`. All six currently published page URLs and the selected sharing image returned HTTP 200 during read-only verification. Those responses serve the older published code, not this local candidate. The authenticated Pages-settings endpoint was unavailable; the URL was established from authoritative deployment evidence and verified responses instead.

Canonical URLs, Open Graph page/image URLs, Twitter image metadata, JSON-LD URLs and sitemap entries now use this confirmed base. If the owner later changes the hosting domain or subpath, update all six HTML heads, sitemap.xml and robots.txt together and repeat the URL tests; do not change just one canonical.

## 2. Google account configuration and current status

**2026-11-24 update:** the owner reports that the private Sheet, Script Properties and web-app deployment are configured. The owner-approved public `/exec` endpoint is now configured in both local candidates. The steps below remain the configuration reference; do not repeat setup or redeploy solely for this update. Live storage and exact-one-row retry still require the controlled verification in section 3. Read-only connection results are recorded in `CASA_GREENS_FINAL_INTEGRATION_REPORT.md` in the original workspace.

1. Use the business-controlled Google account intended to own enquiries. Review account access and recovery, enable appropriate multifactor authentication, and decide who may access enquiry data.
2. Create a new Google spreadsheet with sharing set to **Restricted**. Do not publish it to the web or enable anyone-with-link sharing. Record its spreadsheet ID privately from its URL between `/d/` and `/edit`.
3. Open **Extensions > Apps Script**. Replace the editor's Code.gs with the reviewed `google-apps-script/Code.gs`; use the V8 runtime. Do not copy the old deployed version accidentally.
4. Open **Project Settings > Script properties**, and configure:

| Property | Required | Value or format |
|---|---|---|
| `SPREADSHEET_ID` | Yes | The real private spreadsheet ID, entered only in Script Properties. Never put it in HTML, JS or Markdown. |
| `ALLOWED_ORIGINS` | Yes | `https://megamindprashant320.github.io` exactly. No repository path, trailing slash, wildcard or HTTP. Additional owner-controlled HTTPS origins may be comma-separated only if genuinely required. |
| `SHEET_NAME` | No | `Enquiries` by default; optionally the exact intended sheet-tab name. |

No API key, client secret or service-account credential belongs in the frontend. The origin allowlist isolates browser messaging; it does not authenticate anonymous senders.

5. Leave the selected sheet tab absent or empty for first setup. The backend creates these exact nine columns: **Timestamp, Enquiry ID, Customer Name, Email, Mobile, Enquiry Type, Selected Product/Service, Message, Status**. Status defaults to **New**. Location is appended to Message. Do not reorder or rename columns. A mismatched existing header deliberately fails without overwriting business data. Configure the spreadsheet timezone as desired; timestamps are stored as dates.
6. Select **Deploy > New deployment > Web app**. Execute as **Me**, the spreadsheet owner; select access **Anyone** only if business and Google Workspace policy permit anonymous enquiries. Authorize spreadsheet access in your account. Do not weaken organization-wide security policy to make this work. If anonymous web apps are prohibited, stop that configuration and arrange a narrowly scoped approved serverless enquiry endpoint; do not add an unrestricted proxy.
7. Copy the public deployment URL ending `/exec`. Do not use `/dev`. This public deployment URL is not a private API key, but it is still an abuse surface.
8. **Completed locally on 2026-11-24:** `contactForm` in `contact.html` contains the owner-approved endpoint. For any future approved endpoint change, update its `data-endpoint` to the exact `https://script.google.com/macros/s/<deployment-id>/exec` URL. Retain HTTPS, the exact Google hostname, no query and no fragment. Synchronize that one reviewed configuration change to the correct review checkout, inspect its diff and obtain separate release permission. Keep private properties out of both directories.
9. Subsequent backend edits require **Deploy > Manage deployments > Edit > New version > Deploy** in the owner account. Use the reviewed backend and retain the intended public URL. This task has not performed that deployment.

**Acceptance:** configured primary button is enabled, the explicit email fallback remains available, and a controlled real request receives an exact matching confirmation ID only after storage. A Google page loading successfully or a mocked test passing is not sufficient.

## 3. Controlled live storage and idempotency test

Run this only after owner-authorized backend setup and an independently authorized candidate release or owner-controlled HTTPS test host. The exact top-level origin must be in ALLOWED_ORIGINS. Use your own test name, email and phone and label the message as a controlled test. Do not use real customer information or send high-volume test traffic.

1. Open the deployed contact page signed out of Google in Chrome. Open Products and Services enquiries and check the selected product/service is retained. Confirm the form and its email fallback are keyboard-accessible.
2. For a reliable lost-response/retry test, before submitting open your browser DevTools Console and install this temporary **capture-only test listener**. It blocks the result message from reaching the application's normal handler while retaining only opaque IDs and a result flag in your own tab. It does not submit an extra enquiry or store customer data:

```javascript
window.__casaHoldResult = function (event) {
  const data = event.data;
  if (data && data.protocol === 'casa-enquiry-v1' && data.kind === 'result') {
    event.stopImmediatePropagation();
    window.__casaTestResult = {
      ok: data.ok,
      requestId: data.requestId,
      enquiryId: data.enquiryId
    };
  }
};
window.addEventListener('message', window.__casaHoldResult, true);
```

3. Fill the required fields using data you control. Wait at least 2.5 seconds after opening the form, then click **Send Enquiry** once. The form should disable concurrent actions while pending. Do not refresh the page, edit the fields or open an email draft during this storage test.
4. Inspect `window.__casaTestResult` in your own Console and verify `ok` is true. In your private sheet, find the exact `CG-<request UUID>` in column B. There must be exactly **one** data row for that ID, all nine values must be appropriate, and Status must be New. Do not copy the row or any personal values into a public report.
5. Allow the normal 45-second timeout. The UI must say storage is unconfirmed, preserve all values and warn about possible duplicates. This timeout alone does not mean nothing was saved.
6. Remove the temporary listener while leaving the form untouched:

```javascript
window.removeEventListener('message', window.__casaHoldResult, true);
delete window.__casaHoldResult;
```

7. Click **Send Enquiry** again without editing or refreshing. The successful reference must equal the same ID from step 4. Search/filter sheet column B and confirm its exact occurrence count is still **one**, not two. Total new enquiry rows attributable to this test must still be one. Only a confirmed success should reset fields; selected enquiry context remains as designed.
8. Remove the remaining local test reference (`delete window.__casaTestResult`). The owner may remove the controlled test row after completing and recording a non-PII pass/fail result. Do not delete business rows.
9. Repeat one ordinary successful test where appropriate for an international phone number and a formula-like message such as `=SUM(1,2)` followed by test text. Verify message content is plain text, not an evaluated sheet formula. Check a malformed number is rejected without storage.
10. Test signed-out Chrome, Edge, Firefox and Safari/iOS where available, including privacy/content-blocking settings. Google's nested HTML-service iframe and account policies must be tested live. The local four-engine mocks do not prove the Google deployment works in every privacy setting.

If a genuine success row or exact-one-row retry cannot be verified, leave production **NO-GO** for the Sheets requirement. Never treat an opaque fetch or `no-cors` response as confirmation. No live storage/submission test was executed by the local audits. Read-only endpoint/ready-handshake checks do not replace this storage test.

## 4. Explicit email fallback verification

With a blank/unavailable endpoint, online submission must be disabled or fail honestly while **Prepare Email Draft** remains available after pending requests settle. Validate empty/invalid fields, then use controlled valid data. Explicitly activate the secondary button and verify your email client receives name, email, phone, enquiry type, selected product/service and message with punctuation and line breaks intact.

No verified recipient is configured: select the intended recipient yourself and manually send only if appropriate. Opening a draft must not clear values, claim delivery, submit a second online request or change the online retry reference. After an ambiguous online timeout, decide whether an email is necessary because storage may already have happened. If no email app is installed, the UI must retain details and offer honest copy/manually-compose guidance. Long mailto URIs and handling vary by client; test the intended desktop and mobile email applications. Do not invent a business email to complete this step.

## 5. Privacy, abuse and monitoring decisions

- Choose and approve the business's actual data-retention period and who handles access/correction/deletion requests. No retention period, legal promise or business address is invented in the site. Approve a suitable public privacy disclosure before collecting live enquiries; the current form describes the data path and asks visitors to avoid sensitive information.
- Restrict sheet, Apps Script and log access to necessary authorized people. Review sharing regularly, remove departed staff and review backups/export access. Never publish the spreadsheet or add a read/export endpoint.
- Apply deletion policy to sheet rows, backups, exports and any relevant Google-platform logs. Deleting a sheet row does not necessarily erase backups/logs; confirm account retention controls. Deduplication depends on the retained ID row, so do not delete a live enquiry's ID while its retry can still be active without considering duplicates.
- The public receiver uses a honeypot, 2.5-second minimum form age, 24-hour request-age window, bounded fields, UUID validation, a script lock and best-effort cache limits of **5 requests per email per hour / 100 total per hour**. These are not authentication, durable anti-bot protection or a guaranteed quota shield. Anonymous attackers can bypass browser origin claims, clear cache conditions, use different emails or consume execution quota.
- In Apps Script **Executions** and the associated Google Cloud logs where available, monitor quotas, failed/slow executions and the fixed warning categories `VALIDATION`, `SPAM`, `RATE`, `BUSY`, `CONFIG`, `STORAGE`. The code logs only that category, never payloads, emails, sheet IDs, raw exceptions or customer messages. Caught failures can appear as successful script executions, so inspect warning categories and controlled UI smoke tests too.
- Establish who responds to unavailable service/spam and when to disable the public endpoint. For stronger abuse resistance or volume requirements, separately authorize a managed enquiry service with server-verified challenge/rate limits. Do not expose its secret or implement an open proxy.

## 6. Hosting, SEO and release verification

1. Review `review/casa-greens-sync` at the audited main commit and ensure every intended changed path is inside `Casa-Greens-Indoor-Gardening/`. Do not stage unrelated projects or private files. Obtain separate commit, push and release permission.
2. A push/merge to **main** automatically runs a shared Pages workflow that publishes multiple websites. No workflow changes, dispatch, commit, push or deployment has been made here. Treat release authorization separately from code-review acceptance.
3. After a separately approved release, GET all six canonical page URLs and ensure the **new candidate**, not the older published version, is served. Verify canonical, `og:url`, sharing-image URLs and JSON-LD `url` match the actual final location. Do not mark a read of the old site as new-candidate verification.
4. Fetch the published `sitemap.xml`, parse its six canonical URLs and submit it to the correct Search Console property if you control it. No account ownership or indexing guarantee is assumed.
5. Robots is origin-scoped: `https://megamindprashant320.github.io/robots.txt` returned 404 during read-only checking. The project `robots.txt` documents the sitemap but is not the authoritative root policy. A missing root file does not itself block crawling. Any root robots change requires the owner of the user-site/root hosting configuration and separate scope authorization; do not edit Brew-and-Bite or the shared workflow here. Submit the sitemap directly in Search Console instead of relying on a subpath robots file.
6. Check HTTPS, redirects, cache/compression and any available security-header controls on the actual host. Static GitHub Pages response headers cannot be configured by adding arbitrary HTML meta tags. Never claim a meta tag substitutes for an HTTP header.
7. Check social previews with the provider's preview/debug tool after release. The existing JPEG is intentionally an illustrative concept, not a verified client installation. Cached social previews may need refresh.
8. Repeat mobile Lighthouse/real-page checks under stable conditions and investigate field Core Web Vitals when sufficient traffic exists. Retain individual results, not only the best run. Local lab TBT is not field INP.
9. Complete physical mobile and assistive-technology reading checks: menu order/focus, headings/landmarks, errors/status, filters, long form values, reduced motion and contrast over photographs. Automated scans do not certify complete WCAG conformance.

## 7. Optional verified catalogue and project content

The six demonstration categories and seven concept/stock inspirations are intentional and honestly labelled. They are not verified inventory or completed customer installations. Owner-approved real catalogue information and genuine paired project photos can be added later without claiming they exist now; these are optional content tasks, not missing e-commerce systems.

For a future verified before/after pair, obtain permission and two truthful images of the same space/viewpoint. Copy the component inside `projects.html`'s `verified-comparison-template` into the intended public verified-project section only after supplying both real `src` values, meaningful before/after alt text and actual width/height attributes. Keep Before/After labels and the accessible range input; use unique input/label IDs if rendering multiple copies. Static components initialize through `initImageComparisons()` at page load; dynamically inserted verified components need that same initializer after insertion. Test touch, mouse, Home/End/arrow keys, responsive cropping and reduced motion. Do not activate the current empty template or substitute unrelated stock images as a transformation.

For real catalogue updates, maintain stable product IDs and the six existing category identifiers in `script.js`, provide authorized images/details, and verify enquiry preselection. Prices, availability, reviews, payments and checkout remain outside this implementation. No fabricated commercial data should replace the demonstration disclosures.

## Official references

- [Apps Script web apps](https://developers.google.com/apps-script/guides/web)
- [HTML-service communication](https://developers.google.com/apps-script/guides/html/communication)
- [HTML-service sandbox restrictions](https://developers.google.com/apps-script/guides/html/restrictions)
- [Google robots guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

All unavoidable owner/account/production tasks are consolidated here. The release checklist tracks completion; the final audit reports actual tests and remaining limitations.
