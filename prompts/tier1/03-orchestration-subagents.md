# Coordinator-Subagent Orchestration and the Task Tool — F1 Agentic Architecture & Orchestration

**Exam weight: 27% (highest of any Foundations domain)**

*Owns § 6 task statements 1.2 — Orchestrate multi-agent systems with coordinator-subagent
patterns — and 1.3 — Configure subagent invocation, context passing, and spawning.*

## What this session assumes

Sessions 1 and 2. From session 1: the agentic loop, harness vs. model, `stop_reason`, and
`allowedTools` as the harness's grant of what an agent may call. From session 2: the
fixed-vs-adaptive decomposition question and what a well-formed piece of work looks like.
This session is where those pieces get *executed by someone other than the parent* — so
the learner must already be able to produce a decomposition before they are asked to
delegate one.

## Why this domain is worth 27% of your score

F1 is the largest domain on Foundations, and multi-agent orchestration is its densest
cluster of scored decisions — two task statements land here, and two of the six scenario
archetypes (multi-agent research, developer productivity tooling) are built on this
material. "When to fork a session vs. spawn a subagent" is a documented exam question
type, and it looks like a capability question until you notice it is entirely a question
about *context*. Candidates who cannot say what a subagent can and cannot see lose points
across every scenario that has more than one agent in it.

## Session focus

This session teaches the coordinator-subagent shape and the mechanics of invoking a subagent: the `AgentDefinition`, the Task tool, `allowedTools`, `fork_session`, what crosses the boundary in each direction. The crux is **hub-and-spoke context isolation** — a subagent's context is isolated, so anything it needs must be in the prompt it is given, and everything it learns returns only through the coordinator. Spend disproportionate time there, and teach that shape *before* naming any pattern, because nearly every choice in this session resolves to it: fork vs. subagent is that shape applied to inheritance, what the delegation prompt must carry is that shape applied downward, and provenance and attribution are that shape applied to the return path. Get the learner reasoning from "what can this agent actually see?" and the patterns become derivations rather than memorized lists.

## Authoritative sources

Verify current capabilities and naming here — this area of the product moves.

**Subagents, definitions, and delegation**
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/agents>
- <https://code.claude.com/docs/en/agent-sdk/subagents>

**Sessions and forking**
- <https://code.claude.com/docs/en/sessions>
- <https://code.claude.com/docs/en/agent-sdk/sessions>

**Multi-agent orchestration**
- <https://code.claude.com/docs/en/workflows>
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>

## Teaching objectives

By the end, the learner can:

- Explain the defining difference between a **fork** (inherits the parent's full context)
  and a **subagent** (starts fresh with only the prompt it is given), and state the
  consequence: forks preserve accumulated understanding, subagents preserve the parent's
  context budget
- Name the fork mechanism by its identifier: **`fork_session`**, which branches a session
  so the branch carries the parent's context without contaminating the parent with what
  the branch goes on to do. § 17 lists `fork_session` in scope under both Claude Code and
  session management — the learner must recognize the identifier, not only the concept
- Articulate the core economic argument for subagents: the subagent's tool output stays
  out of the parent's window, so the parent keeps only the conclusion
- Describe the **hub-and-spoke** shape the coordinator enforces: subagents talk to the
  coordinator, never to each other. Name what routing everything through the hub buys —
  one place to observe the system, one error-handling policy, controlled information flow
  — and what a mesh of agents talking directly would cost in all three
- Configure a subagent through its **`AgentDefinition`** — the Agent SDK type that
  declares a subagent: a description saying when it applies, a system prompt, and its own
  tool restrictions. Each subagent is *declared*, not improvised. § 17 lists "agent
  definitions" in scope and § 6 1.3 names the type; use the identifier verbatim
- Name the mechanism that makes delegation possible: subagents are spawned via the **Task
  tool**, so a coordinator's **`allowedTools`** must include `"Task"` or it silently
  cannot delegate at all. Distinguish this SDK-level `allowedTools` from the
  `allowed-tools` key in `SKILL.md` frontmatter — different layers, different syntax, and
  each subagent still needs its own tool grant
- Spawn subagents **in parallel by emitting multiple Task calls in a single response** —
  issuing them across separate turns serializes the work and forfeits the latency win
- Choose **dynamic subagent selection** over routing every request through the full
  pipeline: with a set of declared subagents, the coordinator selects *per request* the
  ones the request actually needs, rather than running every stage every time. State both
  sides — dynamic selection saves the cost and latency of stages that do not apply and
  keeps irrelevant output out of the coordinator's window; the full fixed pipeline buys
  uniformity and predictable cost. The tell is whether requests genuinely vary in which
  capabilities they need
- Pass context **downward** correctly, which is the whole of 1.3's first half: a subagent
  inherits nothing, so the prompt must carry the task, the constraints, the expected
  output shape, and the definition of done. Where a subagent's work depends on what an
  earlier agent already established, **include the complete findings from those prior
  agents directly in the subagent's prompt** — do not reference them, do not assume a
  shared history, and do not send a pointer the subagent has no way to follow
- Pass context **upward** with attribution, which is 1.3's second half: use **structured
  content/metadata separation** so a returned finding carries where it came from —
  source URLs, document names, page numbers — alongside the content itself, rather than
  prose with citations melted into it. State why the structure matters: the coordinator
  synthesizes across agents that never saw each other's sources, so unattributed content
  arrives indistinguishable from every other agent's, and a claim whose origin was lost at
  the boundary cannot be re-checked afterward
- Write the coordinator's delegation prompt to specify **goals and quality criteria rather
  than procedural steps**, so the subagent can adapt to what it finds; a step-by-step
  script wastes the judgment you delegated for
- Design a lead/worker split: what the lead keeps (plan, synthesis, final judgment) vs.
  what workers get (a self-contained task and the context to do it)
- Explain **why fan-out requires independence** — tasks sharing mutable state or needing
  each other's results sequentially must not be parallelized
- Recognize **over-narrow decomposition** as the coordinator's signature failure: splitting
  a broad question into subtasks so specific that their union no longer covers it. The
  remedy is partitioning scope deliberately — distinct subtopics or source types per agent
  — and then checking the synthesis for gaps
- Run an **iterative refinement loop** at the coordinator: evaluate the synthesis for
  coverage holes, re-delegate targeted follow-ups, and re-synthesize — rather than
  treating the first pass as final
- Identify orchestration anti-patterns: delegating work whose result the parent needs in
  full detail, spawning agents that duplicate each other's searches, chains deep enough
  that the original intent is lost by the bottom
- Choose correctly between single agent, subagent fan-out, `fork_session`, and a
  deterministic workflow orchestrating many agents — and state when orchestration cost
  exceeds its benefit, because a single agent is often correct

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Fork (`fork_session`) vs. subagent | Does the child need what the parent has learned, or just a task? |
| Subagent vs. do it inline | Would the tool output bloat the parent's context without adding value to it? |
| Dynamic subagent selection vs. the full fixed pipeline | Do requests genuinely differ in which capabilities they need? |
| Parallel fan-out vs. sequential | Are the tasks truly independent, or does one need another's result? |
| Full findings in the prompt vs. a reference | Can the subagent reach anything you did not hand it? (No.) |
| Structured attribution vs. prose | Will the coordinator need to say where a claim came from? |
| Goals-and-criteria vs. procedural steps | Are you delegating judgment, or execution? |
| Model-driven delegation vs. deterministic workflow | Is the *set* of subtasks knowable up front? |
| Accept the synthesis vs. re-delegate | Does the output actually cover the question asked? |

## How to run this session

1. **Frame** — this session owns two task statements, and fork-vs-subagent is a known exam
   question type. Say that context is the axis that decides nearly all of it.
2. **Teach context isolation first**, before any pattern names. Draw the two shapes:
   parent context copied down (`fork_session`) vs. parent context withheld and only a
   conclusion returned (subagent). Then ask them to predict which to use for "continue this
   debugging session down a second hypothesis" (fork) and "search 200 files for every
   caller of this API" (subagent). Check before proceeding.
3. **Teach the invocation mechanics** concretely, with the identifiers. Walk an
   `AgentDefinition` — description, system prompt, tool restrictions — and say what each
   field decides. Then the Task tool and `allowedTools` needing `"Task"`, and the failure
   that teaches it: a coordinator that silently cannot delegate. Then parallel emission in
   a single response. Have them name each identifier back to you before moving on; these
   are recognition items on the exam.
4. **Teach downward context passing** as the consequence of isolation. Have the learner
   draft a worker prompt for a concrete task, then apply one test: could a fresh agent with
   no other context complete this? Then raise the harder case — a subagent whose work
   depends on what a prior agent found — and drive to including those complete findings
   directly in the prompt. Ask what a reference to "the earlier analysis" would do here.
   The answer is nothing; the subagent cannot see it.
5. **Teach upward attribution.** Give a synthesis assembled from three research subagents
   where one claim is wrong and ask the learner to find which agent produced it. If the
   returns were prose, they cannot. That is the motivation for structured
   content/metadata separation — content in one field, source URLs, document names, and
   page numbers in another — and it should land as a felt need rather than a rule.
6. **Teach dynamic subagent selection.** Give a support system with six declared
   subagents and a request that needs two of them. Ask what the full pipeline costs on
   that request — latency, tokens, and irrelevant output landing in the coordinator's
   window — then ask what the fixed pipeline buys that dynamic selection gives up. Both
   sides, or the learner will over-apply it.
7. **Teach fan-out and its independence precondition.** Give a task that *looks*
   parallelizable but is not (each step needs the prior step's output) and have them spot it.
8. **Teach the coordinator's own failure modes**, distinct from the shape choices above.
   Hand the learner a broad research question and have them write the decomposition; most
   produce subtasks whose union does not cover the question, which is the teaching moment
   — then have them partition by subtopic or source type instead. Follow with the loop:
   how would the coordinator *know* the synthesis has a hole, and what does it do about it?
   Close on the delegation prompt — goals and quality criteria, not procedural steps.
9. **Teach the anti-patterns** by having them diagnose, not by listing. Present three
   broken orchestrations and ask what is wrong with each.
10. **Decision table** — walk all nine rows, scenario-first.
11. **Scenario drill — 6 questions.** Use a competitive-analysis system: gather data on 12
    competitors, analyze each along 5 dimensions, then synthesize one report. Ask about
    fan-out shape, fork vs. subagent for a follow-up investigation, what must be in a
    worker's prompt when it builds on a prior agent's findings, how attribution survives
    the return path, which step must not be parallelized, and one on a synthesis that came
    back with gaps. Include one multiple-response.
12. **Distractor autopsy.** Expect over-orchestration as the dominant temptation — more
    agents where one would do — plus two specific to this session: a subagent prompt that
    references context the subagent cannot see, and a fork chosen where a subagent's
    context savings were the actual point.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

Defer and say where it's covered:

- Tool distribution across agents and `tool_choice` → session 16. This session establishes
  that each subagent's `AgentDefinition` carries its own tool restrictions; *which* tools
  each role should get, and why a pooled surface degrades selection, is 2.3's material.
- Enforcement gates, handoff protocols, and session resumption → session 4
- Context window mechanics, token budgets, and compaction → session 6
- Error propagation when a subagent fails, and provenance across a full multi-source
  synthesis → session 7. Here, teach only that attribution must survive the boundary.
- Authoring the tool interfaces a subagent calls → session 14
- Agent teams and git worktree isolation for parallel writes — not blueprint material.
  Mention in one line if the learner asks (persistent peers rather than one-shot
  delegation; isolation when agents write overlapping files), label it non-exam, and
  return to the coordinator-subagent shape, which is what § 6 1.2 names.
