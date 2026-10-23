// GET /api/blog -> 404 explaining how to use the collection.
import {getOnly} from '../_lib/http.js';

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res.status(404).json({
    error: {
      code: 'MISSING_ID',
      message: 'Provide a post id: /api/blog/<id> (1-15), /api/blog/large, or /api/blog/malformed.',
    },
  });
}
