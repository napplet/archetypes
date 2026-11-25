# AGENTS.md

`CLAUDE.md` is a symlink to this file.

## Protocol fidelity

This repository reports on napplet manifests; it does not define them. The tags it indexes (`z` archetypes, `i` intents, kinds 5129, 15129 and 35129) are defined by living documents, which govern over any code, comment or doc here:

- NIP-5D: <https://github.com/nostr-protocol/nips/pull/2303> (read `5D.md` at the PR head)
- NAPs, including NAP-INTENT: <https://github.com/napplet/naps>

Never invent protocol surface (tags, kinds, fields, message types) to make the site or indexer work. A gap in the spec is something to flag and propose on the NAPs track, not to fill here. Site copy stays non-normative and links to the canonical texts. `site/curation.yaml` is editorial site data: it never changes what a manifest means and is never published to relays.

## Layout

- `site/`: `@napplet/archetypes`, the Astro site for archetypes.napplet.run
- `indexer/`: `@napplet/archetypes-indexer`, the relay crawler, SQLite store, daily build and Bunny deploy
- `Dockerfile`, `compose.yaml`: the indexer image, which carries the site so it can build it

## Workflow

- Branch off `main`; never commit to it directly. Conventional Commits, staged by explicit path.
- Before opening a PR: `pnpm type-check`, `pnpm test:unit`, `pnpm build`, `pnpm check:site`. CI runs the same and builds the image.
- Tests, docs and code change together. Keep each Markdown paragraph on one line.
- Never put private infrastructure details (hosts, addresses, operator tooling) in code, docs, issues or PRs.
