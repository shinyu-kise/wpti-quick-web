# WPTI-Quick Web 1.3.1-dialogue-rc.1

A **dialogue-support prototype**. The primary flow is original three-domain responses → optional life-context discussion → a participant-chosen next step → a printable/copyable summary. Japanese and English are supported.

Quick instrument **v1.0 questions, option IDs/labels and scoring are unchanged**. Web and dialogue versions are separate. Unsure or unanswered dialogue entries are not scored. A legacy total is available only for complete instrument responses, under a collapsed reference section; it is not a diagnosis, percentage of health, or validated clinical threshold.

See [the vNext specification and release boundaries](docs/dialogue-vnext.md), [scientific boundaries](docs/scientific-boundaries.md), and [unresolved fractional-time categories](docs/sitting-time-boundaries.md).

## Setup

Install dependencies:

```bash
npm ci
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

The build exports the site to `out/`. Preview that production build locally:

```bash
npm start
```

Open http://127.0.0.1:3000 (or the address printed by the server). Run `npm run build` again after source changes. `npm start` requires an existing build and serves static files; `next start` is incompatible with `output: "export"`.

To use a different port:

```bash
PORT=4316 npm start
```

The preview binds to `127.0.0.1` by default; use `HOST=0.0.0.0 npm start` only when access from other machines is intended. Use `PORT` and `HOST` for these overrides instead of appending duplicate CLI flags. Unknown paths return HTTP 404, without falling back to the home page.

The existing public site is hosted on Vercel. This local preview command does not change the Vercel project or deploy anything. Static hosting should serve the contents of `out/` after `npm run build`; it does not need a Next.js application server.

Run the implementation checks:

```bash
npm run typecheck
npm run lint
npm test
```

## Privacy and release status

Responses, optional context and plans live only in memory and clear on reload or session reset. No analytics, automatic collection, persistent browser storage, account or server data endpoint is included. Copy/print are explicit user actions. Ordinary hosting request logs are a separate matter; this is not a research database. Do not enter personal identifiers.

Synthetic tests and a build verify implementation, not validity or clinical benefit. Field evaluation and health-class data collection require confirmation of the protocol and consent/ethics scope. The author authorized publication on 2026-10-23 after display/print verification and preservation of the previous public version. Deployment success must be verified separately; source approval is not proof of deployment.

The previous public Web v1.2-rc.1 remains recoverable from commit `d470d06d836e529db96fd4d77ce4aaa0a02e6fce` and branch `archive/web-v1.2-rc.1-review-20261023`. See [preservation and release records](docs/release-preservation.md).

## Scientific provenance

The original WPTI is a continuous composite index with fixed preprocessing/PCA-derived coefficients; Quick is a separate categorical instrument. Its 64 possible complete response patterns give 11 totals from 0 to 100 in increments of 10. Neither finer display nor this workflow can retrospectively correct original-paper errors. Historical 35/60 labels are retained only inside compatibility code and are not shown as clinical classifications.

Original paper: Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. https://doi.org/10.1080/09593985.2026.2621961

Cite the original separately and record the actual Quick instrument, Web and dialogue versions and evaluation dates. Never attribute prototype features to an earlier study period.
