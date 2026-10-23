#!/usr/bin/env node
// Regenerates the static payloads under public/api/ and the data files under
// data/ that the /api/blog/<id> serverless function reads. Fully deterministic
// (seeded RNG) so re-running it produces byte-identical output.
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function write(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), {recursive: true});
  writeFileSync(p, content);
  console.log(`${rel} (${Buffer.byteLength(content)} bytes)`);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = (arr) => arr[int(0, arr.length - 1)];

const WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not',
  'on', 'with', 'as', 'you', 'do', 'at', 'this', 'but', 'by', 'from', 'they',
  'we', 'say', 'or', 'an', 'will', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'know', 'take', 'into', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'most', 'us', 'between', 'still', 'through', 'before',
];
const TECH = [
  'api', 'json', 'http', 'rest', 'endpoint', 'payload', 'client', 'server',
  'request', 'response', 'header', 'token', 'cache', 'proxy', 'latency',
  'deploy', 'test', 'mock', 'schema', 'query', 'buffer', 'stream', 'parse',
  'runtime', 'build', 'module', 'webhook', 'retry', 'timeout', 'status',
];
const TAGS = [
  'api', 'rest', 'json', 'http', 'testing', 'mocks', 'serverless', 'javascript',
  'typescript', 'devops', 'webdev', 'integration', 'ci', 'debugging',
  'performance', 'tooling',
];
const AUTHORS = [
  {id: 1, name: 'Maya Chen', email: 'maya.chen@example.com'},
  {id: 2, name: 'Jonas Berg', email: 'jonas.berg@example.com'},
  {id: 3, name: 'Priya Nair', email: 'priya.nair@example.com'},
  {id: 4, name: 'Sam Okafor', email: 'sam.okafor@example.com'},
  {id: 5, name: 'Lena Fischer', email: 'lena.fischer@example.com'},
  {id: 6, name: 'Tomas Reyes', email: 'tomas.reyes@example.com'},
  {id: 7, name: 'Ava Kim', email: 'ava.kim@example.com'},
  {id: 8, name: 'Noah Wright', email: 'noah.wright@example.com'},
];
const VERBS = ['scale', 'debug', 'mock', 'test', 'deploy', 'secure', 'cache', 'profile'];
const THINGS = [
  'REST APIs', 'JSON payloads', 'microservices', 'serverless functions',
  'HTTP clients', 'webhooks', 'CI pipelines', 'rate limiters',
  'message queues', 'integration tests', 'api gateways', 'retry logic',
];
const ADJS = ['failing', 'flaky', 'slow', 'over-engineered', 'silently broken', 'misconfigured'];

function sentence() {
  const n = int(5, 16);
  const words = [];
  for (let i = 0; i < n; i++) words.push(rand() < 0.25 ? pick(TECH) : pick(WORDS));
  const s = words.join(' ');
  return s[0].toUpperCase() + s.slice(1) + pick(['.', '.', '.', '.', '?', '!']);
}
function paragraph() {
  const n = int(3, 6);
  const s = [];
  for (let i = 0; i < n; i++) s.push(sentence());
  return s.join(' ');
}
function bodyOf(minChars) {
  const parts = [];
  let len = 0;
  while (len < minChars) {
    const p = paragraph();
    parts.push(p);
    len += p.length + 2;
  }
  return parts.join('\n\n');
}
function makeTitle() {
  const forms = [
    () => `How to ${pick(VERBS)} ${pick(THINGS)}`,
    () => `Why your ${pick(THINGS)} might be ${pick(ADJS)}`,
    () => `${int(3, 12)} ways to ${pick(VERBS)} ${pick(THINGS)}`,
    () => `${pick(THINGS)} vs ${pick(THINGS)}: a practical guide`,
    () => `The hidden cost of ${pick(THINGS)}`,
    () => `Understanding ${pick(THINGS)} in ${int(2024, 2026)}`,
  ];
  return pick(forms)();
}
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const iso = (daysAgo) => new Date(Date.UTC(2025, 5, 15) - daysAgo * 864e5).toISOString();

function post(id, minBody) {
  const title = makeTitle();
  const body = bodyOf(minBody);
  const published = int(20, 500);
  return {
    id,
    title,
    slug: `${slugify(title)}-${id}`,
    author: pick(AUTHORS),
    status: 'published',
    tags: [...new Set(Array.from({length: int(2, 4)}, () => pick(TAGS)))],
    publishedAt: iso(published),
    updatedAt: iso(Math.max(0, published - int(0, 10))),
    excerpt: body.slice(0, 140).trimEnd() + '…',
    body,
    stats: {
      views: int(10, 25000),
      comments: int(0, 40),
      readingTimeMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    },
    links: {self: `/api/blog/${id}`},
  };
}

function detail(p) {
  const comments = Array.from({length: int(1, 5)}, (_, i) => ({
    id: p.id * 100 + i,
    postId: p.id,
    author: {name: pick(AUTHORS).name},
    body: paragraph(),
    createdAt: iso(int(0, 30)),
  }));
  const related = [...new Set([int(1, 15), int(1, 15), int(1, 15)])].filter((x) => x !== p.id);
  return {...p, comments, related};
}

function listResponse(data, self, links = {}) {
  return JSON.stringify(
    {data, meta: {total: data.length, count: data.length}, links: {self, spec: '/openapi.json', ...links}},
    null,
    2,
  ) + '\n';
}

// ---------------------------------------------------------------------------
// Normal payloads (all served as 200 + application/json via vercel.json)
// ---------------------------------------------------------------------------

const main = Array.from({length: 15}, (_, i) => post(i + 1, 700));
write('public/api/blogs', listResponse(main, '/api/blogs', {next: '/api/blogs-page2'}));

const page2 = Array.from({length: 15}, (_, i) => post(i + 16, 700));
write('public/api/blogs-page2', listResponse(page2, '/api/blogs-page2', {prev: '/api/blogs', next: '/api/blogs-page3'}));

const page3 = Array.from({length: 10}, (_, i) => post(i + 31, 700));
write('public/api/blogs-page3', listResponse(page3, '/api/blogs-page3', {prev: '/api/blogs-page2', next: null}));

write('public/api/blogs-small', listResponse([post(1, 120), post(2, 120)], '/api/blogs-small'));

// First 15 entries stay consistent with /api/blog/<id> lookups.
const big = [...main, ...Array.from({length: 485}, (_, i) => post(i + 16, 2500))];
write('public/api/blogs-large', listResponse(big, '/api/blogs-large'));

write('public/api/blogs-empty', listResponse([], '/api/blogs-empty'));
write('public/api/blogs-null', 'null\n');
write('public/api/blogs-wrong-shape', JSON.stringify({
  data: 'expected an array of posts — got a string instead',
  meta: {total: 1},
  links: {self: '/api/blogs-wrong-shape'},
}, null, 2) + '\n');
write('public/api/status', JSON.stringify({
  status: 'ok',
  service: 'mock-json blog api',
  version: '1.0.0',
  docs: '/',
  spec: '/openapi.json',
}, null, 2) + '\n');

// ---------------------------------------------------------------------------
// Malformed payloads that are still 200 + application/json
// (content-type lies; the body is broken — the classic integration-test case)
// ---------------------------------------------------------------------------

const truncated = listResponse(main.slice(0, 8), '/api/blogs-malformed-truncated').slice(0, 1437);
write('public/api/blogs-malformed-truncated', truncated);

write('public/api/blogs-malformed-bom', '﻿' + listResponse(main.slice(0, 3), '/api/blogs-malformed-bom'));

write('public/api/blogs-malformed-empty', '');

write('public/api/blogs-malformed-syntax', `{
  "data": [
    {
      "id": 1,
      "title": "This payload is intentionally invalid",
      'author': 'single-quoted key and value',
      "tags": ["api", "rest",],
      // comments are not legal JSON
      "views": NaN,
      "body": "raw
newline inside a string",
      "published": true,
    },
  ],
  meta: {"total": 1,},
}
`);

// ---------------------------------------------------------------------------
// Data files for the /api/blog/<id> serverless function
// ---------------------------------------------------------------------------

write('data/posts.json', JSON.stringify(main.map(detail), null, 2) + '\n');

const bigPost = detail(post(99, 600_000));
write('data/large-post.json', JSON.stringify(bigPost, null, 2) + '\n');
