// GET /api/blogs-slow?ms=<n> -> sleeps n ms (default 2000, cap 15000) then
// returns a normal JSON list envelope. For timeout/retry testing.
import {getOnly} from './_lib/http.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (!getOnly(req, res)) return;
  const requested = Number.parseInt(req.query.ms, 10);
  const ms = Math.min(Number.isFinite(requested) && requested > 0 ? requested : 2000, 15_000);
  await sleep(ms);
  res.status(200).json({
    data: [],
    meta: {delayedMs: ms, cappedAtMs: 15_000},
    links: {self: '/api/blogs-slow'},
  });
}
