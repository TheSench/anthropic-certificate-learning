# Architecture Trade-offs at Scale — P1 Solution Design and Architecture

**Exam weight: 18%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P1.2 — End-to-End Architecture Evaluation: Evaluating whether a proposed end-to-end
  architecture (input, processing, output, feedback) satisfies stated scalability,
  maintainability, and access-control requirements, and identifying the component that
  fails first under a specified load or trust condition.
- P1.4 — Orchestrator and Subagent Decomposition: Evaluating a proposed orchestrator/subagent
  decomposition for a multi-step workload against stated observability and error-recovery
  requirements, and identifying where task boundaries, control flow, or result synthesis
  will fail.
- P3.3 — Relieving the Binding Performance Constraint: Evaluating candidate configuration
  changes (retrieval depth, model tier, caching, call pattern) for a system whose dominant
  constraint is accuracy or latency, and selecting the change that relieves the binding
  constraint at least cost to the other.

## What this session assumes

Session 31 (solution design, pattern selection, model tier). Tier 1's orchestration
sessions (F1 Agentic Architecture) for the mechanics of subagents and handoffs; this
session evaluates decompositions rather than building them.

## Why this domain is worth 18% of your score

P1 Solution Design and Architecture is 18% of the Professional exam, and P3.3 adds a piece
of P3 Integration (21%). All three objectives here are **evaluation** tasks: you are handed
someone else's design — a diagram, a decomposition, a config — and asked where it breaks
and what to change. The scored skill is naming what fails *first* and what a fix costs,
not just what it gains. An answer that claims a design has no downside is wrong on this
exam; v1.1's Sample 1 rejects exactly that option.

## Session focus

This session is reading a proposed architecture and finding where it breaks. The crux is **"what fails first, under this condition"**: P1.2 and P1.4 both ask the learner to locate the single weakest component against a *stated* load, trust, observability, or recovery requirement — not to list everything that could be better — and P3.3 asks for the one change that relieves the *binding* constraint at least cost to the other. Spend disproportionate time on the walk-the-stages exercise (input → processing → output → feedback, and orchestrator → subagent → synthesis), where the learner names the first-failing component and the requirement it violates, and on P1.4, which Tier 1 only taught constructively. Keep the absolute rule running throughout: **every design costs something, and "no downside" is a wrong answer**.

## Authoritative sources

**Scaling and throughput constraints (P1.2 load conditions)**
- <https://platform.claude.com/docs/en/api/rate-limits>
- <https://platform.claude.com/docs/en/manage-claude/rate-limits-api>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>

**Orchestration and decomposition (P1.4)**
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>
- <https://code.claude.com/docs/en/agent-sdk/subagents>
- <https://code.claude.com/docs/en/sub-agents>
- <https://platform.claude.com/docs/en/managed-agents/budgets>
- <https://code.claude.com/docs/en/workflows>

**Configuration levers (P3.3)**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/build-with-claude/fast-mode>
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>

**Operational visibility**
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api>
- <https://code.claude.com/docs/en/agent-sdk/observability>
- <https://code.claude.com/docs/en/agent-sdk/cost-tracking>

## Teaching objectives

By the end, the learner can:

**P1.2 — evaluating an end-to-end architecture**

- Decompose any proposed system into **input, processing, output, and feedback** stages and
  test each against the three stated requirement types: **scalability** (does it hold at
  the stated load), **maintainability** (can it be changed safely — versioned prompts,
  separable components, an eval that gates change), and **access control** (is the
  caller's identity and permission enforced at every stage that touches data)
- Identify the **component that fails first** under a specified condition, and say why
  that one and not another:
  - **Under load**, the first failure is usually the component with the hardest external
    limit — the model call against its rate limit, a synchronous tool with fixed capacity,
    or context that grows with conversation length — not "quality", which degrades last.
    Per-request cost multiplying into a budget line and tail latency (p99, not mean) are
    where pilots break at production scale
  - **Under a trust condition** (a new user class, an external data source, a second
    tenant), the first failure is wherever identity stops propagating — typically a
    retrieval or tool layer running under a shared service account, so access control
    enforced at the UI is bypassed one stage later
- Evaluate the **feedback stage** specifically: no feedback means no improvement signal,
  and feedback that writes straight into prompts or eval sets without review is both a
  maintainability and a trust failure
- Reason about **blast radius**: one shared configuration across all tenants means one bad
  prompt change affects everyone; per-tenant isolation costs complexity
- Reason about **concurrency at the rate limit**: past the limit, more parallelism *reduces*
  effective throughput because throttled requests retry and compete. The retry and backoff
  control itself is session 33's (P3.8); here, recognize the rate-limited call as the
  first-failing component
- Design **graceful degradation** as part of the evaluation — what the system does when
  over budget, throttled, or the model is unavailable: a queue, a cheaper model, a cached
  answer, or a clear failure

**P1.4 — evaluating an orchestrator/subagent decomposition**

- Test a decomposition against stated **observability** requirements: can you tell, from
  the trace, which subagent did what, with what input, at what cost, and whether it
  succeeded? Subagents that return free prose with no status field make a failed subtask
  indistinguishable from a successful one
- Test it against stated **error-recovery** requirements: can one failed subagent be
  retried alone, or does any failure restart the whole tree? Does a retried subagent
  repeat a side effect? Is completed work checkpointed?
- Locate the failure in one of the three places P1.4 names:
  - **Task boundaries** — subtasks that overlap (duplicated work, conflicting edits),
    leave a gap no subagent owns, or are cut along a seam that forces subagents to need
    each other's context (chatty coordination that a single agent would not need). A
    subagent starts with only what its brief gives it; a boundary that assumes shared
    context fails silently
  - **Control flow** — dependent steps fanned out in parallel, no termination or budget
    ceiling per subagent, an orchestrator that cannot detect a stalled or failed child,
    or recursion with no depth limit
  - **Result synthesis** — conflicting subagent results merged without reconciliation,
    provenance lost so a wrong claim cannot be traced to its source, error states
    summarized away, or combined results overflowing the orchestrator's context
- Judge when decomposition is the wrong answer: if subtasks are not independent, or the
  observability and recovery cost exceeds the parallelism gain, a single agent or a fixed
  workflow (session 31's pattern selection) is the better design. A multi-agent system
  needs more observability, more evals, and more failure modes understood — state that
  cost honestly

**P3.3 — relieving the binding constraint**

- Name which of **accuracy or latency** is binding from the scenario's numbers (which one
  is out of spec, and which is at or above its floor) before evaluating any lever
- Know what each of the four named levers moves, and what it costs:
  - **Retrieval depth** — more or better-ranked chunks can raise accuracy when the miss is
    a retrieval miss; it costs input tokens and latency, and does nothing when the needed
    content was already retrieved
  - **Model tier** — a larger tier helps when the failure is reasoning difficulty and
    costs latency and money; a smaller tier cuts latency at an accuracy cost. Routing
    only the hard cases to the larger tier limits that cost
  - **Caching** — reusing a stable prefix cuts latency and cost on repeated calls with
    **no accuracy cost**, but only if the prefix is actually stable and reused within the
    cache lifetime. Verify current cache behaviour and lifetimes from live docs
  - **Call pattern** — parallelizing independent calls, splitting or merging calls,
    streaming (improves *perceived* latency, not total), or batch (cuts cost, raises
    latency — wrong for a synchronous latency-bound path)
- Select the change that **relieves the binding constraint at least cost to the other**:
  a latency-bound system with accuracy at its floor wants caching or call-pattern changes
  before a tier downgrade; an accuracy-bound system whose misses are retrieval misses wants
  retrieval depth or ranking before a tier upgrade
- Apply measure-before-optimizing: the scenario's telemetry (where time goes, which cases
  fail) decides the lever; session 34 builds the measurement, session 36 owns cost
  optimization (P4.6)

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which component fails first under load | Which stage has the hardest external limit at the stated volume? |
| Which component fails first under a trust condition | Where does the caller's identity stop being enforced? |
| Shared config vs. per-tenant isolation | What's the blast radius of one bad change? |
| More parallelism vs. queueing | Are you rate-limited, or genuinely capacity-limited? |
| Optimize for p50 vs. p99 | Is there an SLA or a user waiting synchronously? |
| Degrade vs. fail vs. queue | Is a late or cheaper answer useful to this consumer? |
| Task-boundary vs. control-flow vs. synthesis defect | Is the failure in what each subagent was given, in how they were sequenced, or in how results were combined? |
| Decompose vs. keep one agent | Are the subtasks independent, and can you observe and recover each one? |
| Retrieval depth vs. model tier for accuracy | Was the needed content retrieved and misused, or never retrieved? |
| Caching vs. smaller tier for latency | Is accuracy already at its floor? |

## How to run this session

1. **Frame** — every item here hands the learner someone else's design and asks where it
   breaks first. Every answer has a cost; "no downside" is a wrong answer. Say so.
2. **Teach the four-stage walk (P1.2).** Present a diagrammed system — e.g. a support
   assistant: ticket intake → retrieval over a knowledge base plus a CRM tool → drafted
   reply → agent ratings fed back into the prompt — with stated requirements. Have the
   learner walk input, processing, output, feedback against scalability, maintainability,
   and access control in turn.
3. **Teach "fails first" under load.** Raise the volume 100× and ask which component breaks
   first. Correct the ordering: rate limits, a capacity-bound tool, and cost usually bite
   before quality. Use it to land tail latency (why p99, not mean, for an agentic loop) and
   the counterintuitive result that more concurrency past the rate limit reduces
   throughput — make them explain why.
4. **Teach "fails first" under a trust condition.** Keep the same diagram and add a
   condition: contractors get access but may only see their region's tickets. Ask which
   component fails first. Drive to the retrieval/CRM layer running under one service
   account. Then add blast radius: what one bad prompt change does across tenants.
5. **Teach graceful degradation** — four options, and when each is right.
6. **Teach decomposition review (P1.4)** — the session's newest material. Present an
   orchestrator with four subagents (e.g. research, pricing lookup, drafting, compliance
   check) and a stated requirement ("every failed lookup must be retryable without
   re-running the others"; "ops must see per-subagent cost and status"). Have the learner
   find the defect in each of task boundaries, control flow, and result synthesis. Then
   remove the decomposition and ask whether one agent would meet the requirements better.
7. **Teach the P3.3 lever map.** State a system's numbers (accuracy at floor, p95 latency
   over SLA; or the reverse) and have the learner name the binding constraint, then rank
   the four levers by relief-per-cost. Ask what each rejected lever does to the other
   constraint.
8. **The core exercise:** have the learner propose an architecture for a stated problem,
   then interrogate it — "what fails first at 10×?", "which subagent can't you observe?",
   "what does this change cost the other constraint?" Keep going until they pre-empt the
   questions. This is the closest rehearsal for P1 items.
9. **Decision table** — walk all ten rows.
10. **Scenario drill — 6 questions**, standalone Professional format with an artifact in
    each stem (diagram description, config, or trace). Include a first-to-fail-under-load
    item, a first-to-fail-under-trust item, two decomposition items (one boundary or
    control-flow, one synthesis), a binding-constraint lever item, and one
    multiple-response on what a stated design sacrifices.
11. **Distractor autopsy** — expect scaling answers that add capacity where the constraint
    is a limit; designs presented as free of trade-offs; "fails first" answers naming
    output quality when a hard limit or an unenforced permission breaks earlier;
    decompositions judged by their happy path with no question of how a failed subagent is
    seen or retried; and a model-tier upgrade offered for an accuracy problem that is a
    retrieval miss.
12. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Retry, backoff, idempotency, and fallback routing as controls (P3.8) → session 33
- Monitoring strategy for an undetected failure (P3.4) → session 33
- Eval design and measurement → session 34
- Cost optimization mechanics (P4.6) → session 36
- Governance of multi-tenant data → session 37
- Least-privilege tool configuration (P3.1) → session 41
