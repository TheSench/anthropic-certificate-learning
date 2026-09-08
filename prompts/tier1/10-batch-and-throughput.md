# Batch, Streaming, and Throughput Choices — F3 Prompt Engineering & Structured Output

**Exam weight: 20%**

## What this session assumes

Sessions 8–9. The learner can design a reliable single call; this session is about
running it at volume.

## Why this domain is worth 20% of your score

"When the Batch API pays for itself" is a documented exam question type, and the F3
domain description names **batch processing patterns**. Exam scenarios supply the
deciding facts — volume, latency tolerance, cost ceiling — and the wrong answers are
options that ignore one of them. This is arithmetic-plus-judgment, and it's very
scoreable, so it's worth being precise.

## Authoritative sources

Verify current limits, pricing multipliers, and turnaround guarantees — these change.

**Batch**
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>

**Streaming and latency**
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/build-with-claude/fast-mode>

**Cost levers that interact with this choice**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/about-claude/pricing>
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>

**Operational limits**
- <https://platform.claude.com/docs/en/manage-claude/rate-limits-api>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>

## Teaching objectives

By the end, the learner can:

- State the **Batch API trade**: substantially lower cost per token in exchange for
  asynchronous, non-guaranteed-immediate turnaround — and verify the current discount and
  window rather than assuming
- Identify the workload shape batch fits: high volume, no user waiting, tolerant of
  turnaround measured in minutes-to-hours
- Identify where batch is wrong regardless of cost: anything a user is waiting on, and
  anything whose result feeds the next step of an interactive loop
- Explain **streaming** as a *perceived* latency improvement, not a throughput or cost
  one — and say when that distinction matters (a user watching vs. a pipeline consuming)
- Combine levers correctly: batch + caching + right-sized model, and reason about which
  dominates for a given workload
- Do the arithmetic: given volume, token counts, and a cost ceiling, determine whether a
  configuration fits, and identify which lever closes the gap
- Design for **rate limits** — concurrency, backoff, and queueing — and recognize that
  hitting limits is a capacity design problem, not an error to retry blindly
- Handle partial batch failures: some requests fail, and the pipeline must reconcile
- Choose the right split when a workload has both interactive and bulk components

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Batch vs. synchronous | Is anyone waiting on this specific result? |
| Streaming vs. buffered | Is a human watching the output appear? |
| Batch vs. cheaper model | Is the constraint cost-per-token, or capability? |
| Caching vs. batch | Is the repeated content the prefix, or the whole workload? |
| Queue-and-throttle vs. scale up | Is the limit a rate limit or a genuine capacity need? |
| Split interactive/bulk vs. one path | Do the two halves have different latency requirements? |

## How to run this session

1. **Frame** — this is the most arithmetic-friendly material on the exam. Precision pays.
2. **Verify** the current batch discount, size limits, and turnaround window from live docs
   before teaching any number. Do not state a percentage from memory.
3. **Teach the batch trade**, then immediately test the boundary: give six workloads and
   have the learner sort batch-appropriate from not, naming the deciding fact each time.
   Include one that's high-volume but user-facing (not batch) and one that's low-volume but
   fully async (batch may still not be worth it).
4. **Teach streaming honestly** — it changes perception, not throughput. Ask what it does
   for a nightly pipeline: nothing. Confirm they see why.
5. **Teach lever interaction.** Give a workload where caching beats batch, and one where
   the reverse holds, and have them explain the difference.
6. **Do the arithmetic together.** One worked example: N documents/day, input and output
   token estimates, a monthly ceiling. Compute the naive cost, then apply levers until it
   fits. Then hand them a second one to do alone.
7. **Teach rate limits** as capacity design — concurrency, backoff, queue depth.
8. **Teach partial failure** in batch: what reconciliation requires.
9. **Decision table** — walk all six rows.
10. **Scenario drill — 4 questions.** Use a content-moderation pipeline with two paths:
    real-time submissions needing sub-second decisions, and a nightly re-scan of the
    archive at high volume, under one shared budget. Ask about path splitting, lever
    choice, an arithmetic feasibility check, and partial-failure handling. Include one
    multiple-response.
11. **Distractor autopsy** — expect batch chosen for a user-facing path because it's
    cheaper, and streaming chosen as a throughput fix.
12. Record per `.agents/TUTORIAL.md` Step 5. Glossary the limits and multipliers verified.

## Out of scope

- Prompt caching mechanics in depth → session 14
- Model selection reasoning → Tier 3 session 4
- Full cost optimization → Tier 3 session 9
- Enterprise spend governance → Tier 3 session 10
