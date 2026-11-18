# Context Engineering at Scale — P2 Claude Models, Prompting, and Context Engineering

**Exam weight: 13%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P2.4 — Context Composition and Token Economics: Analyzing context composition and caching
  behavior against a token budget and a defined call volume to determine where token
  consumption can be reduced without loss of task-relevant information.
- P2.6 — Reasoning Effort and Context Lifecycle: Allocating reasoning effort and selecting a
  context lifecycle strategy (context editing, memory tool, compaction) that sustains task
  performance across the stated session length for a long-running agent workload with stated
  latency and accuracy requirements.
- P3.1 — Least-Privilege Tool Configuration: Evaluating an agent or subagent tool
  configuration against least-privilege and minimal-footprint principles, and determining
  which tool connections to remove, scope down, or replace with a context-efficient access
  pattern.
- P3.7 — Progressive Discovery vs. Monolithic Context Loading: Evaluating progressive
  discovery against loading everything into context up front for a task with stated context
  demands and latency tolerance, and selecting the strategy whose context economics fit the
  workload.

P3.1 and P3.7 are credited to P3 Integration (21%) in readiness; the session is labelled P2
for routing.

## What this session assumes

Tier 1 sessions 6 (context mechanics) and 14 (tool interfaces), and Tier 3 sessions 30, 32, and 36.

## Why this domain is worth 13% of your score

Two of P2's six objectives live here, plus two P3 objectives that are the same skill seen
from the tool side. Earlier sessions taught the inputs — context windows, compaction, and context editing
(Tier 1 sessions 6–7), and prompt caching as a cost and latency lever (sessions 32 and 36).
New here: the memory tool, effort allocation, and choosing among the lifecycle tools for a
long-running agent. Breakpoint placement is session 42.
Professional hands you an artifact — a per-component token breakdown, a call-volume figure, a
trace of a long-running agent, a tool manifest — and asks which change cuts consumption or
sustains performance *without* losing what the task needs. Every objective here is
diagnose-and-select: name where the tokens or the degradation come from, then pick the
mechanism that matches that cause.

## Session focus

This session teaches context as an economy to be diagnosed, not a window to be enlarged. The crux, and where to spend disproportionate time, is **P2.6's three lifecycle mechanisms as distinct tools with distinct losses**: context editing removes stale content (old tool results, earlier thinking) without summarizing it; compaction replaces older turns with a summary, which is lossy; the memory tool externalizes what must survive into storage the agent reads back on demand, across sessions. Learners blur them into "manage the context" — drill until they can pick one from a stated session length, latency budget, and accuracy requirement, and say what the rejected two would lose or cost. Second priority is P2.4's arithmetic: tokens per component × call volume, split cached from uncached, to find where reduction is free. P3.1 and P3.7 are the same economics applied to tool surfaces — teach them as one block, keeping least-privilege's *security* footprint distinct from its *context* footprint. Multi-tenant prefix safety stays as a one-step constraint check, no longer the crux.

## Authoritative sources

**Composition and caching (P2.4)**
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/about-claude/pricing>

**Context lifecycle (P2.6)**
- <https://platform.claude.com/docs/en/build-with-claude/context-editing> — tool result
  clearing, thinking block clearing, interaction with caching and with the memory tool
- <https://platform.claude.com/docs/en/build-with-claude/compaction> — overview; on-demand
  vs. token-threshold compaction
- <https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand>
- <https://platform.claude.com/docs/en/build-with-claude/compaction-threshold>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://platform.claude.com/docs/en/managed-agents/memory>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
  — long-horizon guidance, including starting fresh vs. compacting

**Reasoning effort (P2.6)**
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/effort-per-message>
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/preserved-thinking>

**Tool footprint and discovery (P3.1, P3.7)**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling>
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/context-window>

## Teaching objectives

By the end, the learner can:

**P2.4 — composition and token economics**
- Read a **per-component token breakdown** — tools, system, retrieved content, history,
  tool results, output — and multiply by the stated call volume to find which component
  dominates spend. The biggest line per call is not always the biggest line per day
- Separate **cached from uncached** input and read a cache hit rate: a large, stable,
  well-cached prefix may be cheap, while a smaller uncached middle layer re-sent on every
  call is where the money goes. Verify current cache read/write pricing multipliers and
  minimums from the pricing and caching pages before doing arithmetic
- Apply the **layout rule** — stable before dynamic, in the cache hierarchy order (verify the
  current order: tools, system, messages) — and recognize what silently breaks a prefix: a
  timestamp or per-user field early in the system prompt, a reordered tool list, a changed
  tool definition. Breakpoint placement itself is session 42 (P2.5); here, diagnose the
  composition that makes caching fail
- Name the reductions that lose **nothing task-relevant**: tool results trimmed to the fields
  the task reads, stale tool output cleared, oversized retrieved chunks narrowed, duplicated
  instructions removed, unused tool definitions dropped — versus reductions that do lose
  information (truncating history, summarizing evidence the task cites)
- Keep the **shared-prefix constraint** in view: a shared cached prefix must contain nothing
  tenant- or user-specific. Caches are isolated per organization/workspace (verify current
  scope), so the leak is the *prefix content*, not the cache. Full tenant isolation is P5.5,
  session 37

**P2.6 — reasoning effort and context lifecycle**
- Treat **reasoning effort as an allocation**, not a global setting: effort governs all
  output tokens — thinking, text, and tool calls — so lower effort also means fewer, terser
  tool calls. Allocate higher effort to planning and hard judgment steps and lower effort to
  routine tool steps where evals show quality holds. Verify current levels, per-model
  defaults, whether thinking can be disabled on the target model, and whether effort can
  change mid-conversation without breaking the cache — all of these vary by model
- Teach the **three lifecycle mechanisms as distinct**, each with when-to-use and what it
  costs. Verify behaviour from the live pages before teaching; the shape:
  - **Context editing** — the API clears specific content under configured rules: oldest
    tool results (optionally their inputs too) once context crosses a token threshold, and
    thinking blocks from earlier turns by a keep-recent-turns setting whose default varies
    by model. Cleared content is replaced with a placeholder, not summarized; the client keeps
    the full history. Best for tool-heavy agents whose old results are no longer needed once
    processed. Cost: clearing tool results invalidates the cached prefix from that point, so
    clear in large enough chunks to be worth the re-write
  - **Compaction** — older turns are replaced by a summary Claude writes server-side, either
    when you request it or automatically at a token threshold; recent turns can be kept
    verbatim. Best for long tasks with measurable progress and artifacts that persist outside
    the conversation. Cost: lossy — weak for precise recall of early details or exact state
    across many variables, and repeated compactions compound loss: an error in summary two
    becomes a fact every later turn trusts. Verify which compaction mode the docs currently
    recommend and its platform availability
  - **Memory tool** — Claude reads and writes files in a memory directory that **your
    application stores**; it persists across sessions and supports just-in-time retrieval.
    Best when knowledge must survive beyond one conversation, be audited, or be deleted on
    request. Cost: extra tool round trips, and you own storage, scoping, and retention.
    Combined with context editing, the agent can be warned to save what matters before
    clearing
- Add the fourth option the docs name for long-horizon agents: **start a fresh context**
  and let the agent rediscover state from files, progress notes, or tests — sometimes better
  than compacting. Verify against the current best-practices page
- Select among them from **stated session length, latency, and accuracy**: hours of
  tool-heavy work with no cross-session need → context editing; long single-session task
  where a gist suffices → compaction; must survive sessions or be auditable → memory tool;
  exact-state accuracy requirement → externalize structured state rather than summarize.
  Name what each rejected option would lose

**P3.1 — least-privilege and minimal-footprint tool configuration**
- Evaluate a tool configuration **per agent and per subagent**, using v1.1's three verbs:
  **remove** (not needed for this role), **scope down** (read-only, narrower paths or
  parameters, a purpose-built operation instead of a raw API), or **replace with a
  context-efficient access pattern** (tool search with deferred loading, a single CLI or
  code-execution path instead of dozens of definitions, programmatic tool calling so
  intermediate results stay out of context, a subagent that holds a toolset the orchestrator
  never sees)
- Keep the **two footprints distinct**: the *privilege* footprint (blast radius — what a
  compromised or confused agent can do) and the *context* footprint (definitions and results
  in every request, which degrade selection accuracy and cost tokens). An item may hinge on
  one, the other, or a fix that improves both. Credential exposure is P3.2, session 28;
  untrusted tool output as injection is P5.2, session 35

**P3.7 — progressive discovery vs. monolithic loading**
- Decide from **stated context demands and latency tolerance**: load up front when the full
  set is small, needed on nearly every turn, stable enough to cache, and the workload can't
  afford discovery round trips; discover progressively when the surface is large and
  task-dependent and a round trip of latency is acceptable
- Recognize progressive discovery wherever it appears — tool search, Skills' metadata-first
  loading (session 42), memory read on demand, agentic exploration of files instead of
  pasting the corpus (retrieval architecture itself is P3.5, session 30)
- Diagnose a production context problem to its cause and pick the fix that matches the cause
  rather than the symptom — raising a budget for unbounded growth is the symptom fix

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which component to cut | Tokens per call × call volume, uncached — not the biggest line on one request |
| Trim vs. summarize vs. truncate | Is the removed content task-relevant later? |
| Context editing vs. compaction vs. memory tool | Stale tool output, a gist of progress, or knowledge that must outlive the session? |
| Compact vs. start fresh | Can the agent rediscover state from files and tests? |
| Clear tool results vs. keep them cached | Is the freed context worth the cache re-write? |
| Raise effort vs. lower it per step | Which steps carry the accuracy requirement, and what's the latency budget? |
| Remove vs. scope down vs. replace a tool connection | Unused, over-broad, or needed but context-expensive? |
| Progressive discovery vs. monolithic loading | Needed every turn and cacheable, or large and task-dependent with latency to spare? |
| Shared cacheable prefix vs. per-tenant | Could tenant data or entitlements differ inside the prefix? |
| Raise the budget vs. redesign the flow | Is growth bounded, or unbounded by construction? |

## How to run this session

1. **Frame** — every item here gives an artifact and asks where the tokens or the
   degradation come from. Name the diagnose-and-select shape out loud.
2. **Teach composition analysis (P2.4).** Give a per-component breakdown with a cache hit
   rate and a daily call volume. Have the learner compute daily tokens per component, split
   cached from uncached, and name the one reduction that loses nothing. Then move a
   timestamp into the top of the system prompt and ask what happens to the hit rate.
3. **Teach the shared-prefix constraint** in one step: what may never sit in a prefix shared
   across tenants, and why the cache's own isolation doesn't save you. Defer the rest to
   session 37.
4. **Teach effort allocation.** Verify current effort levels and per-model defaults first.
   Give a five-step agent loop with a latency budget and an accuracy requirement on one
   step; have them allocate effort per step and say how they'd confirm it with an eval sweep.
5. **Teach the three lifecycle mechanisms** — the session's crux. Verify behaviour from the
   context-editing, compaction, and memory-tool pages first. Teach each separately with its
   cost, then give four long-running workloads (stated session length, latency, accuracy)
   and have them pick one and say what the other two would lose. Include one where starting
   fresh beats all three.
6. **Teach repeated-summarization degradation.** Ask what happens after five compactions,
   and what an error in summary two does to the rest of the session.
7. **Teach least-privilege tool review (P3.1).** Hand them an orchestrator and two
   subagents, each with a tool manifest. Have them mark every connection remove, scope down,
   or replace — and say for each whether it fixes the privilege footprint, the context
   footprint, or both.
8. **Teach progressive vs. monolithic (P3.7)** with two workloads that flip the answer: a
   latency-critical assistant with eight always-used tools, and a research agent with three
   hundred task-dependent ones.
9. **Teach diagnosis**: four production context symptoms, four different causes and fixes.
10. **Decision table** — walk all ten rows.
11. **Scenario drill — 6 questions**, standalone Professional format, each built on an
    artifact (token breakdown, cache metrics, agent trace, tool manifest). Include a
    composition question, an effort-allocation question, two lifecycle-mechanism choices
    (one where compaction is wrong because exact recall is required), a least-privilege
    question, and a progressive-vs-monolithic question.
12. **Distractor autopsy** — expect compaction chosen where exact recall or cross-session
    persistence was required, a bigger context window or budget offered for unbounded
    growth, the largest per-request component cut instead of the largest per-volume uncached
    one, effort raised globally when one step carried the accuracy requirement, tools kept
    "in case" because they're cheap to cache, and cache efficiency pursued by putting tenant
    data in a shared prefix.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Cache breakpoint placement and Skill packaging → session 42 (P2.5)
- Model tier selection → session 31 (P2.1)
- Cost and latency telemetry optimization → session 36 (P4.6)
- Retrieval architecture → session 30 (P3.5)
- Tenant isolation as a compliance control → session 37 (P5.5)
- Credential exposure → session 28 (P3.2); injection via tool results → session 35 (P5.2)
