# Relationship Inference Agent

A browser-based prototype that infers relationship types and strengths between LinkedIn connections by analyzing interaction patterns in the feed, and provides a natural language query interface to find introduction paths within a professional network.

---

## Overview

The tool observes how first-degree connections interact with second-degree connections on LinkedIn (comments, reactions), scores those interactions using a multi-layer NLP classifier, and stores the resulting relationship graph locally in the browser. Users can then query the graph to identify who in their network can best facilitate an introduction to a target person or company.

---

## Project Structure

```
.
├── index.html          # Main dashboard — open directly in a browser
├── style.css           # UI styles (dark mode)
├── app.js              # Graph rendering, query engine, modal logic
├── data.js             # Simulated network data (16 profiles, 26 interactions, 15 relationships)
└── docs/
    ├── architecture.md # System design, component breakdown, and failure modes
    └── evaluation.md   # Evaluation metrics and test cases
```

---

## Running the Prototype

No build step or server is required:

```bash
open index.html
```

The prototype runs entirely in the browser using simulated data. Functionality includes:

- Feed observer panel showing detected interactions with inferred relationship types
- Interactive network graph (click nodes to explore connections)
- Natural language query input with ranked results and evidence trail
- Detail modal showing the full interaction history behind each relationship score

---

## Design Decisions

**Browser extension model** — LinkedIn does not expose a public API for feed data. Automated browser sessions violate LinkedIn's Terms of Service. A browser extension that passively reads the DOM during normal user browsing is the only technically feasible and policy-compliant approach.

**Local-first storage (IndexedDB)** — All inferred relationship data remains in the user's browser. No server, no cloud sync. This eliminates privacy concerns around storing sensitive professional network data externally.

**Rule-based NLP classifier** — LLM-based classification was evaluated but ruled out due to latency (200-500ms per API call), cost at scale, and the requirement that data remain on-device. The rule-based system covers the majority of cases accurately and flags ambiguous inputs rather than forcing a classification.

---

## Documentation

- [docs/architecture.md](docs/architecture.md) — Full system design: pipeline, technology choices, failure modes
- [docs/evaluation.md](docs/evaluation.md) — Evaluation framework: metrics, test cases, edge cases, acceptance criteria
