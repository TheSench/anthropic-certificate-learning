# Task Decomposition & Delegation — F1 Agentic Architecture & Orchestration

**Exam weight: 27%**

## What this session assumes

Agentic Foundations through Orchestration Patterns. The learner knows the orchestration primitives; this session is the
analytical skill of splitting work so those primitives apply cleanly.

## Why this domain is worth 27% of your score

Task analysis and decomposition strategy is named explicitly in the F1 domain
description. On the exam it shows up as: here is a large task and a proposed split —
is the split correct? Bad decomposition is the root cause behind most multi-agent
failures, and the exam's wrong answers are usually plausible-looking splits with a
hidden dependency or an unverifiable subtask.

## Session focus

This session is the analytical skill of splitting work so the orchestration primitives apply cleanly. The crux is the **four tests of a well-formed subtask** — self-contained, verifiable, bounded, independent — and the exam form is: here's a proposed split, what's wrong with it? Spend the session's weight on having the learner find the violated test rather than on the taxonomy of axes. Decomposition determines the orchestration pattern, so a bad split can't be rescued by a better pattern, which is exactly why it's tested directly.

## Authoritative sources

**Decomposition and delegation in practice**
- <https://code.claude.com/docs/en/common-workflows>
- <https://code.claude.com/docs/en/best-practices>
- <https://code.claude.com/docs/en/large-codebases>
- <https://code.claude.com/docs/en/sub-agents>

**Deterministic orchestration of decomposed work**
- <https://code.claude.com/docs/en/workflows>
- <https://code.claude.com/docs/en/agent-sdk/agent-loop>

**Planning and outcome definition**
- <https://platform.claude.com/docs/en/managed-agents/define-outcomes>

## Teaching objectives

By the end, the learner can:

- Apply the four tests of a well-formed subtask: **self-contained** (completable without
  the parent's context), **verifiable** (you can tell whether it succeeded), **bounded**
  (a knowable cost ceiling), **independent** (no hidden coupling to a sibling)
- Distinguish decomposition axes and choose deliberately: by **phase** (research →
  design → implement → verify), by **data partition** (same operation over many items),
  by **dimension** (many analyses over the same material), by **component** (separate
  modules)
- Detect hidden dependencies — shared mutable state, ordering requirements, and
  subtasks whose prompts implicitly assume something only the parent knows
- Write a delegation prompt that carries its own context: the task, the constraints, the
  output shape expected, and the definition of done — **explicit context passing**, since
  a subagent inherits nothing the parent does not hand it
- Persist subtask state structurally so a long run survives interruption: a **manifest**
  recording what was dispatched, what returned, and what is outstanding, enabling
  **crash recovery** without redoing completed work
- Recognize over-decomposition — splitting so finely that coordination and context
  re-establishment cost more than the work
- Recognize under-decomposition — one agent holding a task whose context requirements
  exceed a single window
- Decide where verification sits: inside each subtask, as a separate verifying pass, or
  at the synthesis step — and defend the choice
- Explain how the decomposition determines the *orchestration* pattern, not the reverse

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which axis to split on | What varies across the work — the stage, the data, or the lens? |
| Decompose vs. keep whole | Does the whole task's context fit, and is it one coherent judgment? |
| Verify per-subtask vs. at synthesis | Can a subtask's output be wrong in a way synthesis wouldn't catch? |
| Pass full context vs. a summary | Does the subtask need the reasoning, or just the conclusion? |
| Sequential phases vs. parallel partitions | Does any subtask consume another's output? |

## How to run this session

1. **Frame** — decomposition decides the orchestration, so a bad split can't be rescued by
   a better pattern. That's why it's tested directly.
2. **Teach the four tests** one at a time. After all four, give a proposed 5-way split of a
   real task with exactly one subtask that fails exactly one test, and have the learner find
   it. Repeat with a different failing test. This is the core drill of the session.
3. **Teach the axes** with a single large task decomposed four different ways — same task,
   four splits — and ask which is best for a stated constraint, then change the constraint
   and re-ask. This teaches that the axis follows the constraint.
4. **Teach hidden-dependency detection.** Give a split that looks parallel but has one
   subtask silently depending on another's write. Ask them to find it and propose a fix.
5. **Teach delegation prompt writing.** Have the learner write one, then apply the
   fresh-agent test: hand it back with the parent context stripped and ask whether it's
   still completable. Iterate once.
6. **Teach both failure directions** — over- and under-decomposition — with a concrete
   example of each, and ask for the tell that distinguishes them.
7. **Decision table** — walk it, scenario-first.
8. **Scenario drill — 5 questions.** Use a large legacy migration: audit a 400-file
   codebase for a deprecated API, plan replacements, apply them, verify nothing broke.
   Ask about axis choice, which proposed subtask violates which test, where verification
   belongs, and what the delegation prompt must include. Include one multiple-response on
   the well-formed-subtask tests.
9. **Distractor autopsy** — the tempting wrong answers here are splits that are elegant
   but unverifiable, and splits that ignore a stated ordering requirement.
10. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Orchestration primitives themselves → Orchestration Patterns
- Tool design for subtasks → Tool Design
- Context budgeting math → Context Management
- Enterprise program-level decomposition → Tier 3 session 5
