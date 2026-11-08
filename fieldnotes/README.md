# Fieldnotes — local and private

Minimal journal, thinking space, hiring notes, map, and source-linked company context.

## Run

Requires Node 22+ and Ollama. Run `ollama pull qwen3:4b`, then `npm start` in this directory. Open http://127.0.0.1:8891 or the static interface at https://private.josephayinde.com. Use the local access key at `~/.fieldnotes-private/local-access-key.txt`. The key is not a website password and is never sent to the website host.

The website serves only HTML, CSS, and JavaScript. Its browser requests go directly to the loopback server on port 8891. Allow local-network access when your browser asks. This works on the Mac running the service; other devices do not automatically connect to it. There is no public tunnel or remote server.

## Data

Encrypted records live at `~/.fieldnotes-private/journal/state.enc`, with the last 100 local revision backups. Credentials are in `~/.fieldnotes-private/local-credentials.json`, outside this repository. Keep a secure backup of both data and credentials. The local server can decrypt the files; anyone who controls this Mac account can access them.

Export/Import in board tools gives portable JSON backups (exports contain plaintext). No journal text, candidate data, or credentials belong in this public code repository. The generic empty seed is the only bundled data. The original localhost8877 journal is separate and has not been overwritten.

## AI

Ollama runs Qwen3 4B on localhost11434, with cloud calls disabled in this app. No AI Gateway, paid APIs, external database, or JavaScript runtime dependencies. AI may be wrong: automatic hiring updates require exact current-entry evidence and unique candidate matching; Think never mutates cards. Company context uses bounded source retrieval, not a claim to know every historical detail.

## Website deployment

`npm run build` copies only the static interface to public/. Vercel hosts these public code assets; it holds no journal data. /story is a static shell that reads the local server after unlocking. The public personal website remains unchanged. Draft PR7 stages these changes in the same repository.

## Verification

`npm test` covers access, source exclusions, context, and extraction constraints. Hosted/local integration checks must also verify loopback-only binding, CORS, auth, CAS, persistence, and Ollama inference. No billing account is needed by this app. Existing domain/website hosting arrangements are separate.
