// Regenerate src/data/snapshot.json, the offline seed used by `astro build` when no
// indexer snapshot is supplied (ARCHETYPES_SNAPSHOT). It reuses the signed events the
// napplet.run app store already saved from public relays, so builds need no network.
//
// Source: napplet/web's apps/web/src/data, fetched from GitHub. Pass a local checkout
// of that directory as the first argument (or ARCHETYPES_SEED_SOURCE) to read files instead.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SOURCE = 'https://raw.githubusercontent.com/napplet/web/main/apps/web/src/data';
const source = process.argv[2] || process.env.ARCHETYPES_SEED_SOURCE || DEFAULT_SOURCE;

async function load(name) {
  if (!/^https?:\/\//.test(source)) return JSON.parse(await readFile(join(source, name), 'utf8'));
  const response = await fetch(`${source}/${name}`);
  if (!response.ok) throw new Error(`${source}/${name}: HTTP ${response.status}`);
  return response.json();
}

const saved = await load('discovered-apps.json');
const discovery = await load('discovery.json');
const kinds = new Set([5129, 15129, 35129]);
const events = saved.events.filter(event => kinds.has(event.kind)).sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
const snapshot = {
  version: 1,
  generatedAt: Math.max(...events.map(event => event.created_at)),
  siteUrl: 'https://archetypes.napplet.run',
  events,
  relayHints: {},
  runtime: { relays: discovery.relays, timeoutMs: 8000 },
  relays: [],
  stats: { tracked: 0, withNapplets: 0, removed: 0 },
};
const out = fileURLToPath(new URL('../src/data/snapshot.json', import.meta.url));
await writeFile(out, `${JSON.stringify(snapshot)}\n`);
console.log(`Wrote ${events.length} events from ${source} to ${out}`);
