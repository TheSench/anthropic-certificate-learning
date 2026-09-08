# Anthropic Architect Certification Tutorial

An interactive, agent-driven tutorial system for the **Claude Certified Architect**
certifications — Foundations (CCAR-F) first, then Professional (CCAR-P).

Curriculum lives in markdown. Progress lives in files and is committed after every
session, so you can stop mid-curriculum and resume weeks later in a fresh conversation.

---

## Using it

Open Claude Code in this repo and send:

```
Start
```

First run asks a few background questions and creates your learner files. Every run after
that, send:

```
Continue
```

It picks up exactly where you left off. Two other triggers:

```
drill     — closed-book spaced-repetition on questions you've missed
mock      — a timed, full-length, closed-book practice exam
```

---

## What a session looks like

Roughly 35–50 minutes, in two halves.

**Teaching half** — Socratic, not a lecture. One concept at a time, with an
explain-it-back or predict-the-outcome check after each before moving on. Every topic that
is fundamentally a *choice* ends with an explicit "when to use which, and the tell that
distinguishes them" table, because that's what the exams score.

**Drill half** — exam-format questions at exam difficulty, followed by a **distractor
autopsy**: for every question, why each wrong answer is tempting and what rules it out.
On a scenario-based multiple-choice exam, that's where the discrimination lives, so it's
treated as the most valuable part of the session.

Afterwards the system writes your session log, mastery score, readiness estimate, drill
cards for anything you missed, and glossary entries for new terms — then commits.

---

## The curriculum

43 sessions across four tiers. Sessions per domain are **proportional to official exam
weight**, so study time tracks what's actually scored.

| Tier | Sessions | What it is |
|---|---|---|
| 1 | 15 | Foundations breadth — all five F domains |
| 2 | 6 + mock gate | Foundations hardening — one drill per exam scenario archetype |
| 3 | 16 | Professional breadth — all seven P domains |
| 4 | 4 + mock gate | Professional capstones — full architecture problems |

Mock gates are mandatory. Score under 720 and the system queues your weakest domains for
review instead of advancing you.

**Tier 4's last session is a Weak-Domain Blitz** — it reads your own record, ranks domains
by weight × shortfall, and attacks your specific recurring biases. It's the highest-leverage
session in the curriculum and it's meant to be re-run.

---

## Exam targets

| | Foundations (CCAR-F) | Professional (CCAR-P) |
|---|---|---|
| Items | 60 | 63 |
| Duration | 120 min | 120 min |
| Format | 4 scenarios from a pool of 6, 15 questions each | Standalone items |
| Passing | 720 / 1000 scaled | 720 / 1000 scaled |
| Conditions | Proctored, closed-book | Proctored, closed-book |

Full domain weights, scenario archetypes, and the documentation map are in
[`BLUEPRINT.md`](BLUEPRINT.md).

**Note on Professional:** its Governance, Stakeholder, and Enablement domains are 35% of
the exam and appear nowhere on Foundations. They're the usual reason a strong Foundations
candidate fails Professional, so the curriculum treats them as first-class.

---

## How progress is tracked

```
learner/
  profile.md      background, mastery scores, review queue, distractor patterns
  readiness.md    per-domain confidence + projected scaled score vs. 720
  relevance.md    per-domain depth calibration
  glossary.md     running index of every term introduced
  progress.md     generated charts
  sessions/       individual session logs
drills/
  deck.md         spaced-repetition cards built from your missed questions
```

Three things worth knowing about the tracking:

- **Readiness is an estimate, and labeled as one.** It exists to answer "which domain do I
  study next", using weight × shortfall. Untaught domains count as 0, not "unknown", so it
  can't flatter you early. A mock result always overrides the estimate.
- **Mastery 4 requires reasoning correctly about why distractors are wrong**, not just
  getting the answer right. On these exams that *is* the skill.
- **Every missed question becomes a drill card** with its distractor tell, on a spacing
  schedule (1d → 3d → 7d → 16d → 35d → retired). Missed questions are the best study
  material you have; they shouldn't be lost to scrollback.

---

## Freshness

Both exams test current behavior across Claude Code, the Agent SDK, the API, and MCP — all
of which move faster than any static curriculum. So prompt files carry the *pedagogy* and
cite authoritative documentation for the *facts*, and the session protocol requires
fetching those before teaching anything version-sensitive: flag names, model IDs, config
keys, limits, prices, schemas. Any contradiction found gets logged so the prompt file can
be corrected.

Two things still go stale on their own and need a manual refresh:

1. **Exam blueprints** — re-verify domain weights and formats before booking. Playbook in
   [`.agents/docs/DEVELOPMENT.md`](.agents/docs/DEVELOPMENT.md).
2. **Documentation URLs** — Claude Code docs moved to `code.claude.com`, API docs to
   `platform.claude.com`. Expect further moves.

`BLUEPRINT.md` records when its blueprint data was last verified.

---

## Development

See [`AGENTS.md`](AGENTS.md) for routing, [`.agents/docs/ARCHITECTURE.md`](.agents/docs/ARCHITECTURE.md)
for design rationale.

The split that matters: the agent owns everything about *your progress* and none of the
*curriculum or protocol*. `prompts/`, `.agents/`, `BLUEPRINT.md`, and this file need a
human to change — which keeps a session from quietly rewriting the syllabus to match
whatever it happened to teach.

## Credits

Structure adapted from the `machine-learning-list` tutorial system: the tiered
prompt-per-session curriculum, the `Start`/`Continue` file-state protocol, mastery scoring
with a review queue, the running glossary, and the generated progress charts. Added here
for certification prep: exam-weight-proportional sessions, scenario drilling with
distractor autopsies, weighted readiness projection, mock exam gating, and the
spaced-repetition drill deck.
