# Architecture & Design

## System Overview

The Relationship Inference Agent passively observes a user's LinkedIn feed and analyzes interaction patterns between first-degree and second-degree connections. It infers relationship types and strengths from comment language, reaction types, and interaction frequency, then stores this data as a local relationship graph. Users can query the graph using natural language to identify the strongest introduction path to any target person or company.

---

## High-Level Architecture

```
+--------------------------------------------------------------+
|                       USER'S BROWSER                         |
|  +------------------+    +--------------------------------+  |
|  | Browser Extension|    |      Feed Observer Module      |  |
|  | (Content Script) |--->| - Watches feed scroll events   |  |
|  +------------------+    | - Extracts post + comment data |  |
|                          | - Identifies connection degrees |  |
|                          +---------------+----------------+  |
|                                          |                   |
|                                          v                   |
|                          +--------------------------------+  |
|                          | Interaction Extraction Engine  |  |
|                          | - Pairs 1st / 2nd degree actors|  |
|                          | - Captures comment text        |  |
|                          | - Logs timestamps & frequency  |  |
|                          +---------------+----------------+  |
|                                          |                   |
|                                          v                   |
|                          +--------------------------------+  |
|                          |  Relationship Classifier (NLP) |  |
|                          | - Sentiment + tone analysis    |  |
|                          | - Formality scoring            |  |
|                          | - Pattern matching             |  |
|                          | - Frequency-weighted scoring   |  |
|                          +---------------+----------------+  |
|                                          |                   |
|                                          v                   |
|                          +--------------------------------+  |
|                          |   Relationship Graph Store     |  |
|                          | - IndexedDB (local, private)   |  |
|                          | - Nodes: people                |  |
|                          | - Edges: scored relationships  |  |
|                          +---------------+----------------+  |
|                                          |                   |
|                                          v                   |
|                          +--------------------------------+  |
|                          |       Query Interface          |  |
|                          | - Natural language input       |  |
|                          | - Fuzzy name/company matching  |  |
|                          | - Ranked results with evidence |  |
|                          +--------------------------------+  |
+--------------------------------------------------------------+
```

All components run client-side. No data leaves the browser.

---

## Design Decisions

### Browser Extension, Not an API Client

LinkedIn does not offer a public API for reading feed comments. The official API is gated behind partnership agreements and limited to basic profile data. The realistic options were:

1. A browser extension that reads the DOM as the user scrolls.
2. A Selenium or Puppeteer bot that logs in as the user and scrapes data.
3. LinkedIn API partner access (not available to independent projects).

Option 1 was selected. The extension activates only on linkedin.com, runs within the user's authenticated session, and reads what the user would see anyway. It is the least invasive approach and avoids the automated scraping classification that would violate LinkedIn's Terms of Service.

Option 2 is technically feasible but LinkedIn actively detects automated browser sessions and blocks them.

### Local-First Data Storage

All relationship data is stored in IndexedDB within the browser. There is no external server and no cloud sync. This decision was made for three reasons:

- **Privacy**: LinkedIn connection data is sensitive. Transmitting it to any server — even a trusted one — creates liability and trust concerns.
- **Simplicity**: No backend infrastructure to maintain.
- **Compliance**: Data that never leaves the device substantially reduces GDPR and CCPA exposure.

The trade-off is no cross-device sync and a practical storage ceiling (approximately 50MB in IndexedDB, sufficient for thousands of interactions but not millions). This is acceptable for a prototype and initial production version.

### NLP Classification Approach

The classifier avoids fine-tuned transformer models — that approach is excessive for a prototype and creates a dependency on model hosting infrastructure. A layered scoring approach is used instead:

**Layer 1 — Linguistic Signals**
- Formality score: informal address vs formal language (keyword and pattern matching)
- Emotional intensity: exclamation usage, language intensity markers
- Familiarity markers: first names, nicknames, shared references, informal vocabulary

**Layer 2 — Behavioral Signals**
- Comment frequency: how often person A comments on person B's posts, tracked over time
- Reciprocity: whether person B also comments on person A's content
- Reaction type: celebratory or supportive reactions vs neutral acknowledgment

**Layer 3 — Contextual Signals**
- Post type: personal milestone vs professional update vs thought leadership
- Comment length: brief acknowledgments vs substantive paragraphs
- Thread depth: one-off comments vs ongoing conversations

Each layer produces a sub-score. The final relationship strength is a weighted combination. Weights were calibrated against approximately 50 manually labeled examples. Not a rigorous baseline, but directionally reliable.

Relationship type labels (close friend, ex-colleague, mentor, professional acquaintance) are assigned using a decision tree on the combined signal mix: high familiarity and personal post engagement indicates a personal friend; high formality and exclusively professional post engagement indicates a professional acquaintance. Ambiguous cases are flagged as unknown rather than forced into a category.

### Why Not an LLM for Classification

LLM-based classification was considered and ruled out for the prototype for three reasons:

1. **Latency**: Each API call adds 200-500ms per classification. With 30+ comments visible in a typical feed, cumulative latency becomes noticeable.
2. **Cost**: Even at low API pricing, processing thousands of comments per user per month is not sustainable for a free tool.
3. **Privacy**: Sending LinkedIn comment text to any external API contradicts the local-first principle.

An optional LLM mode is planned for a future version, for users who require higher accuracy on edge cases and accept the associated trade-offs.

### Graph Representation

The relationship graph uses an adjacency list stored as JSON in IndexedDB. Each node represents a person identified by their LinkedIn profile slug. Each edge stores:

```json
{
  "source": "linkedin.com/in/alice-chen",
  "target": "linkedin.com/in/bob-kumar",
  "strength": 0.82,
  "type": "close_friend",
  "evidence": [
    {
      "date": "2025-03-15",
      "comment": "Miss you — let's meet for dinner when you are in town",
      "post_type": "personal",
      "signals": ["informal_language", "personal_invitation", "emotional"]
    }
  ],
  "interaction_count": 7,
  "last_seen": "2025-04-20"
}
```

The query engine uses text matching on name and company fields rather than vector search. For a query such as "who knows the CTO of Stripe?", the system:

1. Extracts entity mentions (person title and company name)
2. Matches against known second-degree profiles
3. Finds all edges between the user's first-degree connections and the matched profile
4. Ranks results by relationship strength
5. Returns the top results with supporting evidence snippets

---

## Rate Limiting & LinkedIn Compliance

The extension makes no API calls to LinkedIn. It reads the DOM passively as the user scrolls. Additional precautions:

- **No automated scrolling**: The extension never triggers scroll events. It only observes what the user naturally views.
- **Throttled extraction**: DOM parsing is debounced — a maximum of once every 2 seconds — to avoid performance impact.
- **No profile visits**: The extension does not navigate to profile pages to gather additional data. It uses only what is visible in the feed.
- **User consent**: Explicit opt-in is required, with a plain-language explanation of what data is stored and why.

---

## Future Improvements

- **In-browser NLP model**: Replace keyword matching with a small fine-tuned classifier (DistilBERT or similar) running via ONNX and WebAssembly. This would improve accuracy on edge cases — particularly sarcasm and non-English text — without requiring external API calls.
- **Cross-session sync**: Optional encrypted synchronization via the user's own cloud storage (Google Drive, iCloud) for multi-device support.
- **LinkedIn messaging as a signal**: With explicit user consent, direct message frequency is the strongest available relationship signal. This requires careful privacy design and is a future-version feature.
- **Time decay on scores**: A relationship that was active in 2023 but dormant since should not score the same as one with recent activity. The system tracks `last_seen` but does not yet apply decay to relationship strength scores.

---

## Failure Modes

### 1. Sarcasm and Irony

The most significant classification weakness. A dismissive comment such as "Oh wow, another groundbreaking take" contains surface features (exclamation, engagement) that read as positive to a pattern-based classifier. In practice, it signals a negative or indifferent relationship. Sarcasm detection is an open problem even for large language models.

**Mitigation**: Comments with mixed signals (positive lexical content combined with dismissive framing) are flagged as ambiguous rather than assigned a positive classification.

### 2. Cold Start Problem

The system requires observation time. A freshly installed extension has no data. Meaningful query results require approximately 1-2 weeks of regular LinkedIn usage for a sufficient interaction sample to accumulate.

**Mitigation**: Display a data confidence indicator with each result, showing the number of interactions the score is based on and the observation period.

### 3. Visibility Bias

The system is limited to what LinkedIn's algorithm surfaces. LinkedIn shows an estimated 5% of network activity in any user's feed. Two first-degree connections may have a strong relationship that never appears in the observed feed, leaving the graph with significant blind spots.

**Mitigation**: Display coverage statistics showing what percentage of first-degree connections have been observed, and caveat all results with the observation period and data volume.

### 4. Formal Language on Professional Platforms

Some close personal relationships are conducted formally on LinkedIn. A CEO commenting "Excellent work, well deserved" on a college friend's post will be classified as a weak professional tie. The classifier appropriately weights linguistic formality as a signal, but this leads to under-scoring for people who consistently maintain formal LinkedIn communication regardless of actual relationship closeness.

**Mitigation**: For users who exhibit consistently formal language across all interactions, reduce the relative weight of the formality signal and increase the weight of frequency and reciprocity.

### 5. LinkedIn DOM Changes

LinkedIn updates its frontend regularly. CSS class names, DOM structure, and data attributes can change without notice, breaking the content script's extraction logic until selectors are updated.

**Mitigation**: Use semantic selectors (ARIA labels, data-test attributes) where available. Implement a health check that alerts the user when extraction failure is detected. Keep the extraction layer isolated from the classification and storage layers so that fixes are localized.

### 6. Comment Volume Dilution

When a post receives 50+ comments, the relationship signal of each individual comment is reduced. A congratulatory comment among hundreds carries less weight than the same comment on a post with five total responses. The current system treats all comments equally, which inflates scores on high-engagement posts.

**Mitigation**: Apply a crowd discount — as the total comment count on a post increases, the weight of each individual comment decreases proportionally. Longer, more specific comments are partially exempt from this discount.
