# Task Decomposition: Fixed Pipelines vs. Adaptive Plans — F1 Agentic Architecture & Orchestration

**Exam weight: 27% (highest of any Foundations domain)**

*Owns § 6 task statement 1.6 — Design task decomposition strategies for complex workflows.*

## What this session assumes

Session 1 only. The learner knows the agentic loop, the three properties that make a
system agentic, harness vs. model, and how a loop terminates on `stop_reason`. They have
not yet met subagents, the Task tool, or any orchestration primitive — deliberately.
Decomposition is the question of *what the pieces are*; session 3 is the question of *who
runs them*. Teach the split before the machinery, and do not reach forward for subagent
vocabulary to explain it.

## Why this domain is worth 27% of your score

F1 is the largest domain on Foundations, and 1.6 is the task statement that decides
whether the learner reads a scenario correctly before they start designing. The exam
rarely asks "how would you decompose this?" — it hands you a task and a proposed split
and asks whether the split matches the work. Almost every wrong answer in this family is
a split that would run: it is structurally fine and wrong about the *shape* of the
problem, usually by fixing the steps in advance when the steps depend on what the first
step finds, or by spending an adaptive loop on work whose stages were knowable from the
start.

## Session focus

This session teaches the one distinction 1.6 is written around: **fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition based on intermediate findings**, and how to pick between them. That dichotomy is the crux — spend disproportionate time on it and on the tell that decides it, which is whether the shape of the work is knowable *before you see the data*. Prompt chaining fixes the steps in advance and buys determinism, testability, and bounded cost; adaptive decomposition lets the loop generate subtasks from what each step discovers, and buys the ability to handle work whose structure only emerges as you explore it. The two named worked forms — per-file passes plus a cross-file integration pass to avoid attention dilution, and map-structure-then-prioritize-then-adapt — are where the exam actually scores this, so teach them as concrete patterns with names, not as illustrations. Everything else in this session, including the four tests of a well-formed subtask, is subordinate diagnostic tooling used *inside* whichever mode was chosen.

## Authoritative sources

Fetch these to verify current behavior before teaching specifics.

**Prompt chaining and fixed pipelines**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices> — § agentic systems
- <https://code.claude.com/docs/en/workflows>

**Adaptive decomposition and planning**
- <https://code.claude.com/docs/en/common-workflows>
- <https://code.claude.com/docs/en/best-practices>
- <https://platform.claude.com/docs/en/managed-agents/define-outcomes>

**Decomposition over large codebases**
- <https://code.claude.com/docs/en/large-codebases>

## Teaching objectives

By the end, the learner can:

- Name and define **prompt chaining**: a fixed sequential pipeline that breaks work into
  focused steps, each step's output feeding the next, with the step sequence decided
  before any data is seen. Use the guide's term — "prompt chaining" is § 17 in-scope
  vocabulary and the learner must recognize it verbatim on the exam
- State what prompt chaining buys: each step gets a smaller, more focused instruction and
  a smaller context, the pipeline is unit-testable step by step, cost is bounded and
  predictable, and a failure is attributable to a specific step
- Define **dynamic adaptive decomposition**: the loop chooses the next subtask based on
  intermediate findings, so the set of subtasks is not knowable in advance. Build
  **adaptive investigation plans that generate subtasks based on what is discovered at
  each step**
- Choose between the two on the deciding tell: *is the shape of the work knowable before
  you see the data?* If yes, fix the steps; if the second step depends on what the first
  one finds, do not pretend otherwise
- Apply the per-file / cross-file pattern: **split a large code review into per-file local
  analysis passes plus a separate cross-file integration pass, to avoid attention
  dilution**. Say precisely what goes wrong without the split — one pass over everything
  dilutes attention across the whole corpus and surfaces neither the local defects nor the
  cross-cutting ones — and why the integration pass must be *separate* rather than folded
  into the last file's pass. Use the term **attention dilution** by name
- Apply the open-ended pattern: **decompose an open-ended task by first mapping structure,
  then identifying high-impact areas, then creating a prioritized plan that adapts as
  dependencies are discovered**. Name the three moves in order — map, prioritize, adapt —
  and say why mapping comes first: you cannot prioritize a structure you have not seen
- Recognize the hybrid, which is common in production: a fixed outer chain with one
  adaptive stage inside it, or an adaptive plan whose individual subtasks are themselves
  fixed chains
- Detect hidden dependencies in a proposed split — shared mutable state, an ordering
  requirement, or a subtask whose instructions silently assume something only the parent
  knows
- Recognize **over-decomposition** (splitting so finely that re-establishing context costs
  more than the work) and **under-decomposition** (one unit whose context requirements
  exceed what it can hold), and name the tell for each
- Decide where verification sits: inside each subtask, as a separate verifying pass, or at
  the synthesis step — and defend the choice against "could this subtask be wrong in a way
  the synthesis would not catch?"
- Use the **four tests of a well-formed subtask** — self-contained, verifiable, bounded,
  independent — as a diagnostic checklist when auditing a proposed split. Say plainly that
  this is a curriculum aid, not exam vocabulary: it will not appear on the exam by that
  name, and the learner should never write it as an answer. It earns its place only as a
  fast way to locate *which* thing is wrong with a split the exam has asked them to judge

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Prompt chaining vs. adaptive decomposition | Is the step sequence knowable before you see the data? |
| One pass over everything vs. per-unit passes | Would a single pass dilute attention across the corpus? |
| Fold integration into the last pass vs. a separate cross-file pass | Does the finding span units no single pass sees together? |
| Map-then-plan vs. plan immediately | Do you already know the structure, or must you discover it? |
| Fixed plan vs. plan that re-prioritizes | Do dependencies surface as you go? |
| Sequential steps vs. independent partitions | Does any subtask consume another's output? |
| Verify per-subtask vs. at synthesis | Could a subtask be wrong in a way synthesis would not catch? |

## How to run this session

1. **Frame** — this session owns 1.6, and 1.6 is written around one dichotomy. Name it in
   the first minute: fixed sequential pipelines (prompt chaining) vs. dynamic adaptive
   decomposition. Say that the rest of the session hangs off it.
2. **Teach prompt chaining first**, by name and concretely. Walk a real three-step chain
   (extract → classify → draft) and have the learner say what each step's context contains
   and what it does not. Then ask what breaks if step two's output is malformed — the
   answer that the failure is *attributable to a step* is the point.
3. **Teach adaptive decomposition** against the same task shape. Give an investigation
   ("find out why checkout latency regressed last week") where step two is unknowable
   until step one returns, and have them try to write it as a fixed chain. Let them fail
   at it; the failure is the lesson.
4. **Drill the choice, not the definitions.** Give at least four one-line task
   descriptions and have the learner call fixed-or-adaptive and name the tell before you
   confirm. Include one hybrid so "both" is a live answer.
5. **Teach the code-review pattern explicitly.** Hand them a 60-file pull request and a
   proposal to review it in one pass. Drive to attention dilution by name, then to the
   per-file passes, then ask the harder question: where does an inconsistency between two
   files get caught? That question produces the separate cross-file integration pass, and
   it should come from the learner, not from you. This pattern is directly tested — do not
   compress it.
6. **Teach the open-ended pattern explicitly.** Give a genuinely open brief ("improve this
   service's reliability") and ask for their first move. Most will start proposing fixes;
   the teaching moment is that mapping the structure comes first, then identifying
   high-impact areas, then a prioritized plan that adapts as dependencies surface. Then ask
   what makes the plan *adaptive* rather than just a list.
7. **Teach dependency detection.** Give a split that looks parallel but has one subtask
   depending on another's write. Have them find it and propose a fix.
8. **Teach both failure directions** — over- and under-decomposition — with one concrete
   example of each, and ask for the tell that tells them apart.
9. **Introduce the four tests as a checklist**, briefly and last. Label it out loud as a
   curriculum aid, not exam vocabulary. Then use it once: hand them a proposed 5-way split
   with exactly one defective subtask and have them locate the defect. One pass is enough
   — this is a tool, not the subject.
10. **Decision table** — walk the table above, scenario-first: give the scenario, take
    their call, then confirm.
11. **Scenario drill — 5 questions.** Use a large legacy migration: audit a 400-file
    codebase for a deprecated API, plan replacements, apply them, verify nothing broke.
    Ask which stages are chainable and which must be adaptive, where the cross-file pass
    belongs, what the map-prioritize-adapt sequence looks like for this brief, and which
    proposed subtask hides a dependency. Include one multiple-response.
12. **Distractor autopsy** on all five. Expect two dominant temptations: a fixed pipeline
    proposed for work whose steps depend on intermediate findings, and an adaptive loop
    proposed where the stages were knowable and a chain would have been cheaper and
    testable. Name both tells.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

Defer and say where it's covered:

- Subagents, the Task tool, coordinator patterns, and who *executes* the subtasks →
  session 3. Decomposition decides what the pieces are; session 3 decides who runs them.
- Crash recovery and state manifests → session 7
- Context window mechanics, token budgets, and summarization → session 6
- Structured output and per-step schema enforcement → session 11
- Multi-pass review architectures and batch processing at scale → session 13. This session
  teaches *why* a review splits into passes; session 13 teaches the architectures.
- Decomposition axes as a taxonomy (by phase / data partition / dimension / component) —
  not blueprint material. If the learner reaches for it, acknowledge it as a way to
  describe a split and return to the fixed-vs-adaptive question, which is what is scored.
