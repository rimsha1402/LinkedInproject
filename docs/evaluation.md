# Evaluation Framework

## Approach

No publicly labeled dataset exists for LinkedIn relationship strength. Evaluation therefore uses a combination of manually labeled ground-truth pairs and structured test cases designed to cover the primary signal patterns the classifier must handle.

---

## Metrics

### Relationship Strength

Ground truth: 30 relationship pairs labeled on a 1-5 scale by a human rater, mapped to a 0-1 range.

| Metric | MVP Target | Stretch Goal |
|---|---|---|
| Mean Absolute Error | < 0.25 | < 0.15 |
| Spearman Rank Correlation | > 0.6 | > 0.8 |
| Strong tie (>0.7) precision | > 70% | > 85% |
| Weak tie (<0.3) precision | > 80% | > 90% |

Rank correlation is weighted more heavily than absolute error. If the system consistently ranks stronger relationships above weaker ones relative to ground truth, small score offsets are acceptable.

### Relationship Type Classification

Five classes: `close_friend`, `ex_colleague`, `mentor`, `professional_acquaintance`, `unknown`.

| Metric | MVP Target | Stretch Goal |
|---|---|---|
| Overall accuracy | > 55% | > 70% |
| Precision on `close_friend` | > 65% | > 80% |
| Recall on `professional_acquaintance` | > 75% | > 85% |

Note: 55% accuracy across five classes compares against a random baseline of 20%. Human annotators also disagree on boundary cases such as `ex_colleague` vs `professional_acquaintance`. Accuracy at the extremes (clear close friends and clear acquaintances) is the primary requirement.

### Query Relevance

| Metric | MVP Target | Stretch Goal |
|---|---|---|
| Top-3 hit rate | > 70% | > 85% |
| Mean Reciprocal Rank (MRR) | > 0.6 | > 0.8 |

### System Performance

| Metric | Target |
|---|---|
| Feed parsing latency (per scroll event) | < 200ms |
| Query response time | < 500ms |
| Storage per 1,000 interactions | < 2MB |
| Extension memory footprint | < 50MB |

---

## Test Cases

### TC-1: Close Personal Friend (Positive Baseline)

**Input:** User A comments on User B's personal milestone post with informal, emotionally expressive language referencing shared history.

**Expected output:** `type=close_friend`, `strength > 0.8`, signals: `informal_language`, `emotional`, `personal_milestone`

---

### TC-2: Generic Professional Comment

**Input:** User A comments on User B's thought leadership post with a generic phrase such as "Great insights, thanks for sharing."

**Expected output:** `type=professional_acquaintance`, `strength < 0.3`, signals: `formal_language`, `generic_comment`

---

### TC-3: Former Colleague Signal

**Input:** User A comments on User B's new job announcement referencing a specific project or team from a previous employer.

**Expected output:** `type=ex_colleague`, `strength 0.6-0.8`, signals: `shared_workplace_reference`, `personal_memory`

---

### TC-4: Mentor-Mentee Relationship

**Input:** User A comments on User B's research post using a formal honorific and attributing their own knowledge to User B's teaching.

**Expected output:** `type=mentor`, `strength 0.65-0.85`, signals: `honorific_usage`, `gratitude`, `knowledge_attribution`

---

### TC-5: Sarcasm (Known Failure Mode)

**Input:** "Wow, revolutionary stuff. Nobody has ever said this before."

**Expected output:** `type=unknown`, `strength < 0.2`, flag: `ambiguous_sentiment`

The classifier must flag this as ambiguous rather than scoring it as positive engagement.

---

### TC-6: High Frequency, Low Depth (Engagement Farming)

**Input:** User A posts 12 comments on User B's content in one month, all single-word or single-emoji responses.

**Expected output:** `type=professional_acquaintance`, `strength 0.3-0.5`, signals: `high_frequency`, `low_depth`

Frequency alone should not produce a high relationship score.

---

### TC-7: Single Substantive Interaction

**Input:** User A posts one detailed comment (~200 words) on User B's post, with specific technical references and an explicit acknowledgment of impact.

**Expected output:** `strength 0.5-0.7` (quality outweighing frequency)

---

### TC-8: Query Path Resolution

**Setup:** Three first-degree connections have interactions with the same second-degree target at strengths of 0.75, 0.30, and 0.85.

**Expected output:** Results ranked 0.85 > 0.75 > 0.30, with the lowest flagged as a weak path.

---

### TC-9: No Path Exists

**Input:** Query for a person or company not present in any observed interaction.

**Expected output:** A clear message indicating no path was found, distinguishing between "no connection" and "not yet observed."

---

### TC-10: Emoji-Only Comment

**Input:** A comment consisting solely of reaction emoji with no text.

**Expected output:** `type=unknown`, `strength 0.2-0.4`, signals: `emoji_only`, `low_signal`

---

### TC-11: Relationship Evolution Over Time

**Setup:** Three interactions from the same pair over three months, progressing from formal professional language to informal personal language.

**Expected output:** Final `type=close_friend`, `strength > 0.8`, with the score increasing monotonically across observations.

---

### TC-12: Non-English Comment

**Input:** A comment in Spanish using informal address and referencing a long-standing personal relationship.

**Expected output:** `type=close_friend`, `strength > 0.75`, flagged with `non_english` and a lower confidence interval.

---

## Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Deleted or edited comment | Use last observed version; do not crash |
| User unfollows a first-degree connection | Retain historical data; stop observations; mark node as inactive |
| LinkedIn DOM redesign breaks selectors | Health check detects failure; alerts user; degrades gracefully |
| Second-degree becomes first-degree | Reclassify node degree; retain historical edges |
| Duplicate profiles (same person, different slug) | Treat as separate nodes; do not attempt deduplication |
| Comment on a company page post | Ignore automated posts; scope observations to personal profiles only |

---

## Acceptance Criteria (MVP)

The system meets MVP requirements if a user can:

1. Install the extension and have it run passively without daily configuration.
2. Receive meaningful query results after approximately two weeks of normal LinkedIn usage.
3. See a correct top result at least 70% of the time.
4. View the actual interaction evidence behind every relationship score.
5. Confirm that no data is transmitted outside the browser, with a one-click option to delete all stored data.
