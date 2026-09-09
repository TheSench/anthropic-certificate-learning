# Scenario: Support & Escalation — S1

**Foundations scenario archetype 1 of 6 · primary domains F1, F5**

## What this session is

Not a teaching session. This is an **exam-difficulty drill** on one of the six scenario
archetypes the real exam draws from. Tier 1 taught the material; this session tests
whether the learner can apply it under exam conditions and recognize the distractor
patterns.

Teaching happens only in response to a miss.

## Session focus

Drill the support-and-escalation archetype at exam difficulty. The crux is that **the deciding factor is almost never task difficulty** — it's irreversibility, stakes, or a policy requirement. Build at least three questions where a Tier 1 concept rules out an otherwise-attractive option, and weight the set toward F1 and F5. When the learner misses, name the *pattern* rather than the fact: "you escalated on difficulty again" transfers to a different scenario; "the answer was B" doesn't.

## Format

Mirror the real exam's scenario structure:

1. Present a **substantial scenario brief** (250–400 words) up front, containing the
   constraints that decide the answers. Then work questions against it, referring back.
2. **12–15 questions**, mixed multiple-choice and multiple-response. Mark multiple-response
   as "Select all that apply."
3. Ask questions in **batches of 4–5**. Take answers for the whole batch before giving any
   feedback — this trains sustained closed-book reasoning rather than per-question
   coaching.
4. After each batch: score it, then run a **full distractor autopsy** on every question,
   including the ones answered correctly (the learner may have been right for the wrong
   reason — probe that).
5. Domain mix, approximating the real weighting for this archetype: ~6 F1, ~4 F5, ~2 F3,
   ~2 F4.

## Building the scenario brief

Construct a fresh brief each run — do not reuse a previous one verbatim, since the point
is recognition, not recall. It must include:

- A **support product** with a specific domain (fintech, SaaS, healthcare, e-commerce) —
  the domain should change the answers
- **Volume figures** (tickets/day, peak patterns)
- A **cost or budget constraint**, stated numerically
- A **latency expectation** for user-facing responses
- **Tiered action authority** — some actions the agent may take, some it must not
- At least one **compliance or policy requirement** that overrides convenience
- An **integration that fails intermittently**
- A stated **current problem** the architecture must fix

At least three questions must have a *tempting wrong answer that a Tier 1 concept rules
out*. Draw candidate confusions from these known traps:

- Escalating on difficulty rather than irreversibility
- Trusting model self-assessed confidence where a structural trigger is required
- Adding autonomy to fix a harness problem
- Compaction where subagent delegation was correct
- Model-loop retries for transient failures
- An agentic design where a workflow fits the stated constraints
- Broad permissions chosen for convenience

## Question coverage

Across the set, hit these decisions at least once each:

- Escalate vs. ask vs. defer, on a case where the deciding factor is not difficulty
- A structural escalation trigger vs. model judgment
- Escalation handoff contents
- Whether one described component should be agentic at all
- Fork vs. subagent for a specific sub-task
- Context growth over a long conversation
- Tool error classification and where the retry belongs
- Session state durability across an interruption
- A cost or latency constraint that eliminates an otherwise-good option
- One question where **two options are defensible** and the stated constraint breaks the
  tie — then make the learner name the constraint that decided it

## Distractor autopsy requirements

For every question, state:
- The correct answer and the constraint or principle that decides it
- For **each** wrong option: what makes it tempting, and the specific tell that rules it out
- If the learner picked a wrong option, which known trap it maps to — name the pattern, not
  just the error

## How to run this session

1. **Frame** — this is a drill, not a lesson. State the format, that feedback comes per
   batch rather than per question, and that they should not look anything up.
2. Present the scenario brief. Let them read it and ask *clarifying* questions about the
   scenario only (not about the concepts).
3. Run the batches.
4. **Final scoring** — report overall, then per domain:

   ```
   S1 Support & Escalation — [N]/[total] ([%])
   F1 [n]/[n] · F5 [n]/[n] · F3 [n]/[n] · F4 [n]/[n]
   ```

5. Name the **two most transferable weaknesses** revealed, in terms of the decision they'd
   get wrong on a different scenario — this is what the learner takes to the mock.
6. Record per `.agents/TUTORIAL.md` Step 5. Every miss becomes a drill card. Update the F1
   and F5 readiness rows using this session's measured accuracy.

**End of Tier 2 — this runs last, immediately before the gate.** It is the final pass over
F1 and F5 before the mock, which is why it sits here rather than first. Next is the
Foundations mock gate (60 questions, 120 minutes, closed-book). Report readiness across all
five F domains and name the weakest; if any is below 60%, recommend drilling it before
sitting the mock rather than proceeding immediately.

## Out of scope

No broad re-teaching — this is a drill, not a Tier 1 re-run. The one exception is a
**knowledge hole**: if the learner can't explain a concept when asked (as opposed to
misreading a question), stop, re-teach that single concept in 5 minutes, re-drill it, then
resume. See `.agents/TUTORIAL.md` § Teaching inside a drill for the distinction and the
two-per-session cap. Queue the review either way — the inline fix doesn't replace it.
