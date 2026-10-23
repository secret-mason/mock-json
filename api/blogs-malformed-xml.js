// GET /api/blogs-malformed-xml -> 200 + application/xml (valid XML, wrong format).
import {getOnly} from './_lib/http.js';

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <data>
    <blog><id>1</id><title>XML is not JSON</title></blog>
  </data>
  <meta><total>1</total></meta>
</response>
`;

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  res.status(200).setHeader('Content-Type', 'application/xml; charset=utf-8').send(XML);
}
