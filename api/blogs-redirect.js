// GET /api/blogs-redirect -> 308 Permanent Redirect -> /api/blogs
import {getOnly} from './_lib/http.js';

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res.status(308).setHeader('Location', '/api/blogs').end();
}
