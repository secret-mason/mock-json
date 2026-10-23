# mock-json

A mock blog REST API for testing REST integrations, hosted on **Vercel**.
Extensionless JSON files served statically, plus serverless functions for the
things static hosting can't do: non-200 status codes, wrong content types,
redirects, latency, and dynamic 404s.

OpenAPI spec: [`public/openapi.json`](public/openapi.json), served at
`/openapi.json`.

## Deploy

```sh
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

No build step, no dependencies. `npm run dev` runs `vercel dev` locally.

After the first deploy, update `servers[0].url` in `public/openapi.json`.

## Layout

| path | what |
|---|---|
| `public/api/*` | static extensionless JSON payloads → `/api/*` |
| `api/*.js` | serverless functions (status codes, content types, latency, dynamic routes) |
| `api/blog/[id].js` | `GET /api/blog/<id>` — 200 / 404 / `large` / `malformed` |
| `data/` | JSON the function reads (`includeFiles` in `vercel.json`) |
| `scripts/generate.mjs` | deterministic payload generator — `npm run generate` |
| `vercel.json` | `Content-Type: application/json` + CORS headers for static `/api/*` routes |

## Endpoints

Normal: `/api/status` · `/api/blogs` (15 posts, ~24KB) · `/api/blogs-page2` ·
`/api/blogs-page3` (`next: null`) · `/api/blog/<id 1-15>`

Size: `/api/blogs-small` (~2KB) · `/api/blogs-large` (500 posts, ~1.7MB) ·
`/api/blog/large` (~600KB single post) · `/api/blogs-empty`

Malformed (all **200** — that's the point):
`/api/blogs-malformed-truncated` (cut mid-string) ·
`/api/blogs-malformed-syntax` (JSON5-ish) · `/api/blogs-malformed-bom` ·
`/api/blogs-malformed-empty` (0 bytes) · `/api/blogs-wrong-shape` ·
`/api/blogs-null` · `/api/blog/malformed` · `/api/blogs-malformed-html`
(text/html) · `/api/blogs-malformed-text` (text/plain) ·
`/api/blogs-malformed-xml` (application/xml)

Errors / redirects / latency: `/api/blogs-error` (429 + `Retry-After`) ·
`/api/blogs-server-error` (500 JSON) · `/api/blogs-bad-gateway` (502 HTML) ·
`/api/blogs-redirect` (308 → `/api/blogs`) · `/api/blogs-slow?ms=5000` (cap 15s) ·
`/api/blog/999` (404 JSON)

## Notes

- `Content-Type: application/json` on static files comes from `vercel.json`
  `headers`. Anything needing a non-200 status or a different content type is a
  serverless function instead — that's the split between `public/` and `api/`.
- Static files always return 200 (or Vercel's 404); error *bodies* that must
  keep HTTP 200 live in `public/`, real error statuses live in `api/`.
- `api/blog/[id].js` reads `data/*.json`; `vercel.json` `includeFiles` ships it
  with the function bundle.
- Regenerate all payloads with `npm run generate` (seeded RNG — output is
  byte-identical).
