# Agent vs. Workflow vs. Chat: Choosing — F1 Agentic Architecture & Orchestration

**Exam weight: 27%**

## What this session assumes

Agentic Foundations. The learner can
classify a system as agentic; this session is about whether it *should* be.

## Why this domain is worth 27% of your score

This is the single most tested judgment on the Foundations exam, and the most common way
to fail it. The exam deliberately includes scenarios where an agentic architecture is
available, plausible, and wrong — a fixed pipeline is cheaper, more testable, and more
predictable. Candidates who default to "agent" because the exam is about agents lose
points across every scenario. Reaching for the simpler pattern when the steps are known
is a scored skill.

## Session focus

This session is about whether a system *should* be agentic, not whether it is. The crux is the decision rule — **if you can enumerate the steps in advance, a workflow is the better design** — and the bias it exists to correct. The exam deliberately includes scenarios where an agentic architecture is available, plausible, and wrong, so spend real time making the learner argue *against* agents on cases where a fixed pipeline fits the stated constraints. A learner who leaves this session still defaulting to "build an agent" will lose points in every scenario, not just this domain.

## Authoritative sources

**Patterns and when they apply**
- <https://code.claude.com/docs/en/workflows>
- <https://code.claude.com/docs/en/agent-sdk/overview>
- <https://code.claude.com/docs/en/best-practices>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/overview>

**Worked use cases — study the architecture each chose, and why**
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/content-moderation>

**Cost and model implications of the choice**
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>

## Teaching objectives

By the end, the learner can:

- Distinguish the three patterns by their defining property: **conversational** (human
  drives each turn), **workflow** (code drives a known sequence of steps), **agentic**
  (model drives control flow)
- State the decision rule crisply: *if you can enumerate the steps in advance, a workflow
  is the better design* — and defend it on cost, testability, latency, and debuggability
- Recognize hybrid designs, which are the usual right answer in production: a deterministic
  pipeline with one agentic step where judgment is genuinely needed
- Name what you give up by going agentic: reproducibility, bounded cost, straightforward
  unit testing, and clear failure attribution
- Name what you give up by staying deterministic: handling of unforeseen cases, and
  graceful degradation on messy input
- Identify the tells in a scenario that decide it — variance in input shape, whether step
  count is data-dependent, cost ceilings, latency budgets, auditability requirements
- Explain why "prompt routing to one of N fixed handlers" is a workflow, not an agent, and
  why that distinction is scored

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Workflow vs. agentic | Can you enumerate the steps before seeing the input? |
| Full agent vs. agentic step inside a pipeline | Is judgment needed at *one* point or throughout? |
| Conversational vs. agentic | Does a human want to steer each turn, or delegate the whole task? |
| Classification/routing vs. agentic | Is the output a choice from a fixed set, or an open-ended action sequence? |
| Add autonomy vs. add structure | Is the system failing from lack of judgment, or lack of constraint? |

## How to run this session

1. **Frame** — name the trap directly: the exam includes scenarios where agentic is the
   wrong answer, and over-reaching for agents is a top failure mode. Tell them you'll be
   testing for that bias in the drill.
2. **Teach the three patterns** with a concrete example each. Keep the examples close to
   real production work, not toys.
3. **Teach the decision rule** and immediately pressure-test it. Give five one-line system
   descriptions; have the learner classify each and name the deciding tell *before* you
   respond. Include at least two where the intuitive answer is wrong:
   - Invoice data extraction with a fixed output schema → workflow, not agent
   - "Investigate why this deploy failed" → genuinely agentic, step count unknowable
4. **Teach hybrids.** Take one of their "agentic" answers and ask which single step
   actually needed judgment — then rebuild it as a pipeline around that step. Have them
   articulate what improved.
5. **Teach the trade-off ledger** in both directions. Ask them to argue for the pattern
   they *didn't* pick on a scenario of your choosing; this is the reasoning the exam rewards.
6. **Decision table** — walk it, applying each row to a scenario first.
7. **Scenario drill — 5 questions.** Use a document-processing platform ingesting mixed
   PDFs, spreadsheets, and emails, with a stated per-document cost ceiling and an
   auditability requirement. At least two questions must have "build an agent" as a
   *tempting but wrong* answer. Include one multiple-response on what you forfeit by
   going agentic.
8. **Distractor autopsy** — for each miss, name the bias: reaching for capability over
   constraint, or ignoring a stated cost/audit requirement. Log the pattern in the
   session's `Distractor patterns`, since it recurs across the whole exam.
9. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Multi-agent coordination mechanics → Orchestration Patterns
- How to split an agentic task → Task Decomposition
- Model choice within a pattern → Tier 3 session 4 (Solution Design)
- Cost modeling in depth → Tier 3 session 9 (Cost and Latency Optimization)
