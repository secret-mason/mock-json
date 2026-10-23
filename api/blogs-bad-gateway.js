// GET /api/blogs-bad-gateway -> 502 + text/html (proxy-style error page).
import {getOnly} from './_lib/http.js';

const PAGE = `<!DOCTYPE html>
<html>
<head><title>502 Bad Gateway</title></head>
<body>
<center><h1>502 Bad Gateway</h1></center>
<hr><center>nginx/1.25.4</center>
</body>
</html>
`;

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res.status(502).setHeader('Content-Type', 'text/html; charset=utf-8').send(PAGE);
}
