# Orchestration: Subagents, Forks, Teams — F1 Agentic Architecture & Orchestration

**Exam weight: 27%**

## What this session assumes

Agentic Foundations and Agent vs. Workflow. The learner knows what an agentic loop is and when to choose one.

## Why this domain is worth 27% of your score

Multi-agent orchestration is the densest cluster of scored decisions on the exam, and
"when to fork a session vs. spawn a subagent" is a documented exam question type. These
choices look interchangeable until you look at what each does to *context* — which is the
real axis, and the one the exam tests. Two of the six scenario archetypes (multi-agent
research, developer tooling) are built on this material.

## Session focus

This session covers the orchestration primitives — subagents, forks, agent teams, and deterministic workflows over many agents. The crux is that **context inheritance decides nearly all of these choices**: a fork copies the parent's context down, a subagent withholds it and returns only a conclusion. Teach that shape before naming any pattern, because "when to fork a session vs. spawn a subagent" is a documented exam question type and it is fundamentally a context-budget question, not a capability one. Two of the six scenario archetypes are built on this material, so don't rush it.

## Authoritative sources

Verify current capabilities and naming here — this area of the product moves.

**Subagents and delegation**
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/agents>
- <https://code.claude.com/docs/en/agent-sdk/subagents>

**Sessions, forking, and parallel work**
- <https://code.claude.com/docs/en/sessions>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://code.claude.com/docs/en/agent-teams>
- <https://code.claude.com/docs/en/agent-view>
- <https://code.claude.com/docs/en/worktrees>

**Deterministic multi-agent orchestration**
- <https://code.claude.com/docs/en/workflows>
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>

## Teaching objectives

By the end, the learner can:

- Explain the defining difference between a **fork** (inherits the parent's full context)
  and a **subagent** (starts fresh with only the prompt it's given), and state the
  consequence: forks preserve accumulated understanding, subagents preserve the parent's
  context budget
- Articulate the core economic argument for subagents: the subagent's tool output stays
  out of the parent's window, so the parent keeps only the conclusion
- Choose correctly between: single agent, subagent fan-out, fork, agent team, and a
  deterministic workflow orchestrating many agents
- Explain **why fan-out requires independence** — tasks sharing mutable state or needing
  each other's results sequentially must not be parallelized
- Design a lead/worker split: what the lead keeps (plan, synthesis, final judgment) vs.
  what workers get (a self-contained task and the context to do it)
- Describe the **hub-and-spoke** shape the coordinator actually enforces: subagents talk
  to the coordinator, never to each other. Name what routing everything through the hub
  buys — one place to observe the system, one error-handling policy, and controlled
  information flow — and what a mesh of agents talking directly would cost in all three
- Configure a subagent through its **definition**: a description saying when it applies, a
  system prompt, and its own tool restrictions. Each subagent is declared, not improvised
- Write the coordinator's delegation prompt to specify **goals and quality criteria rather
  than procedural steps**, so the subagent can adapt to what it finds; a step-by-step
  script wastes the judgment you delegated for
- Spawn subagents **in parallel by emitting multiple Task calls in a single response** —
  issuing them across separate turns serializes the work and forfeits the latency win
- Distribute tools **per subagent by role**, and explain why that beats one shared surface:
  - Handing every agent all the tools degrades selection — the reliability cost of a large
    surface (a dozen-plus tools where four or five would do) lands on every call
  - An agent holding tools outside its specialization will eventually misuse them — a
    synthesis agent that can search the web starts searching instead of synthesizing
  - Where one role genuinely needs a neighbor's capability often, give it a **narrow,
    scoped version** of that tool rather than the general one, and route the rare complex
    case back through the coordinator
- Recognize **over-narrow decomposition** as the coordinator's signature failure: splitting
  a broad question into subtasks so specific that their union no longer covers it. The
  remedy is partitioning scope deliberately — distinct subtopics or source types per agent
  — and then checking the synthesis for gaps
- Run an **iterative refinement loop** at the coordinator: evaluate the synthesis for
  coverage holes, re-delegate targeted follow-ups, and re-synthesize — rather than treating
  the first pass as final
- Identify orchestration anti-patterns: delegating work whose result the parent needs in
  full detail, spawning agents that duplicate each other's searches, chains deep enough
  that the original intent is lost by the bottom
- Explain why parallel agents editing the same files need isolation (worktrees) and what
  breaks without it
- Name the mechanism that makes delegation possible in the Agent SDK: subagents are
  spawned via the **Task tool**, so a coordinator's **`allowedTools`** must include
  `"Task"` or it silently cannot delegate at all. Distinguish this SDK-level
  `allowedTools` from the **`allowed-tools`** key in `SKILL.md` frontmatter — different
  layers, different syntax, and each subagent still needs its own tool grant
- State when orchestration cost exceeds its benefit — the coordination overhead is real,
  and a single agent is often correct

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Fork vs. subagent | Does the child need what the parent has learned, or just a task? |
| Subagent vs. do it inline | Would the tool output bloat the parent's context without adding value to it? |
| Parallel fan-out vs. sequential | Are the tasks truly independent, or does one need another's result? |
| Agent team vs. subagents | Does the work need persistent peers, or one-shot delegation? |
| Model-driven delegation vs. deterministic workflow | Is the *set* of subtasks knowable up front? |
| Isolate in a worktree vs. shared tree | Will agents write to overlapping files? |
| Shared tool surface vs. per-role grants | Would any agent misuse a tool outside its job? |
| Scoped cross-role tool vs. route through the coordinator | Is the need frequent, or occasional and complex? |
| Accept the synthesis vs. re-delegate | Does the output actually cover the question asked? |

## How to run this session

1. **Frame** — name that fork-vs-subagent is a known exam question type, and that context
   is the axis that decides nearly all of these.
2. **Teach context inheritance first**, before any pattern names. Draw the two shapes:
   parent context copied down (fork) vs. parent context withheld and only a conclusion
   returned (subagent). Then ask them to predict which to use for: "continue this
   debugging session down a second hypothesis" (fork) and "search 200 files for every
   caller of this API" (subagent). Check before proceeding.
3. **Teach the fan-out pattern** and its independence precondition. Give a task that
   *looks* parallelizable but isn't (each step needs the prior step's output) and have
   them spot it.
4. **Teach lead/worker division of labor.** Have the learner draft the worker prompt for
   a concrete task, then critique it against one test: could a fresh agent with no other
   context complete this? That test is the whole skill.
5. **Teach the coordinator's own failure modes**, which are distinct from the shape
   choices above. Hand the learner a broad research question and have them write the
   decomposition; most produce subtasks whose union doesn't cover the question, which is
   the teaching moment — then have them partition by subtopic or source type instead.
   Follow with the loop: how would the coordinator *know* the synthesis has a hole, and
   what does it do about it? Close on the delegation prompt — goals and quality criteria,
   not procedural steps — and the single-response parallel Task emission.
6. **Teach tool distribution across agents.** Give a four-agent research pipeline and one
   pooled surface of a dozen-plus tools, and ask what goes wrong. Drive to two separate
   costs: degraded selection for everyone, and specialization breakdown (the synthesis
   agent that searches instead of synthesizing). Then have them assign tools per role, and
   handle the agent that needs a neighbor's capability often — a narrow scoped version,
   with complex cases routed through the coordinator.
7. **Teach the anti-patterns** by having them diagnose, not by listing. Present three
   broken orchestrations and ask what's wrong with each.
8. **Teach isolation** — parallel writes, worktrees, and what a conflict looks like.
9. **Decision table** — walk all nine rows, scenario-first.
10. **Scenario drill — 6 questions.** Use a competitive-analysis system: gather data on 12
    competitors, analyze each along 5 dimensions, then synthesize one report. Ask about
    fan-out shape, fork vs. subagent for a follow-up investigation, what the lead retains,
    which step must not be parallelized, where isolation is needed, and one on tool
    distribution or a synthesis that came back with gaps. Include one multiple-response.
11. **Distractor autopsy.** Expect over-orchestration as the dominant temptation — more
    agents where one would do — and a shared tool surface defended as "simpler".
12. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Decomposition method itself → Task Decomposition
- Context window mechanics and compaction → Context Management
- Session state persistence and recovery → Reliability & Escalation
- Enterprise-scale orchestration economics → Tier 3 sessions 5 and 9
