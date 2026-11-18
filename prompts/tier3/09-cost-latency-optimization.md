# Cost and Latency Optimization — P4 Evaluation, Testing, and Optimization

**Exam weight: 17%**

*Owns CCAR-P v1.1 § 5 task statement:*

- P4.6 — Cost and Latency Optimization: Analyzing cost and latency telemetry, including
  cache hit rates, to determine where spend or latency is concentrated, and specifying the
  optimization that reduces it without violating the stated quality floor.

## What this session assumes

Sessions 31–35. Session 34 established that you baseline before optimizing and taught the
evals that define a quality floor; this session is the optimization itself.

## Why this domain is worth 17% of your score

Optimization is the third word in the P4 domain name, and this is the most quantitative
material on the Professional exam. v1.1 words the objective as a diagnosis: items hand you
**telemetry** — per-route token counts, cache read and write volumes, latency percentiles,
spend by feature — and ask where the money or the milliseconds are concentrated, then which
change removes them without dropping below a stated quality floor. Reading the artifact
correctly, and knowing each lever's side effect, are what score here.

## Session focus

This session is the most quantitative material on the Professional exam. Verify every rate, discount, and multiplier from live docs before any arithmetic, and note the date. The crux is **locate before you lever**: the scored skill is reading telemetry to find where spend or latency actually concentrates, and the answer is almost never where the scenario's loudest complaint points. Two findings recur and deserve disproportionate time — in agentic systems the dominant cost is **accumulated input across loop iterations**, not output, and a **low cache hit rate** usually means a prefix that changes between calls, not a missing cache. Insist on naming each lever's *side effect* every time, and treat the stated **quality floor** as a hard constraint the optimization must be shown not to cross, with eval evidence rather than intuition.

## Authoritative sources

Verify all pricing, discounts, TTLs, multipliers, and usage-field names — never quote them
from memory.

**Cost levers**
- <https://platform.claude.com/docs/en/about-claude/pricing>
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://platform.claude.com/docs/en/build-with-claude/compaction>

**Latency levers**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/build-with-claude/fast-mode>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>

**Telemetry: reading where it goes**
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>
- <https://code.claude.com/docs/en/costs>
- <https://code.claude.com/docs/en/agent-sdk/cost-tracking>

**Spend controls**
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>
- <https://platform.claude.com/docs/en/managed-agents/budgets>

## Teaching objectives

By the end, the learner can:

- **Read cost and latency telemetry** and say where spend or latency concentrates: by
  route or feature, by model, by input versus output tokens, by cache reads versus cache
  writes versus uncached input, and by latency percentile. State the concentration as a
  share of the total before proposing anything
- Build a **cost model** for a Claude workload: requests × (input tokens × input rate +
  output tokens × output rate), adjusted for caching, batch, and model mix — and identify
  which term dominates. The model is how telemetry becomes a diagnosis
- Recognize that in agentic systems the dominant cost is usually **accumulated input**
  across loop iterations, not output — so context discipline is often the highest-leverage
  lever
- **Interpret cache hit rate** as a diagnostic: compute it from the usage fields that report
  cache reads and cache writes (verify the field names from live docs), and read a low rate
  as a symptom with a small set of causes — dynamic content (timestamps, user IDs, reordered
  tools) ahead of the breakpoint, traffic too sparse to reuse within the TTL, or a prefix
  below the minimum cacheable length. Know that cache writes are priced above uncached input (verify the multiplier), so a
  cache with many writes and few reads can *raise* spend. Breakpoint placement itself is
  session 42; here the skill is recognizing the pattern in telemetry
- Rank the levers by typical impact and name each one's **side effect**:
  - Right-size the model → risks quality; requires eval evidence against the floor
  - Prompt caching → needs a stable prefix and reuse within the TTL
  - Batch → forfeits interactivity
  - Reduce context / prune tool results → risks losing needed detail
  - Delegate to subagents → adds coordination overhead
  - Lower effort / skip extended thinking → risks quality on reasoning-heavy work
  - Fewer loop iterations via better tools → costs engineering time
- Treat the **quality floor as binding**: an optimization is acceptable only if the eval
  suite shows the floor still holds on the affected slice — a cost win measured only in
  aggregate can hide a breach concentrated in one route
- Do the arithmetic reliably: given telemetry and a ceiling, determine which lever closes
  the gap and by how much
- Distinguish the **latency levers** from the cost levers and know where they conflict —
  streaming improves perceived latency but nothing else; batch cuts cost and destroys
  latency; caching helps both
- Read latency at **p95/p99 rather than the mean** where an SLA or a waiting user exists,
  and locate whether the tail comes from time to first token, output length, tool calls, or
  loop depth
- Use **cost attribution** (per team, feature, or tenant) and **spend limits** as the
  instruments that make concentration visible and cap runaway — attribution is what turns
  a monthly bill into telemetry you can act on
- Recognize when the right answer is to **change the requirement** — reduce scope, relax
  freshness, or batch a path nobody waits on — rather than to micro-optimize
- Explain why optimizing a lever before locating the concentration is the wrong answer,
  even when the suggested lever is a real one

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which route or term to optimize | Where does the telemetry say spend or latency concentrates? |
| Cheaper model vs. caching vs. batch | Which term dominates the cost model? |
| Add caching vs. fix the prefix | Is caching already on with a low hit rate? |
| Optimize vs. measure first | Do you have a baseline and attribution? |
| Accept the optimization vs. reject it | Does the eval still clear the quality floor on the affected slice? |
| Cut context vs. delegate | Is the detail needed later, or only to reach a conclusion? |
| Lower effort vs. smaller model | Is the task reasoning-heavy or knowledge-light? |
| Accept the latency cost vs. protect it | Is anyone waiting on this specific request? |
| Micro-optimize vs. renegotiate the requirement | Is the requirement itself load-bearing? |

## How to run this session

1. **Frame** — the most quantitative material on the exam, written as telemetry reading.
   Precision scores; so does knowing each lever's side effect.
2. **Verify all rates, multipliers, and usage-field names** from live docs before any
   arithmetic. State the date checked, and tell the learner to re-verify near their exam.
3. **Teach the cost model** and build one together for a stated workload.
4. **Teach telemetry reading — the block to spend time on.** Hand the learner a small
   telemetry table (four routes; requests, input/output/cache-read/cache-write tokens, p50
   and p99 latency, spend share) and ask where spend concentrates and where latency does.
   Make sure the two answers differ. Do not accept a lever until they have named the
   concentration as a share of the total.
5. **Teach the accumulated-input insight.** Ask which dominates in a 30-iteration agentic
   loop: output or re-sent input. The answer usually surprises, and it reframes the whole
   optimization approach.
6. **Teach cache hit rate as a diagnostic.** Give a route where caching is enabled but reads
   are near zero and writes are high, and ask why spend went *up*. Lead them to the dynamic
   prefix. Name the fix's mechanics only to the depth session 42 does not.
7. **Teach the lever ranking with side effects.** Insist on the side effect every time —
   a lever named without its cost is an incomplete answer on this exam.
8. **Teach the quality floor.** Ask how they'd know a 40% cost cut didn't breach the floor.
   Push past the aggregate score to the slice the change touched. This connects P4's two
   halves.
9. **Do arithmetic twice**: one worked example together, one they do alone against a ceiling.
10. **Teach the latency levers** and where they conflict with cost, and the tail: ask which
    component drives p99 in their telemetry table. Connect to session 32.
11. **Teach attribution and spend limits** as the instruments that produced the telemetry.
12. **Teach requirement renegotiation** as a legitimate architectural move, and have them
    identify a requirement worth challenging.
13. **Decision table** — walk all nine rows.
14. **Scenario drill — 5 questions**, standalone Professional format, each carrying a
    telemetry excerpt. Include a where-is-it-concentrated question, a low-hit-rate diagnosis,
    a lever choice with a side-effect trap, an optimization that breaches the stated quality
    floor, and one multiple-response on optimizations that would break a stated requirement.
15. **Distractor autopsy** — expect the lever applied to the loudest route rather than the
    one the telemetry shows, caching "added" where it is already on and the prefix is the
    fault, levers chosen without their side effect, an aggregate eval accepted as proof the
    quality floor held, and batch applied to latency-sensitive paths.
16. Record per `.agents/TUTORIAL.md` Step 5. Glossary every rate verified, with the date.

## Out of scope

- Eval design itself → session 34
- Choosing the one configuration change that relieves a binding accuracy or latency
  constraint (P3.3) → session 32
- Cache breakpoint placement and context composition against a token budget → sessions 42
  and 41
- An SLA commitment the cost or latency profile cannot meet → session 39
