# Scenario: Multi-Agent Research — S3

**Foundations scenario archetype 3 of 6 · primary domains F1, F5**

## What this session is

An **exam-difficulty drill** on the multi-agent research archetype. Not a teaching
session — Tier 1 sessions 1–4 and 14 taught this. Teach only on a miss.

This archetype carries the heaviest F1 weighting of the six, and F1 is 27% of the exam.
It is the highest-value drill in Tier 2.

## Format

1. **Scenario brief** (250–400 words) with the deciding constraints.
2. **12–15 questions**, mixed multiple-choice and multiple-response ("Select all that apply").
3. Batches of 4–5; no feedback mid-batch.
4. Full distractor autopsy on every question, correct ones included.
5. Domain mix: ~8 F1, ~3 F5, ~2 F4, ~2 F3.

## Building the scenario brief

Fresh each run. Must include:

- A **research task** with real breadth — many sources, several analytical dimensions, one
  synthesized deliverable
- **Scale figures** — how many items, sources, or dimensions
- A **dependency** between two phases, so naive full parallelization is wrong
- A **cost ceiling** and a **deadline**
- A requirement that the final output be **traceable to sources**
- A stated **current failure** — e.g. agents duplicating each other's searches, the lead
  running out of context before synthesis, or results that can't be attributed

## Question coverage

At least once each:

- The decomposition axis, given the stated constraints
- Which proposed subtask violates which well-formed-subtask test
- Fork vs. subagent for a specific follow-up investigation
- What the lead retains vs. delegates
- Which step must **not** be parallelized, and why
- Context budget: why the lead degrades, and the correct fix
- Whether a described step needs an agent at all
- What a worker's delegation prompt must contain to pass the fresh-agent test
- A subagent failure: retry, degrade, or escalate
- Traceability of synthesized output back to sources
- One question where **two decompositions are defensible** and a stated constraint decides it

## Known traps to build distractors from

- Over-orchestration — more agents where fewer would do
- Parallelizing across a real dependency
- Compaction of the lead's context where delegation was the fix
- A subtask that's elegant but unverifiable
- Delegating work whose full detail the parent actually needs
- Chains deep enough that original intent is lost
- Parallel agents writing overlapping files without isolation
- Treating the lead's context exhaustion as a window-size problem

## Distractor autopsy requirements

Per question: correct answer plus the deciding principle; per wrong option, what makes it
tempting and the tell that rules it out; per miss, the named trap.

For decomposition questions, make the learner name **which of the four tests**
(self-contained, verifiable, bounded, independent) their answer turns on. That's the
transferable form.

## How to run this session

1. **Frame** — highest-value drill in Tier 2, because F1 is 27%. Say so.
2. Present the brief; scenario-clarifying questions only.
3. Run the batches with autopsies.
4. **Final scoring:**

   ```
   S3 Multi-Agent Research — [N]/[total] ([%])
   F1 [n]/[n] · F5 [n]/[n] · F4 [n]/[n] · F3 [n]/[n]
   ```

5. Name the two most transferable weaknesses. Given F1's weight, an F1 accuracy below 75%
   here should be called out as the primary risk to passing, with a recommendation to drill
   before the gate.
6. Record per `.agents/TUTORIAL.md` Step 5. Misses become drill cards; update F1 and F5
   readiness from measured accuracy.

## Out of scope

No new teaching. Genuine gaps get queued as review sessions.
