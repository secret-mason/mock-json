export function getOnly(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }
  if (req.method !== 'GET') {
    res
      .status(405)
      .setHeader('Allow', 'GET, OPTIONS')
      .json({error: {code: 'METHOD_NOT_ALLOWED', message: `Use GET, not ${req.method}.`}});
    return false;
  }
  return true;
}
