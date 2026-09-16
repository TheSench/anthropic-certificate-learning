# Multi-Pass Review and Batch Processing — F3 Prompt Engineering & Structured Output

**Exam weight: 20%**

## What this session assumes

Sessions 2 (Task Decomposition), 3 (Coordinator-Subagent Orchestration and the Task Tool),
11 (Structured Output via Tool Use and JSON Schemas), and 12 (Validation, Retry, and
Confidence Calibration). Session 2 established decomposing a task into focused passes;
session 3 established spawning independent instances and what context does and does not
cross the boundary; session 11 gave the enforced output shape a review pipeline emits;
session 12 gave confidence calibration, which this session's routing depends on. Nothing
here is a new mechanism — it is those mechanisms applied to review architecture and to
volume.

## Why this domain is worth 20% of your score

This session owns the last two F3 task statements: **4.6 — "Design multi-instance and
multi-pass review architectures"** — and **4.5 — "Design efficient batch processing
strategies"**. 4.6 is tested directly by the official sample questions (Q12), which is as
strong a signal of item density as the guide gives. 4.5 is the most arithmetic-friendly
material on the Foundations exam: scenarios supply the deciding facts — volume, latency
tolerance, SLA, cost ceiling — and the wrong answers are options that ignore one of them.
Between a directly-sampled objective and a scoreable arithmetic one, this session is worth
precision.

## Session focus

This session covers two architectures for doing review and extraction at scale. The crux is
a single sentence that answers both halves of 4.6: **an independent review instance beats
self-review because the generating model retains its own reasoning context — and per-file
local passes plus a separate cross-file pass avoid attention dilution.** Spend
disproportionate time there; it is the directly-sampled objective. Teach it as
*recognition*, not novelty — session 2 already taught decomposing a task into focused
passes and session 3 already taught what an independent instance does and does not inherit.
The learner's job here is to notice that review is the same problem wearing different
clothes. On the batch half, the deciding fact is always "is anyone waiting on this specific
result", and the scoreable skill is computing submission frequency from an SLA. Be honest
that streaming changes *perceived* latency only — it is neither a throughput nor a cost
lever — because that negative knowledge is what disarms the most common wrong answer.

## Authoritative sources

Verify current limits, discounts, and turnaround windows from live docs — these change, and
a confidently stale number is worse than "let me check".

**Batch**
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>

**Multi-instance and multi-pass review**
- <https://code.claude.com/docs/en/agent-sdk/subagents>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://code.claude.com/docs/en/github-actions>

**Latency, and what it is not**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>

**Reasoning controls that are the tempting wrong answer here**
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>

## Teaching objectives

By the end, the learner can:

**Multi-instance and multi-pass review (task 4.6)**

- State the **self-review limitation** precisely: a model **retains reasoning context from
  generation, making it less likely to question its own decisions in the same session**. It
  is not that the model is incapable of criticism — it is that the reasoning which produced
  the code is still in context and still looks correct to it. Say it in those terms; the
  exam phrases the objective this way
- Conclude what follows: an **independent review instance, without the prior reasoning
  context**, is more effective than either a **self-review instruction** ("now review your
  work critically") or **extended thinking** / a larger reasoning budget. Both of those are
  plausible distractors on the sampled item, and both fail for the same reason — they add
  effort inside the context that contains the bias, rather than removing the bias. More
  thinking about a conclusion you already reached is not independence
- Design a **multi-pass review** for a change too large to review in one pass: **per-file
  local analysis passes** for issues contained within each file, then a **separate
  cross-file integration pass** for data flow and contracts between them
- Name what a single pass over everything loses, in the exam's own terms: **attention
  dilution** across files, and **contradictory findings** — two parts of one response
  disagreeing because neither had the whole picture in focus. These are the two named costs;
  the learner should produce both
- Say why the cross-file pass must be *separate* rather than an instruction appended to the
  per-file pass: the per-file pass is scoped to make local analysis thorough, and asking it
  to also reason globally reintroduces exactly the dilution the decomposition removed
- Design a **verification pass** in which the model **self-reports confidence alongside each
  finding**, and connect that to session 12: the self-reported confidence is only useful
  once it is **calibrated**, and a calibrated confidence is what enables **calibrated review
  routing** — high-confidence findings posted straight as comments, the rest held for a
  human. Uncalibrated, it is a number that sorts findings in an unknown order
- Recognize this as the same shape as session 2's decomposition and session 3's subagent
  boundary, and say what is specific to review: the value of the boundary here is
  *ignorance* of the generating reasoning, not just context economy

**Batch processing (task 4.5)**

- State the **Message Batches API** trade with the § 17 figures — **50% cost savings** and a
  processing window of **up to 24 hours** — and immediately add the discipline that keeps
  those figures safe: **verify the current discount and window from live docs before quoting
  them in a design.** Know the numbers for the exam; verify them for a real system. Both
  halves are part of the answer
- State the sharpest operational fact: batch offers **no guaranteed latency SLA**. Results
  may arrive in minutes or may take the full window, and a design that assumes the fast case
  is a design with an unbounded tail
- Identify the workload shape batch fits: **non-blocking, latency-tolerant** work — overnight
  reports, weekly audits, nightly test generation, archive re-scans
- Identify where batch is wrong **regardless of cost**: anything a user is waiting on, and —
  name this one specifically, because it is the exam's own example — **pre-merge checks** in
  a CI pipeline. A pre-merge check blocks a developer and blocks the merge queue; a 24-hour
  window with no SLA is disqualifying no matter what the savings are. The distractor is
  always the cost argument, and the cost argument is irrelevant when the workflow is blocking
- State the Batch API's hard functional limit: **no multi-turn tool calling within a single
  request**. Each batch request is one turn. A workload whose unit of work is an agentic
  loop — call a tool, read the result, decide the next call — cannot be expressed as a batch
  request at all, and this rules out batch on capability grounds *before* any cost or
  latency argument is reached. This is a § 17-named in-scope fact and it decides items on its
  own
- Correlate each response to its request by **`custom_id`**, since batch results are **not
  order-guaranteed**, and poll for completion rather than expecting a synchronous return
- Handle **partial batch failures**: resubmit **only the failed documents, by `custom_id`,
  with modifications** — chunking a document that exceeded the context limit, simplifying a
  schema that the model failed to fill, splitting a request that hit `max_tokens`.
  Resubmitting the failures unchanged repeats the failure; resubmitting the whole batch pays
  twice for the successes. The scored answer is the selective, modified resubmission
- **Calculate batch submission frequency from SLA constraints.** Given a promised end-to-end
  SLA and the batch processing window, the submission interval is what makes the worst case
  fit: to guarantee a **30-hour SLA** with a **24-hour** batch processing window, submit on a
  **4-hour** cadence — a document arriving just after a submission waits up to 4 hours to be
  included, then up to 24 hours to process, for a 28-hour worst case inside the 30-hour
  promise, with margin for retrieval and downstream handling. Have the learner do this
  arithmetic in general form: *submission interval + processing window + handling overhead ≤
  SLA*. This is fit-and-feasibility reasoning, not pricing
- Use **prompt refinement on a sample set before batch-processing large volumes** to
  maximize first-pass success rates. A batch is committed the moment it is submitted: you
  cannot inspect intermediate results and adjust. Iterating the prompt on a few dozen
  representative documents synchronously, then submitting the full volume, converts a
  potential whole-batch failure into a cheap pre-flight. This is where sessions 8 and 11 pay
  off inside a batch design
- Explain **streaming** as a *perceived* latency improvement only — it is **not** a
  throughput or cost lever — and say when the distinction matters: a human watching output
  appear versus a pipeline consuming a complete response. Streaming does nothing for a
  nightly pipeline. This is negative knowledge that prevents a specific wrong answer, not
  implementation detail
- Choose the right split when a workload has both interactive and bulk components, and say
  what each half gets

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Independent review instance vs. self-review instruction | Does the reviewer still hold the reasoning that produced the work? |
| Independent instance vs. more extended thinking | Is the problem insufficient effort, or a biased starting context? |
| Single pass vs. per-file + cross-file passes | Is the change large enough to dilute attention across files? |
| Cross-file pass separate vs. appended to the per-file pass | Would global reasoning re-dilute the local pass? |
| Raw self-reported confidence vs. calibrated routing | Is that number ordered in a way you've measured? |
| Batch vs. synchronous | Is anyone — or any merge queue — waiting on this specific result? |
| Batch vs. synchronous for a blocking check | Does a 24-hour window with no SLA fit a pre-merge gate? |
| Batch vs. an agentic loop | Does the unit of work need multi-turn tool calling? |
| Resubmit failed IDs modified vs. resubmit the batch | Did the failures fail for a reason a rerun would repeat? |
| Submit continuously vs. on a calculated cadence | Does the worst-case wait plus the window fit the SLA? |
| Refine on a sample first vs. submit the full volume | Can you inspect and adjust mid-batch? (No.) |
| Streaming vs. buffered | Is a human watching the output appear? |
| Split interactive/bulk vs. one path | Do the two halves have different latency requirements? |

## How to run this session

1. **Frame** — two task statements, one directly sampled (4.6, official sample Q12) and one
   arithmetic-scoreable (4.5). Say both. Then say the 4.6 crux as one sentence and tell the
   learner it should feel familiar from sessions 2 and 3.
2. **Open 4.6 by asking, not telling.** Give a scenario: an agent generated a 900-line
   change and the team wants it reviewed. Someone proposes appending "now review your work
   critically" to the same session; someone else proposes raising the thinking budget. Ask
   which is better. Let them argue, then supply the reason both are weak — the generating
   model retains its reasoning context and is less likely to question its own decisions.
3. **Land independence as the answer.** An independent review instance without that
   reasoning context. Ask what the independent instance *loses* (the rationale for
   deliberate choices) and what that costs — this is where a good learner notices review
   comments arguing against intentional decisions, and where the PR description earns its
   keep.
4. **Teach multi-pass decomposition as recognition.** Point back at session 2 explicitly:
   the same decompose-into-focused-passes idea. Have the learner design the passes for a
   40-file change before you give the structure. Then name the two costs of the single pass:
   **attention dilution** and **contradictory findings**. Insist on both terms.
5. **Push on the cross-file pass.** Ask why it can't just be an extra instruction on the
   per-file pass. The answer is that global reasoning reintroduces the dilution the
   decomposition removed.
6. **Teach the verification pass and connect it to session 12.** The model self-reports
   confidence alongside each finding. Ask what makes that number usable — the learner just
   learned calibration against a labeled set, so drive them to it. Then the routing:
   high-confidence findings straight to comments, the rest held. Say *calibrated review
   routing* as the phrase.
7. **Pivot to 4.5. Verify first.** Fetch the batch docs and confirm the current discount,
   window, and limits before teaching a number. State the § 17 figures — 50%, up to 24
   hours, no guaranteed latency SLA — and model the verification discipline out loud rather
   than skipping it.
8. **Teach the batch trade, then test the boundary.** Give six workloads and have the
   learner sort batch-appropriate from not, naming the deciding fact each time. Include a
   **pre-merge CI check** (not batch — blocking, and the cost argument is a trap), a nightly
   test-generation job (batch), a high-volume user-facing path (not batch), and one whose
   unit of work is an agentic tool-calling loop (**not batch — no multi-turn tool calling**,
   a capability disqualification that lands before latency or cost).
9. **Teach streaming honestly.** It changes perception, not throughput or cost. Ask what it
   does for a nightly pipeline: nothing. Confirm they see why, then move on — this is a
   one-minute correction, not a topic.
10. **Do the SLA arithmetic together.** Work the stated case: a 30-hour end-to-end SLA
    against a 24-hour processing window gives a 4-hour submission cadence. Walk the worst
    case out loud — arrival just after a submission, full window, then handling — and get
    the general form on the board: *submission interval + processing window + overhead ≤
    SLA*. Then hand them a second one with different numbers to do alone. Frame it as fit
    and feasibility, not pricing.
11. **Teach partial failure and selective resubmission.** Some requests failed: context
    limit exceeded on three long documents, `max_tokens` on two. Ask what to resubmit. Drive
    to `custom_id`-selected failures only, **with modifications** — chunk the long ones —
    and make them say why an unmodified rerun repeats the failure.
12. **Teach the sample-set pre-flight.** Ask what you can inspect mid-batch. Nothing. Then:
    what do you do before committing 200,000 documents? Refine the prompt on a representative
    sample synchronously to maximize the first-pass success rate. Connect back to sessions 8
    and 11 — this is where criteria, examples, and schema design get their final iteration.
13. **Decision table** — walk all thirteen rows.
14. **Scenario drill — 6 questions.** Use a single system with both halves: a repository
    with an automated code-review pipeline and a nightly job that regenerates test coverage
    reports across 15,000 files, under one budget and a published 30-hour turnaround promise
    for the nightly output. Ask: how to structure the review of a large change; why an
    independent instance beats self-review or more thinking; what a single pass loses; which
    of the two paths can batch and which cannot, and why the pre-merge check cannot; the
    submission cadence; and one partial-failure item. Include one multiple-response.
15. **Distractor autopsy** — expect: self-review with a stronger instruction; extended
    thinking offered as a substitute for independence; one big review pass justified by
    "more context is better"; batch chosen for a pre-merge check because it is cheaper;
    batch chosen for an agentic loop; streaming offered as a throughput fix; resubmitting the
    whole batch; and resubmitting failures unmodified.
16. Record per `.agents/TUTORIAL.md` Step 5. Glossary `custom_id`, "attention dilution", and
    the batch limits verified live.

## Out of scope

Defer and say where it's covered:
- Rate limits, quotas, and API pricing calculations — § 17 Out-of-Scope. The SLA cadence
  arithmetic here is a fit-and-feasibility judgment, not a pricing calculation; do not
  extend it into cost modeling
- Streaming API implementation and server-sent events — § 17 Out-of-Scope. The permitted
  depth is the *conceptual* correction above: streaming is perceived latency only
- Prompt caching mechanics — permitted depth is *that it exists* → session 6
- Task decomposition in general, the prerequisite this session reapplies → session 2
- Subagent spawning, context passing, and coordinator patterns → session 3
- Schema design for the review pipeline's output → session 11
- Confidence calibration against labeled sets, and human review queue design → session 12
- CI/CD pipeline configuration, permissions, sandboxing, and prompt injection from untrusted
  PR input → session 21 (Iterative Refinement and CI/CD Integration)
- Full cost optimization and model selection → Tier 3 sessions 4 and 9
