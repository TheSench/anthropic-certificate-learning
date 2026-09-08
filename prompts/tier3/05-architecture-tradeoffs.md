# Architecture Trade-offs at Scale — P2 Solution Design & Architecture

**Exam weight: 17%**

## What this session assumes

Session 4 (solution design, model selection).

## Why this domain is worth 17% of your score

The Professional exam is described as weighted toward **architecture decisions and system
design trade-offs**. This session is the trade-off reasoning itself: what breaks between a
working pilot and 10,000 users a day. The scored skill is naming what you give up, not
just what you gain — an answer that claims a design has no downside is wrong on this exam.

## Session focus

This session is the trade-off reasoning itself — what breaks between a working pilot and production scale. The crux is simple and absolute: **every design costs something, and "no downside" is a wrong answer**. The session's real work is the interrogation exercise: the learner proposes an architecture and you press "what does this cost you?", "what breaks at 10×?", "what failure haven't you handled?" until they pre-empt the questions. Also land the counterintuitive result that more concurrency past a rate limit *reduces* effective throughput.

## Authoritative sources

**Scaling and throughput constraints**
- <https://platform.claude.com/docs/en/manage-claude/rate-limits-api>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>

**Orchestration at scale**
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>
- <https://platform.claude.com/docs/en/managed-agents/budgets>
- <https://code.claude.com/docs/en/workflows>

**Latency**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/build-with-claude/fast-mode>

**Operational visibility**
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>
- <https://code.claude.com/docs/en/agent-sdk/observability>
- <https://code.claude.com/docs/en/agent-sdk/cost-tracking>

## Teaching objectives

By the end, the learner can:

- Name the axes a Claude architecture trades against each other — **quality, cost, latency,
  reliability, operational complexity, and flexibility** — and articulate that improving
  one usually spends another
- Identify what breaks **between pilot and production scale**: rate limits become the
  binding constraint, per-request cost multiplies into a budget line, tail latency starts
  mattering more than mean, and a failure that was rare becomes daily
- Design for **tail latency**, not average: p99 is what users and SLAs feel, and agentic
  systems have long tails by construction
- Reason about **concurrency and queueing**: what happens at the rate limit, why naive
  retry storms make it worse, and how backpressure and queue depth get designed
- Decide between **horizontal fan-out** and sequential processing under a rate limit — more
  parallelism can reduce throughput once you're being throttled
- Explain the **quality/cost frontier** and how to find where a workload sits: measure
  before optimizing, and know which lever moves which axis
- Design **graceful degradation** at scale: what the system does when it's over budget,
  throttled, or the model is unavailable — a queue, a cheaper model, a cached answer, or a
  clear failure
- Reason about **blast radius**: one shared configuration across all tenants means one bad
  prompt change affects everyone; per-tenant isolation costs complexity
- State the operational cost of each pattern honestly — a multi-agent system needs more
  observability, more evals, and more failure modes understood
- Answer "what would you give up" for any design they propose

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| More parallelism vs. queueing | Are you rate-limited, or genuinely capacity-limited? |
| Optimize for p50 vs. p99 | Is there an SLA or a user waiting synchronously? |
| Shared config vs. per-tenant isolation | What's the blast radius of one bad change? |
| Degrade vs. fail vs. queue | Is a late or cheaper answer useful to this consumer? |
| Add caching vs. reduce work | Is the repeated cost in the prefix, or in the workload shape? |
| Scale the design vs. reduce the requirement | Is the requirement itself justified? |

## How to run this session

1. **Frame** — every answer on this exam has a cost. "No downside" is a wrong answer. Say so.
2. **Teach the six axes** and immediately practice: give a design change and have the
   learner name which axis improves and which pays for it. Do five, quickly.
3. **Teach the pilot-to-production shift** by having them predict what breaks first when a
   working 50-user pilot goes to 50,000. Correct the ordering: rate limits and cost usually
   bite before quality does.
4. **Teach tail latency.** Ask why mean latency is a misleading metric for an agentic loop.
5. **Teach concurrency and backpressure.** Present a retry storm and have them diagnose it,
   then design the fix. Connect to Tier 1 session 13's code-vs-model retry rule.
6. **Teach the counterintuitive parallelism result** — that more concurrency past the rate
   limit reduces effective throughput. Make them explain why.
7. **Teach the quality/cost frontier** and the measure-before-optimizing discipline, which
   sets up session 7.
8. **Teach graceful degradation at scale** — four options, and when each is right.
9. **Teach blast radius** with a multi-tenant example.
10. **The core exercise:** have the learner propose an architecture for a stated problem,
    then interrogate it — "what does this cost you?", "what breaks at 10×?", "what's the
    failure mode you haven't handled?" Keep going until they can pre-empt the questions.
    This is the session's real work and the closest rehearsal for P2 exam items.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 5 questions**, standalone Professional format. Include a
    rate-limit/parallelism question, a tail-latency question, a blast-radius question, a
    degradation choice, and one multiple-response on what a stated design sacrifices.
13. **Distractor autopsy** — expect scaling answers that add capacity where the constraint
    is a limit, and designs presented as free of trade-offs.
14. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Reliability patterns specifically → session 6
- Eval design → session 7
- Cost optimization mechanics → session 9
- Governance of multi-tenant data → session 10
