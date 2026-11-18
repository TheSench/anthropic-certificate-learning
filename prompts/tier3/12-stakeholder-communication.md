# Defending Architecture Decisions — P6 Stakeholder Communication and Lifecycle Management

**Exam weight: 7% · part of the 31% that appears ONLY on Professional**

*Owns CCAR-P v1.1 § 5 task statements:*

- P6.1 — Unsupportable Commitments in Requirements and SLAs: Identifying a commitment in
  discovery notes or a draft SLA that the proposed Claude architecture cannot meet, and
  specifying the requirement clarification or architectural change that resolves it.
- P6.2 — Architecture Decision Records: Evaluating a draft architecture decision record
  against a stakeholder constraint it fails to address, and selecting the revision that
  makes the trade-off and its residual risk explicit without overstating certainty about
  model behavior.

## What this session assumes

Sessions 28–38. This session reads the artifacts those decisions are written into — discovery
notes, SLAs, and decision records — and finds where they promise what the architecture
can't deliver or omit what a stakeholder needed.

## Why this domain is worth 7% of your score

P6 halved in v1.1, and the third P6 objective (operational handoff) lives in session 40, so
this session carries perhaps three of the 60 scored items. Don't over-invest. What remains is narrow and
artifact-based: v1.1 dropped structured discovery, feedback loops, and general
communication as skills, and kept two review tasks — spot the commitment a Claude system
can't keep, and fix the decision record that ignores a constraint. Both reward the same
honesty: a probabilistic system's behavior stated as measured, with its error rate and
owner, never as a guarantee.

## Session focus

This is a short session; keep it tight. The crux is **no artifact may promise determinism about model behavior** — the unsupportable commitment in an SLA and the overstated revision of an ADR are the same error in two documents. Spend most of the time on P6.1: reading discovery notes or a draft SLA, finding the clause the proposed architecture cannot meet (100% accuracy, identical output for identical input, a latency bound the loop depth rules out, availability with no fallback, a model that "won't change" against a deprecation timeline), and choosing between *clarifying the requirement* (restate it as a measured rate, a percentile, a route class) and *changing the architecture* (fallback routing, a human gate, a deterministic component, a pin plus migration plan). Then P6.2: given an ADR and a stakeholder constraint it ignores, select the revision that names the constraint, states the trade-off and the residual risk with an owner, and cites eval evidence as a range — rejecting both the revision that overclaims and the one that adds detail but still omits the constraint.

## Authoritative sources

The material to ground on is what these documents let you *promise*, and what they don't.

**What you can and can't commit to**
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>
- <https://platform.claude.com/docs/en/api/rate-limits>
- <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>
- <https://code.claude.com/docs/en/legal-and-compliance>

**Evidence to state commitments with**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>

## Teaching objectives

By the end, the learner can:

**Unsupportable commitments (P6.1)**

- Read **discovery notes or a draft SLA** as an artifact and flag each commitment the
  proposed architecture cannot meet. Know the recurring families:
  - **Accuracy or determinism** — "100% accurate", "never hallucinates", "same answer every
    time" — against a probabilistic model
  - **Latency** — a bound the stated loop depth, thinking budget, or retrieval chain rules
    out at the stated percentile
  - **Availability** — an uptime figure with a single provider, region, or model and no
    fallback routing
  - **Stability** — "behavior will not change" against a model deprecation timeline
  - **Data handling** — a residency or retention promise the chosen surface doesn't provide
  - **Explainability** — "explain why the model decided" as if reasoning were reliably
    introspectable, rather than logged inputs, sources, and decision records
- Choose the resolution: **clarify the requirement** when the stakeholder's real need is
  meetable once stated measurably (a rate on a defined eval set, a percentile per route
  class, "explainable" as an audit record), or **change the architecture** when the need is
  real as stated (fallback routing, a human gate on the high-stakes path, a deterministic
  component, a pinned version with a migration plan). Recommending a deterministic system
  for the part that must be deterministic is a legitimate architectural change
- Reject the resolutions that don't resolve: a prompt instruction ("always be accurate"), a
  stronger model presented as a guarantee, or silently dropping the clause

**Architecture decision records (P6.2)**

- Read an ADR for its parts — context, constraints, options considered, decision, trade-off
  accepted, residual risk and its owner, evidence, revisit triggers — and find the
  **stakeholder constraint it fails to address** (a security reviewer's residency line, a
  finance ceiling, an operations team's on-call capacity, a legal retention term)
- Select the **revision** that names that constraint, says how the decision meets it or what
  it gives up, states the **residual risk with an owner**, and cites eval evidence as a
  measured rate or range with a revisit trigger
- Reject the three tempting wrong revisions: one that **overstates certainty about model
  behavior** ("the model will not produce incorrect output"), one so hedged it no longer
  records a decision, and one that adds length and detail but still omits the constraint
- Write the trade-off for the audience that owns the constraint — cost and risk for a
  budget owner, controls and evidence for a security reviewer — without changing the facts

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Accept the commitment vs. flag it | Does it promise determinism, or a bound the architecture can't reach? |
| Clarify the requirement vs. change the architecture | Is the stakeholder's real need meetable once stated measurably? |
| Commit to a number vs. state a range | Is there eval data supporting the number? |
| Recommend a Claude component vs. a deterministic one | Must this part be exactly repeatable? |
| Which ADR revision | Does it name the ignored constraint, the trade-off, and the residual risk with an owner? |
| Confident revision vs. calibrated one | Does it claim certainty about model behavior? |

## How to run this session

1. **Frame** — 7%, two objectives, both artifact review. Say so, and keep the pace up.
2. **Teach the unsupportable-commitment families.** Give a one-page set of discovery notes
   and a draft SLA with four commitments, two of them unsupportable. Have the learner flag
   them and say *why* the architecture can't meet each — the core exercise.
3. **Teach clarify-vs-change.** For each flagged commitment, have them choose and write the
   resolution. Push back once on each as the sponsor; accept a clarification only if it is
   measurable, and an architectural change only if it actually meets the need.
4. **Teach ADR review.** Give a draft ADR and a one-line constraint from a named
   stakeholder that it ignores. Have them find the gap, then choose among four candidate
   revisions: the right one, the overclaiming one, the over-hedged one, and the longer one
   that still misses the constraint.
5. **Decision table** — walk all six rows.
6. **Scenario drill — 4 questions**, standalone Professional format, each built on an
   artifact excerpt. Include an SLA with an unsupportable latency or availability clause, a
   discovery note with a determinism promise, an ADR revision selection, and one
   multiple-response on which clauses of a draft SLA the architecture cannot meet.
7. **Distractor autopsy** — expect a determinism promise accepted to satisfy a stakeholder,
   a prompt instruction offered as the resolution to an unsupportable commitment, and an ADR
   revision that sounds authoritative because it overstates certainty about model behavior.
8. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — absent from Foundations.

## Out of scope

- Operational handoff packages (P6.3) and model migration (P4.7) → session 40
- Compliance controls behind a data-handling commitment → session 37
- Reliability controls such as fallback routing → session 33
- Team enablement and productivity → session 43
