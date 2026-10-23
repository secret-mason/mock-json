// GET /api/blogs-error -> 429 + Retry-After + JSON error body.
import {getOnly} from './_lib/http.js';

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res
    .status(429)
    .setHeader('Retry-After', '30')
    .json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Slow down and retry.',
        retryAfterSeconds: 30,
      },
    });
}
