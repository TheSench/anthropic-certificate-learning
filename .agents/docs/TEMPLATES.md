# TEMPLATES.md — Learner File Templates

Templates for every file the agent creates in `learner/` and `drills/`.

---

## Learner profile template

Use when creating `learner/profile.md` for the first time.

```markdown
# Learner Profile

## Background

[From initialization: role, years in architecture/platform work, hands-on Claude
experience, production exposure, self-reported weak areas, target exam date]

## Exam targets

| Exam | Target date | Status |
|---|---|---|
| Architect — Foundations (CCAR-F) | [date or TBD] | Not attempted |
| Architect — Professional (CCAR-P) | [date or TBD] | Not attempted |

## Progress

| Tier | Sessions | Complete |
|---|---|---|
| Tier 1 — Foundations breadth | 15 | 0 |
| Tier 2 — Foundations hardening | 6 + gate | 0 |
| Tier 3 — Professional breadth | 16 | 0 |
| Tier 4 — Professional capstones | 4 + gate | 0 |

## Topic mastery

| Topic | Domain | Score | Last assessed |
|---|---|---|---|
| *(populated after sessions — 1 Introduced / 2 Shaky / 3 Solid / 4 Mastered)* | | | |

## Review queue

| Topic | Domain | Score | Due at session | Times reviewed |
|---|---|---|---|---|
| *(populated when a topic scores ≤2)* | | | | |

## Mock exam history

| Date | Exam | Scaled score | Pass | Weakest domains |
|---|---|---|---|---|
| *(populated after each mock)* | | | | |

## Recurring strengths

[Populated over time]

## Recurring gaps

[Populated over time]

## Distractor patterns

[The systematic wrong-answer biases seen across sessions — e.g. "defaults to the most
capable model when a cost constraint should dominate", "prefers more agent autonomy
than the scenario justifies". These are exam risks; drills should target them directly.]

## Carried-forward open questions

[Populated over time]

## Session log

[Sessions appended here until the log passes ~12 entries, then split to learner/sessions/]
```

---

## Relevance file template

Use when creating `learner/relevance.md`. Set ratings from the initialization answers —
HIGH for stated weak areas and for any domain at ≥18% weight, LOW only where the learner
already has production depth.

```markdown
# Domain Relevance

Read this at the start of every session to calibrate depth, examples, and emphasis.
Ratings: HIGH, MED, LOW. Relevance affects *depth and drill difficulty*, never whether a
session runs — exam weight decides that (see `BLUEPRINT.md`).

---

## Learner context

[One prose paragraph from the initialization interview: who the learner is, what they
already do hands-on, why they're sitting these exams, their target dates, and the explicit
priorities they stated about session length, depth, and pace. Write this as prose, not
bullets — it's the thing an agent reads to decide how to pitch an explanation, and a
paragraph carries the nuance a table can't.]

## Rating rationale

Every rating carries a *why*. A HIGH with no reason behind it decays into "go slower on
everything"; the rationale is what lets an agent tell an unfamiliar domain (needs
teaching) from a weak one (needs drilling) from a high-stakes one (needs both).

### Foundations (CCAR-F)

| Domain | Weight | Relevance | Rationale |
|---|---|---|---|
| F1 Agentic Architecture & Orchestration | 27% | HIGH | Largest domain; every scenario touches it |
| F2 Claude Code Configuration & Workflows | 20% | HIGH | [why for this learner] |
| F3 Prompt Engineering & Structured Output | 20% | HIGH | [why for this learner] |
| F4 Tool Design & MCP Integration | 18% | HIGH | [why for this learner] |
| F5 Context Management & Reliability | 15% | MED | [why for this learner] |

### Professional (CCAR-P)

| Domain | Weight | Relevance | Rationale |
|---|---|---|---|
| P1 Integration | 19% | HIGH | Largest Professional domain |
| P2 Solution Design & Architecture | 17% | HIGH | [why for this learner] |
| P3 Evaluation, Testing & Optimization | 16% | MED | [why — often weak in builders who haven't operated] |
| P4 Governance, Safety & Risk Management | 14% | MED | [why — absent from Foundations entirely] |
| P5 Stakeholder Communication & Lifecycle | 14% | MED | [why — absent from Foundations entirely] |
| P6 Claude Models, Prompting & Context Engineering | 13% | MED | [why for this learner] |
| P7 Developer Productivity & Operational Enablement | 7% | LOW | Smallest domain; still absent from Foundations |
```

**Setting the initial ratings.** HIGH for stated weak areas and for any domain at ≥18%
weight; LOW only where the learner has demonstrable production depth already. Never rate a
domain LOW because it's unfamiliar — unfamiliar is the argument for HIGH. The P4/P5/P7
group deserves particular care: a learner who has only *built* with Claude will
under-report weakness there because they've never had to do it, so probe before accepting
a low rating.

---

## Readiness file template

Use when creating `learner/readiness.md`.

```markdown
# Exam Readiness

Estimated, not measured — a projection from drill accuracy and coverage. Only a mock
exam is real evidence. See `.agents/TUTORIAL.md` § Readiness scoring for the formula.

**Projected Foundations: 100 / 1000** · 720 to pass · *no sessions completed*
**Projected Professional: 100 / 1000** · 720 to pass · *no sessions completed*

Formula: `projected = 100 + 9 × Σ(weight × confidence)`

## Foundations (CCAR-F)

| Domain | Weight | Confidence | Basis | Last assessed |
|---|---|---|---|---|
| F1 Agentic Architecture & Orchestration | 27% | 0 | untested | — |
| F2 Claude Code Configuration & Workflows | 20% | 0 | untested | — |
| F3 Prompt Engineering & Structured Output | 20% | 0 | untested | — |
| F4 Tool Design & MCP Integration | 18% | 0 | untested | — |
| F5 Context Management & Reliability | 15% | 0 | untested | — |

## Professional (CCAR-P)

| Domain | Weight | Confidence | Basis | Last assessed |
|---|---|---|---|---|
| P1 Integration | 19% | 0 | untested | — |
| P2 Solution Design & Architecture | 17% | 0 | untested | — |
| P3 Evaluation, Testing & Optimization | 16% | 0 | untested | — |
| P4 Governance, Safety & Risk Management | 14% | 0 | untested | — |
| P5 Stakeholder Communication & Lifecycle | 14% | 0 | untested | — |
| P6 Claude Models, Prompting & Context Engineering | 13% | 0 | untested | — |
| P7 Developer Productivity & Operational Enablement | 7% | 0 | untested | — |

## Highest-leverage next study

[The domain with the largest weight × shortfall — where the next hour buys the most
points. Recomputed every session.]
```

---

## Glossary template

Use when creating `learner/glossary.md`. Sections are added as terms need them — start
with what the first session actually requires, then keep numbering and order stable.

````markdown
# Glossary of Terms

Running index of every term introduced across completed sessions (Tier 1 · 1).

**How to use this file:** most definitions are one line — enough to jog recall, not to
teach. Load-bearing terms that needed reinforcement carry a fuller entry (mechanism, why
it matters, where it breaks, how the exam tests it). Acronyms always list their full name.

`Domain` = exam domain code (F1–F5, P1–P7). `Source` = session that introduced it
(`T1-04` = `prompts/tier1/04-*.md`).

---

## 1. Agentic Architecture

| Term | Definition | Domain | Source |
|---|---|---|---|
| [Term] (Full Name If Acronym) | [One-line definition] | F1 | T1-01 |
| **[Load-bearing term]** | [Fuller entry: mechanism, why it matters, where it breaks, how the exam tests it] | F1 | T1-01 |
````

---

## Drill deck template

Use when creating `drills/deck.md`.

````markdown
# Drill Deck

Spaced-repetition cards built from missed questions and self-flagged shaky concepts.
Closed-book recall practice — see `.agents/TUTORIAL.md` § Drill mode.

Spacing by streak: 0 → 1d · 1 → 3d · 2 → 7d · 3 → 16d · 4+ → 35d · 5 → retired.

**Cards:** 0 active · 0 retired

---

### [D-001] [Short question title]
**Domain:** F1 · **Added:** YYYY-MM-DD · **Due:** YYYY-MM-DD · **Streak:** 0 · **Seen:** 1

**Q:** [Question, exam-phrased, with options if multiple choice]

**A:** [Correct answer]

**Why:** [One-line rationale]

**Distractor tell:** [What makes the wrong answer tempting, and the cue that rules it out]
````
