// GET /api/blog/<id>
//   <id> in 1..15  -> 200 application/json BlogDetail (from data/posts.json)
//   "large"        -> 200 application/json ~600KB single post
//   "malformed"    -> 200 application/json but the body is truncated mid-string
//   anything else  -> 404 application/json error body
import {existsSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {getOnly} from '../_lib/http.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = [join(process.cwd(), 'data'), join(here, '../../data')].find((d) =>
  existsSync(join(d, 'posts.json')),
);
const posts = JSON.parse(readFileSync(join(dataDir, 'posts.json'), 'utf8'));
const largePost = readFileSync(join(dataDir, 'large-post.json'), 'utf8');
const truncatedPost = JSON.stringify(posts[0], null, 2).slice(0, 1400);

export default function handler(req, res) {
  if (!getOnly(req, res)) return;
  const {id} = req.query;

  if (id === 'large') {
    res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8').send(largePost);
    return;
  }
  if (id === 'malformed') {
    res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8').send(truncatedPost);
    return;
  }
  const post = posts.find((p) => String(p.id) === id);
  if (!post) {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `No blog post with id "${id}".`,
        hint: 'Valid ids are 1-15, plus "large" and "malformed".',
      },
    });
    return;
  }
  res.status(200).json(post);
}
