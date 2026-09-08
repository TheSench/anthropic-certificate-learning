# GUIDELINES.md — Conventions and Anti-Patterns

## File naming

- Prompt files: `<NN>-<kebab-topic>.md`, zero-padded, matching the session sequence
- Session logs: `tier<N>-<NN>-<kebab-topic>.md`
- Learner files: fixed names (`profile.md`, `relevance.md`, `readiness.md`,
  `glossary.md`, `progress.md`) — do not rename
- Drill card IDs: `D-NNN`, monotonically increasing, never reused

## Domain codes

Always refer to domains by code plus name on first use in a file: `F1 Agentic
Architecture`. Codes are defined in `BLUEPRINT.md` and are stable.

- `F1`–`F5` — Foundations domains
- `P1`–`P7` — Professional domains
- `S1`–`S6` — Foundations scenario archetypes

## Prompt file structure

Every prompt file has these sections, in order:

1. `# <Title> — <Domain code> <Domain name>` + exam weight line
2. `## What this session assumes` — prior sessions and background
3. `## Why this domain is worth <N>% of your score` — the framing
4. `## Authoritative sources` — doc URLs to verify against, grouped by what they settle
5. `## Teaching objectives` — what the learner can do afterward, as capabilities
6. `## Decisions the exam actually tests` — the choice pairs, explicitly
7. `## How to run this session` — the arc, and what to drill
8. `## Out of scope` — what to defer, and to which session

## Writing drill questions

- Exam difficulty, never trivial. If the right answer is obvious from the phrasing, rewrite it.
- Distractors must be *plausible* — each should be the correct answer to a slightly
  different question, or correct-but-suboptimal for the stated constraints.
- Every scenario carries the constraints that decide the answer (cost ceiling, latency
  budget, compliance requirement, team size). Scenario questions without a deciding
  constraint have no defensible answer.
- Mark multiple-response questions explicitly: "Select all that apply."
- Write the distractor tell before finalizing the question. If you can't name what makes
  a wrong option tempting, it isn't a good distractor.

## Session commit format

Exact format, no variations:

```
Session log: [Title] — [Domain] (YYYY-MM-DD)
Mock exam: [Foundations|Professional] — [scaled score] (YYYY-MM-DD)
Manual correction: [brief description]
```

## Curriculum content (read-only to agents)

`prompts/`, `.agents/TUTORIAL.md`, `BLUEPRINT.md`, and `README.md` define the learning
contract. Agents must not modify them. Changes need a human author.

## Anti-patterns

- **Do not** teach a version-sensitive fact (flag, model ID, config key, limit, price,
  parameter) without checking the cited docs first — a confidently wrong flag name is
  worse than saying "let me verify"
- **Do not** invent sessions or domains not in the session sequence
- **Do not** skip the distractor autopsy — it's the highest-value part of a session
- **Do not** end a session without adding drill cards for every miss
- **Do not** log a gap in prose only — score it in `## Topic mastery`, and if ≤2 queue
  it in `## Review queue` in the same step, or it will never be revisited
- **Do not** advance past a `GATE` row on a sub-720 mock
- **Do not** reveal a drill card's answer or rationale before the learner answers —
  closed-book recall is the whole point of the mode
- **Do not** give hints or allow lookups during a mock, including when asked; decline
  once and continue
- **Do not** report the projected readiness score as if it were measured — it's an
  estimate, and only a mock is evidence
- **Do not** present an analogy without silently tracing it end-to-end first — don't let
  the learner discover where it breaks
- **Do not** compress a high-weight domain for pace; compress only where relevance is LOW
- **Do not** create files in `learner/` or `drills/` beyond the documented structure
