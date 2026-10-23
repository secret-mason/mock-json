// GET /api/blogs-malformed-text -> 200 + text/plain (not JSON at all).
import {getOnly} from './_lib/http.js';

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res
    .status(200)
    .setHeader('Content-Type', 'text/plain; charset=utf-8')
    .send('upstream connect error or disconnect/reset before headers. retried and succeeded, reset reason: connection timeout\n');
}
