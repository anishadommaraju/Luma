# OCD Compass

React + Vite + TypeScript educational OCD research assistant, with a local Node.js API server and OpenAI Responses API `file_search`.

## Setup

Requires Node.js 24+ (native TypeScript support for the ingestion script) and pnpm.

1. `pnpm install`
2. Copy `.env.example` to `.env` if it does not exist. Set `OPENAI_API_KEY`, `OPENAI_MODEL`, and (after ingestion) `OPENAI_VECTOR_STORE_ID`. Never use a `VITE_` prefix for secrets.
3. Place PDFs in the application-root `papers/` folder. Subfolders are supported. The current set includes 19 unique, generated text reading copies; they omit original figures and page layout. Replace with licensed original PDFs when available.
4. Edit `papers/metadata.json`, keyed by relative filename. Add title, year, topic, evidence_type, retrieval_group (`general` or `safety`), and source_url. Files without a reviewed group are uploaded as `unreviewed` and excluded from chat.
5. Run `pnpm ingest` (or `node scripts/ingest-papers.ts`). It creates one **OCD Compass Research Library** store or reuses `OPENAI_VECTOR_STORE_ID`, uploads PDFs, waits for processing, and prints the store ID. Put that ID into `.env`.
6. Run `pnpm api` in one terminal and `pnpm dev` in another. Open the Vite localhost URL. Restart the API after changing `.env`.

The configured default is `gpt-5.6-luna`. Change it with `OPENAI_MODEL`; there is deliberately no silent fallback. The latest live test was blocked by OpenAI with `credit_balance_exhausted`; API credits must be available before answers can be generated.

## Reusing the library

Startup never creates vector stores or uploads files. Ingestion keeps a resumable `.rag/ingestion.json` journal and a process lock. It compares SHA-256 attributes against the existing store and skips unchanged uploads, while refreshing metadata. Keep this journal private and local. If ingestion is killed, verify it has stopped before removing `.rag/ingestion.lock`.

Changed PDFs are new content and will be added; old versions are not automatically deleted. Review/remove outdated files in the OpenAI store before serving an updated corpus. Processing failures and timeouts are reported per file; rerun after fixing them. A lost response during a remote creation/upload can require manual reconciliation in OpenAI before retrying.

## Grounding and safety

- Safety check precedes every request. Clear immediate-risk phrases receive separate real-world help guidance instead of a research answer. This pattern check is conservative and incomplete, not a clinical risk detector; the model instructions also cover emergency handling.
- Normal questions call Responses with `tool_choice: required`, only `file_search`, the configured vector store, up to 10 results, and `include: ["file_search_call.results"]`. No web search or local FAISS fallback.
- General queries filter to `retrieval_group=general`. Safety-related research can also retrieve `safety`; unreviewed files are excluded.
- The server rejects missing/failed retrieval and citations to files absent from retrieved results. It exposes actual source excerpts, cited sources, and all retrieved sources separately. Citations refer to files; the API does not guarantee exact PDF page locators, so none are fabricated.
- Prompt grounding and citation validation reduce errors but cannot guarantee that every model claim is entailed. Review excerpts. The app is educational and does not diagnose, prescribe medication changes, or deliver therapy.
- Questions and recent question context go to OpenAI; Responses uses `store:false`. No chat logging or persistent browser history is implemented. The PDF files/vector store remain in your OpenAI account until removed. Avoid entering personal information.

## Validation

`pnpm test` runs retrieval, Cloudflare Function, and symptom-check tests. `pnpm build` checks TypeScript and builds the UI. Local Vite preview still requires the local API server.

## Deploy to Cloudflare Pages

The repository includes Cloudflare Pages Functions for `/api/health` and `/api/chat`. The OpenAI API key remains in the Function environment and is never bundled into the browser. Static routes use Cloudflare Pages' SPA fallback, so `/about`, `/check`, and `/check/results` can be opened directly. `public/_routes.json` limits Function invocations to `/api/*`.

After connecting the GitHub repository in **Workers & Pages → Create application → Pages**, use:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank when this project is the repository root

In the Pages project, open **Settings → Variables and Secrets** and configure both Production and Preview:

- `OPENAI_API_KEY`: add as an encrypted secret
- `OPENAI_VECTOR_STORE_ID`: set to the existing OCD research vector-store ID
- `OPENAI_MODEL`: set to `gpt-5.6-luna`

Do not use a `VITE_` prefix for any of these values. Variables must exist before a deployment that uses them, so redeploy after saving them. The PDF files are not uploaded at application startup and are not required in the Pages output; the deployed chat reuses the configured OpenAI vector store. When `papers/metadata.json` changes, run `npm run prepare:cloudflare` and commit the refreshed `cloudflare/citation-metadata.generated.js` file.

The Function enforces same-origin requests, input-size limits, a lightweight per-isolate request limit, required `file_search`, citation validation, and no-store responses. Before sharing the site widely, configure a Cloudflare rate-limiting rule for `/api/chat`; the in-code limit is useful but cannot enforce a single global quota across all Cloudflare isolates. Also review Cloudflare and OpenAI data-handling settings for the intended audience.

API reference: https://developers.openai.com/api/docs/guides/tools-file-search



## OCD Symptom Check

`/check` provides the introduction and 17-question flow; `/check/results` requires all answers before producing a result. The custom questionnaire is educational and unvalidated. Scoring lives in `src/screening/model.ts` and is deterministic, with no API/network calls. Four dimension sums (0–12) and a separate impact sum (0–20) are shown. Percentages only set bar widths; they are not OCD probabilities. All highest-score ties are retained in `primaryDimensions`; the singular field is null for ties and all-zero results.

The professional-evaluation prompt activates only when time, distress, interference, or difficulty stopping is at least 3. Avoidance alone does not activate it. Intrusive-thought endorsement never triggers crisis routing.

Answers stay in tab-scoped `sessionStorage`, not localStorage, the server, logs, or OpenAI. Refresh preserves progress; Clear my results removes it. Browsers may restore sessionStorage when restoring closed tabs, so clear explicitly on shared devices. If storage is blocked, in-memory use still works. Research buttons prefill fixed general questions; scores and individual responses are never attached, and the user presses Send separately.
