// GET /api/blogs-server-error -> 500 + JSON error body.
import {getOnly} from './_lib/http.js';

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: 'Upstream database exploded.',
      requestId: 'req_mockjson_01JXYZ',
    },
  });
}
