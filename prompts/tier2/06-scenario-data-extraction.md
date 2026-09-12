# Scenario: Structured Data Extraction — S6

**Foundations scenario archetype 6 of 6 · primary domains F3, F5**

## What this session is

An **exam-difficulty drill** on the structured-extraction archetype. Not a teaching
session — the three F3 sessions taught the core, with Tool Design and Context Management
supporting. Teach only on
a miss.

The archetype's signature theme is the gap between **asking for structure and guaranteeing
it**, and what the pipeline does about the residual failures. Verify current
structured-output support, batch limits, and pricing multipliers against live docs
(`platform.claude.com/docs/en/build-with-claude/structured-outputs`,
`.../batch-processing`, `.../prompt-caching`, `.../citations`) before writing questions
that turn on a number.

## Session focus

Drill the structured-extraction archetype. The crux is the gap between **asking for structure and guaranteeing it** — on approach-choice items, make the learner name the *guarantee* each option provides, because that word is the entire discrimination in this domain. The archetype's signature question is a pipeline silently inventing plausible values for fields genuinely absent from the source. Verify structured-output support and any figures from live docs before writing questions that turn on a number.

## Format

1. **Scenario brief** (250–400 words) with the deciding constraints.
2. **12–15 questions**, mixed multiple-choice and multiple-response ("Select all that apply").
3. Batches of 4–5; feedback only at batch end.
4. Full distractor autopsy on every question.
5. Domain mix: ~7 F3, ~5 F5, ~2 F4, ~1 F1. The guide names Context Management &
   Reliability the second primary domain for this archetype — confidence routing, review
   sampling, and long-document handling are all F5 — so it outweighs Tool Design here.

## Building the scenario brief

Fresh each run. Must include:

- A **source corpus** of genuinely messy input (scanned PDFs, emails, chat logs,
  inconsistent spreadsheets) with a **volume figure**
- A **downstream consumer** that breaks on malformed data — name the consequence
- A stated **accuracy requirement**, numerically
- A **human review queue** with a stated capacity limit
- A **cost ceiling** and a **turnaround expectation** (one of which should permit batch)
- Fields that are **sometimes genuinely absent** from the source
- An **auditability requirement** — someone must verify an extraction against its source
- A stated **current failure** — e.g. the pipeline silently invents plausible values for
  missing fields, or malformed JSON reaches the consumer

That second-to-last failure is the archetype's signature question, and the most
consequential idea in the domain.

## Question coverage

At least once each:

- Prompt-and-parse vs. tool schema vs. native structured output, against the stated
  downstream requirement
- Handling a genuinely absent field — explicit null vs. omission vs. what the model does
  unprompted
- Schema design critique: nesting, enums, optionality
- The validation and retry ladder, including the ceiling and what happens after it
- Whether the retry prompt includes the validation error
- Batch vs. synchronous, against the stated turnaround and volume
- Caching applicability for a repeated extraction prefix
- Cost arithmetic against the ceiling, and the lever that closes a gap
- Provenance and citations for auditability
- Routing to the human queue without exceeding its capacity
- **Field-level confidence** as the routing signal, and **calibrating** it against a
  labeled validation set rather than trusting the raw score
- **Stratified sampling** to measure the error rate, and segmenting accuracy by document
  type and field rather than reporting one aggregate number
- Splitting one complex extraction into multiple passes
- One question where **two approaches are defensible** and a stated constraint decides it

## Known traps to build distractors from

- "Prompt it more firmly" where schema enforcement is required
- Letting a required field be filled with a plausible invention
- Unbounded retries, or retries that don't feed back the error
- Batch chosen for a path with a user waiting, or rejected for a nightly path
- Streaming proposed as a throughput or cost fix
- Sending everything ambiguous to human review, exceeding the stated queue capacity
- A deeply nested schema where a flat one would fill more reliably
- Ignoring the auditability requirement when choosing an approach

## Distractor autopsy requirements

Per question: correct answer plus deciding principle; per wrong option, the temptation and
the ruling tell; per miss, the named trap.

For approach-choice questions, make the learner name the **guarantee** each option
provides. That word is the whole discrimination in this domain.

## How to run this session

1. **Frame** — drill format, batch feedback, closed-book. Note the guarantee theme.
2. Verify structured-output support and any figures from live docs before writing questions.
3. Present the brief; scenario-clarifying questions only.
4. Run the batches with autopsies.
5. **Final scoring:**

   ```
   S6 Structured Data Extraction — [N]/[total] ([%])
   F3 [n]/[n] · F5 [n]/[n] · F4 [n]/[n] · F1 [n]/[n]
   ```

6. Name the two most transferable weaknesses.
7. Record per `.agents/TUTORIAL.md` Step 5. Misses become drill cards; update F3 and F4
   readiness. Log any doc discrepancy found while verifying.

## Out of scope

No broad re-teaching — this is a drill, not a Tier 1 re-run. The one exception is a
**knowledge hole**: if the learner can't explain a concept when asked (as opposed to
misreading a question), stop, re-teach that single concept in 5 minutes, re-drill it, then
resume. See `.agents/TUTORIAL.md` § Teaching inside a drill for the distinction and the
two-per-session cap. Queue the review either way — the inline fix doesn't replace it.
