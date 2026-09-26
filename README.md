# Research Graph

**Don’t just find papers. Discover what’s missing between them.**

A React + TypeScript hackathon prototype that turns a supplied paper collection into an interactive knowledge graph with traceable research opportunities.

## Install

Use Node.js 22 (22.13 or newer) and npm. From the cloned project directory:

```sh
npm ci
```

If you use nvm, run `nvm use` first. No environment variables, API keys, backend, or database are required.

## Run locally

```sh
npm run dev
```

Open the URL printed by Vite, normally http://127.0.0.1:5173/.

## Build and preview

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`. Preview normally runs at http://127.0.0.1:4173/.

Run the automated checks with `npm test`.

## Vercel

Import the GitHub repository and use its root directory (the folder containing `package.json`). The included `vercel.json` specifies:

- Framework: **Vite**
- Install command: **npm ci**
- Build command: **npm run build**
- Output directory: **dist**
- Node.js: **22.x**, also specified in `package.json`
- Environment variables: **none**

The application uses hash routes such as `/#graph` and `/#insights`; no SPA rewrite is needed. Serve it at the domain root. Assets use root-relative URLs. Commit the source and lockfile, not `node_modules/` or `dist/`.

## Demo and scope

Upload the eight PDFs in `public/demo-papers/`, download `public/demo-papers.zip`, or choose **Use the sample collection** on New Analysis. Follow Analyze Papers → Research Graph → CodeBERT → View Insights → View Evidence → Explore in Graph.

**Analysis and insights are simulated using fictional metadata. PDF contents are not extracted or analyzed.** The provided filenames map to demo studies; other PDFs receive demo templates. All demo data is bundled, and no external AI or academic search service is used. Uploaded file metadata stays in browser storage; PDF bytes are not sent to a backend.

A new deployed origin starts with an empty collection. Paper-detail selection and graph focus are session state; saved collection metadata survives refresh on the same origin. Offline demos require the installed local server; this is not an installable offline PWA.

See [QA.md](QA.md) for verification coverage and limitations. Tests and the optional PDF-generation script are development tools and are not included in the production site.
