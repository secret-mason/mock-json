// GET /api/blogs-malformed-html -> 200 + text/html
// Simulates a proxy/WAF returning an HTML interstitial on a JSON endpoint.
import {getOnly} from './_lib/http.js';

const PAGE = `<!DOCTYPE html>
<html>
<head><title>Attention Required</title></head>
<body>
<h1>One more step</h1>
<p>Please enable JavaScript and cookies to continue.</p>
</body>
</html>
`;

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(PAGE);
}
