# Cost and Latency Optimization — P3 Evaluation, Testing & Optimization

**Exam weight: 16%**

## What this session assumes

Sessions 4–8. Session 7 established that you baseline before optimizing; this session is
the optimization itself.

## Why this domain is worth 16% of your score

Cost and performance tuning is named in the P3 domain description, and it's the most
quantitative material on the Professional exam. Items typically supply volumes, token
counts, and a budget, then ask which lever closes the gap — or which proposed optimization
would break a stated requirement. Precision and knowing each lever's side effect are what
score here.

## Authoritative sources

Verify all pricing, discounts, TTLs, and multipliers — never quote them from memory.

**Cost levers**
- <https://platform.claude.com/docs/en/about-claude/pricing>
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://platform.claude.com/docs/en/build-with-claude/compaction>

**Latency levers**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/build-with-claude/fast-mode>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>

**Measurement and control**
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>
- <https://platform.claude.com/docs/en/managed-agents/budgets>
- <https://code.claude.com/docs/en/costs>
- <https://code.claude.com/docs/en/agent-sdk/cost-tracking>

## Teaching objectives

By the end, the learner can:

- Build a **cost model** for a Claude workload: requests × (input tokens × input rate +
  output tokens × output rate), adjusted for caching, batch, and model mix — and identify
  which term dominates
- Recognize that in agentic systems the dominant cost is usually **accumulated input**
  across loop iterations, not output — so context discipline is the highest-leverage lever
- Rank the levers by typical impact and name each one's **side effect**:
  - Right-size the model → risks quality; requires eval evidence
  - Prompt caching → needs a stable prefix and reuse within the TTL
  - Batch → forfeits interactivity
  - Reduce context / prune tool results → risks losing needed detail
  - Delegate to subagents → adds coordination overhead
  - Lower effort / skip extended thinking → risks quality on reasoning-heavy work
  - Fewer loop iterations via better tools → costs engineering time
- Do the arithmetic reliably: given a workload and ceiling, determine feasibility and which
  lever closes the gap
- Distinguish the **latency levers** from the cost levers and know where they conflict —
  streaming improves perceived latency but nothing else; batch cuts cost and destroys
  latency; caching helps both
- Optimize for **p99 rather than mean** where an SLA or a waiting user exists
- Require a **baseline and an eval gate** before accepting any optimization, so a cost win
  that quietly costs quality is caught
- Design **spend controls and budgets** as guardrails, and attribute cost per team, feature,
  or tenant so optimization can be targeted
- Recognize when the right answer is to **change the requirement** — reduce scope, relax
  freshness, or batch a user-facing path — rather than to micro-optimize
- Explain why premature optimization without measurement is the wrong answer, even when the
  suggested lever is a real one

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Cheaper model vs. caching vs. batch | Which term dominates the cost model? |
| Optimize vs. measure first | Do you have a baseline and attribution? |
| Cut context vs. delegate | Is the detail needed later, or only to reach a conclusion? |
| Lower effort vs. smaller model | Is the task reasoning-heavy or knowledge-light? |
| Accept the latency cost vs. protect it | Is anyone waiting on this specific request? |
| Micro-optimize vs. renegotiate the requirement | Is the requirement itself load-bearing? |

## How to run this session

1. **Frame** — the most quantitative material on the exam. Precision scores; so does knowing
   each lever's side effect.
2. **Verify all rates and multipliers** from live docs before any arithmetic. State the
   date checked, and tell the learner to re-verify near their exam.
3. **Teach the cost model** and build one together for a stated workload.
4. **Teach the accumulated-input insight.** Ask which dominates in a 30-iteration agentic
   loop: output or re-sent input. The answer usually surprises, and it reframes the whole
   optimization approach.
5. **Teach the lever ranking with side effects.** Insist on the side effect every time —
   a lever named without its cost is an incomplete answer on this exam.
6. **Do arithmetic twice**: one worked example together, one they do alone against a ceiling.
7. **Teach the latency levers** and where they conflict with cost. Ask for a case where the
   cost-optimal choice is unacceptable.
8. **Teach p99 optimization** and connect it back to session 5.
9. **Teach the baseline-and-gate requirement.** Ask how they'd know a 40% cost cut didn't
   cost 5% quality. This connects P3's two halves.
10. **Teach spend controls and attribution.**
11. **Teach requirement renegotiation** as a legitimate architectural move, and have them
    identify a requirement worth challenging.
12. **Decision table** — walk all six rows.
13. **Scenario drill — 5 questions**, standalone Professional format. Include an arithmetic
    feasibility question, a lever choice with a side-effect trap, a latency/cost conflict, a
    measure-first question, and one multiple-response on optimizations that would break a
    stated requirement.
14. **Distractor autopsy** — expect levers chosen without their side effect, optimization
    before measurement, and batch applied to latency-sensitive paths.
15. Record per `.agents/TUTORIAL.md` Step 5. Glossary every rate verified, with the date.

## Out of scope

- Eval design itself → session 7
- Scaling architecture → session 5
- Enterprise spend governance and chargeback policy → session 10
- Communicating cost trade-offs to stakeholders → session 12
