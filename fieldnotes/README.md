# j0 / fieldnotes — private staging

Isolated companion to josephayinde.com. This package is under a fresh local clone of `j0builds/personalwebsite`; public website integration is an optional, disabled-until-configured link. The default branch contains a Vite root and a separate Next app. Vercel lists `personalwebsite`, project `prj_fJIm4aOFCTS5ddHGaCjL2MOJmWez`, in team `team_ENuHdgnyowBCrpmfz6QlrfFH` (`jos-projects-6f58db0d`). Detailed hosting configuration is pending the connector's required team authorization; do not assume which subdirectory is deployed.

## Current status

Code and isolated local verification are complete. No staging deployment or cloud store has been created yet. Vercel's connection returned 403 requiring user approval of team access. Hosted storage and cloud AI have NOT been tested. No actual journal entries, candidate records, credentials or local backups were copied.

## Experience

Owner sign-in opens the minimal writing page automatically. Journal and Think have separate drafts/history. Save entry persists without AI. Save & update cards records explicit updates to existing candidates; Think explores options without changing the map. Close the writing page for the map; Lock signs out. Whole-board JSON export remains available.

## Access and data

- Every asset and API passes application authorization. No signup and no public journal endpoint.
- Owner possession of a cryptographically random 256-bit access key, stored only with Joseph, grants entry. This is a single-owner key login, not OAuth or MFA. Anyone given the key can sign in; do not share it.
- Only its SHA-256 hash is configured in the deployment. Eight-hour signed `__Host-` cookies are Secure, HttpOnly and SameSite=Strict. Rotate SESSION_SECRET to invalidate sessions, and OWNER_ACCESS_HASH to change the key.
- Writes and login enforce same origin. Missing secrets lock all routes. Responses are private/no-store, framed embedding is denied, source assets are not in the static output folder.
- Board/drafts/journal are encrypted with AES-256-GCM in a **private** Vercel Blob store. The server holds the key, so this is not end-to-end encryption. Hosting account administrators retain infrastructure-level access.
- Conditional Blob ETag writes and revision checks reject conflicting saves. Encrypted prior revisions are stored under `fieldnotes/history/`. This staging implementation does not prune history automatically; set a deliberate retention policy before extensive use.
- No raw entries, credentials or provider failures are logged by application code. AI input goes through Vercel AI Gateway only when invoked; provider/platform logging is governed by the account configuration, not an offline privacy guarantee.

## Deployment once team access is approved

1. Inspect the existing website project to confirm hosting without changing it.
2. Create a separate `j0-fieldnotes-staging` Vercel project in the same team. No Git auto-deploy connection, no production-domain aliases, `publicSource: false`, OIDC enabled. Enable Vercel deployment protection as an additional gate where available; application authorization is still mandatory.
3. Create a **private** Blob store connected only to this staging project. Never create public storage for entries.
4. Generate an owner key with `randomBytes(32).toString('base64url')`, SESSION_SECRET with at least 32 random bytes, DATA_ENCRYPTION_KEY with 32 random bytes encoded as 64 hex characters. Preserve recovery material securely outside the repository; never print secrets into chat or commit them. Provide the owner key to Joseph through a local owner-readable file or password manager. Losing the encryption key loses access to stored content.
5. Add server-only sensitive environment variables: OWNER_ACCESS_HASH (SHA-256 hex of the owner key), SESSION_SECRET, DATA_ENCRYPTION_KEY. Blob connection provides BLOB_READ_WRITE_TOKEN. Set AI_GATEWAY_MODEL to `openai/gpt-5.4-mini` (verified in live model metadata on 2026-11-07); OIDC is taken from the per-request Vercel header. Gateway credits/access must be available. Never reuse the local test credential.
6. Deploy only this `fieldnotes/` directory as a preview. `vercel.json` exposes only `public/` and routes app/API requests through the authenticated Node function; its included assets contain only generic library and fresh seed.
7. Before handing off, verify anonymous denial of root/private scripts/library/board, signed-in save/reload, stale-write rejection, private Blob access denial without credentials, logout, and one fictional AI synthesis. Keep real-data migration separate until user explicitly requests it.

## Verification

`npm ci --ignore-scripts && npm test`: twelve focused tests cover unauthorized access, login/origin/cookie flags, session expiry/tampering, authenticated encryption/tampering, save/conflict handling, invalid graph/draft rejection, and non-mutating Think/ambiguous hiring.

Browser QA used `node tests/preview.mjs`, which runs only on loopback, with an explicit fictional key and an in-memory fake store. Owner login, auto-open writer, plain save and reload passed. This proves UI/handler behavior, not live Blob persistence. `npm audit --omit=dev`: zero known vulnerabilities after compatible Zod override 4.6.6. Local tests ran on Node 26; deployment targets Node 22 and still needs hosted validation.

## Company story and compounding context

`/story` is the private internal blog; `/story/entry/:id` is a stable source link. Plain saves enter the source corpus immediately, without a model call. Journal entries remain the author's dated account; Think entries remain explicitly exploratory. Both AI modes retrieve relevant company history before responding and expose their retrieval receipt. Nothing is recursively summarized into an untraceable “truth”.

- Context is derived from original entries and current map cards each time. Retrieval prioritizes keyword overlap, recency and decision cards; packets are capped at 24 sources / roughly 24,000 characters with explicit coverage and truncation. This is lexical retrieval, not a guarantee that every relevant detail is found.
- “Use this entry in company context” defaults on. Personal exclusions remove the entry and cards derived from it from retrieval. Entries remain readable in the owner-only Story view. Excluding an entry does not delete it or undo prior AI processing.
- “Write a correction” creates a new entry with `supersedes`; the earlier account remains in the blog but is withheld from active context. No automatic conflict resolution or speculative promotion into a confirmed decision.
- Unsaved drafts are not part of context. AI interpretation summaries are labeled as such in the blog; context excerpts use original text, not AI summaries.
- `/api/context?q=...` returns a machine-readable packet; `?format=markdown` downloads it. `/api/context/source/:id` returns a full eligible source (IDs have `entry:` or `card:` prefixes). These routes are never anonymous.
- Optional `CONTEXT_READ_TOKEN_HASH` enables a distinct read-only bearer token for only those two context endpoints. It cannot read the raw board, personal/superseded entries, the owner blog or write anything. Generate it separately from the owner key. `context-client.mjs` is a minimal agent bridge using private environment variables. Hosting alone does not connect every AI chat: configure an authenticated reader or attach the exported context packet in that tool.
- AI requests now include retrieved history in Think as well as Journal. The UI discloses this; Think still cannot mutate cards.

## Website integration in the same repo

The staging branch includes the `fieldnotes/` app plus a conditional link in both the Vite entrypoint and Next footer. Set `VITE_FIELDNOTES_URL` (Vite) or `FIELDNOTES_URL` (Next) to the verified HTTPS private staging URL. Links are absent until configured. The link leads to authentication, not public journal content. Do not merge/deploy website-link changes until the actual production root has been confirmed and staging access tested.

The company-story scope was also applied to the existing local localhost8877 app, sharing the deterministic compiler through a Node bridge. Local data is preserved and is still separate from the empty hosted seed. No migration implied.

### Latest verification / access status

Fourteen focused tests pass after adding company-source privacy, correction, older-detail retrieval, escaping, read-only token boundaries and AI-context injection checks. Live isolated browser QA verified plain save → Story, then correction → two preserved entries with only the correction in active context. A fictional local Codex Think request correctly recalled the earlier manual-first onboarding decision and cited its entry ID. Vite website build passes with pre-existing build warnings; existing root dependencies have advisories unrelated to the isolated fieldnotes package (which audited clean).

The GitHub connector also rejected `create_tree` with 403 “Resource not accessible by integration”. The staging branch is local until Contents write access is granted. Vercel still returns 403 for its team. Neither usage reset implies permission to these integrations; no attempts were made to bypass their denials. No source upload, hosted deployment, cloud persistence test, or public website release is claimed.

Next website TypeScript check (`tsc --project next-app/tsconfig.json --noEmit`) passed. Existing Next dependency advisories were observed during installation; no production package upgrades were attempted as part of this isolated staging change.
