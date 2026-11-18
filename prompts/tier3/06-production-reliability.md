# Production Reliability Patterns — P3 Integration

**Exam weight: 21%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P3.4 — Instrumentation and Monitoring Gaps: Analyzing the instrumentation gap in a scaled
  agentic architecture where a described failure went undetected, and selecting the
  monitoring strategy that would have surfaced it.
- P3.8 — Production Reliability Controls: Analyzing the failure pattern in error traces or
  throughput data from a production integration, and specifying the reliability control
  (rate-limit handling, retry and backoff, idempotency for side-effecting tools, or fallback
  routing) that addresses it without introducing duplicate effects.
- P4.5 — Root-Cause Isolation from Logs and Traces: Isolating the root cause of a failing
  Claude system from its logs or traces among prompt failure, retrieval failure,
  hallucination, tool or subagent error, and model mismatch, and specifying the corrective
  action.

## What this session assumes

Sessions 31–32. Tier 1 sessions 7 and 12 covered error propagation and retry at the
single-call level, and sessions 4 and 9 covered state, handoff, and escalation; this raises
them to production reliability engineering, read from traces.

## Why this domain is worth 21% of your score

P3 Integration is the largest Professional domain at 21%, and P4.5 adds a piece of P4. The
distinguishing idea at this altitude: an LLM-based component is a *probabilistic
dependency* inside a distributed system, so reliability comes from the system around it —
enforceable controls in the client and the tools, and instrumentation that sees the
failure — not from making the model more reliable. v1.1's Sample 2 is this session in one
item: an answer that fixes a reliability failure with a prompt instruction relies on model
behaviour rather than an enforceable guard, and is wrong.

## Session focus

This session is diagnosing a production failure from its artifact — an error trace, a throughput graph, a log of a run — and selecting the control, the monitor, or the corrective action that fits it. The crux is **read the evidence before choosing the fix**: the trace says whether a duplicate came from a retry meeting a side effect (idempotency, not timeout tuning), whether a wrong answer came from what entered context or from what the model did with it (retrieval failure vs. hallucination), and whether a failure went unseen because nothing measured it (an instrumentation gap, not a model problem). Spend disproportionate time on two things: the five-way root-cause isolation for P4.5, where learners default to "fix the prompt", and the "without introducing duplicate effects" clause of P3.8 — every retry and every fallback route on a side-effecting call is a duplicate waiting to happen unless the tool can recognize the repeat. Keep the hardest silent-failure class in view throughout: **semantically wrong but well-formed output** passes schema validation and every HTTP-level monitor.

## Authoritative sources

**Errors, rate limits, and retry (P3.8)**
- <https://platform.claude.com/docs/en/api/errors>
- <https://platform.claude.com/docs/en/api/rate-limits>
- <https://platform.claude.com/docs/en/manage-claude/rate-limits-api>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://platform.claude.com/docs/en/build-with-claude/fallback-credit>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>

**Diagnosing from traces (P4.5)**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>

**State, recovery, and observability (P3.4)**
- <https://code.claude.com/docs/en/agent-sdk/observability>
- <https://code.claude.com/docs/en/agent-sdk/cost-tracking>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://code.claude.com/docs/en/agent-sdk/session-storage>
- <https://code.claude.com/docs/en/agent-sdk/file-checkpointing>
- <https://code.claude.com/docs/en/monitoring-usage>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>

## Teaching objectives

By the end, the learner can:

**P3.8 — reliability controls from error traces and throughput data**

- Treat the model as a **probabilistic dependency** with a non-zero failure rate, and design
  the surrounding system to absorb that rather than trying to eliminate it
- Read the failure pattern from the artifact and map it to one of the four named controls:
  - **Rate-limit handling** — a burst of rate-limit errors at a traffic peak: honour the
    server's retry guidance, cap client-side concurrency, and queue rather than fan out.
    Past the limit, more concurrency *reduces* throughput (session 32)
  - **Retry and backoff** — transient errors (rate limit, overload, timeouts): exponential
    backoff with jitter, a retry ceiling, and retry only on errors that are retryable. A
    synchronized retry wave is a retry storm; jitter breaks it
  - **Idempotency for side-effecting tools** — a duplicate effect in the trace (a second
    payment, a second ticket) where the first attempt executed but the caller never saw
    the result: attach an idempotency key so the tool returns the original result on a
    repeat. Tuning timeouts or retry counts only makes the race rarer; a prompt
    instruction cannot help because the retry happens in the client wrapper, where the
    model never sees the earlier result
  - **Fallback routing** — sustained overload or outage of one model, region, or surface:
    route to an alternative, with a **circuit breaker** so the system stops hammering a
    degraded dependency (the breaker does what retry alone does not — it stops trying).
    Specify the trigger and ceiling for each rung of the fallback ladder (retry,
    different model, cached or default response, human, hard failure)
- Apply the **"without introducing duplicate effects"** test to every control: a retry, a
  fallback reroute, or a replay from checkpoint re-sends a request whose first attempt may
  have executed. Any of them on a side-effecting call needs idempotency first. Extend this
  across whole flows, not just single tools, so a replayed agent run cannot double-execute
- Reject controls that change throughput but not semantics: batch processing is not a fit
  for synchronous side-effecting actions and does nothing about duplicates
- Verify the current error types, which are retryable, and the rate-limit response headers
  from live docs before teaching them by name

**P4.5 — root cause among five categories, from logs and traces**

- Isolate the root cause among the five categories P4.5 names, by the trace evidence that
  distinguishes each, and give the corrective action:

  | Category | What the trace shows | Corrective action |
  |---|---|---|
  | **Prompt failure** | The model did what the prompt said; the prompt was ambiguous, underspecified, or contradictory for this input class. Failure is consistent across runs | Revise the prompt (session 42 owns P2.2's revision skill) |
  | **Retrieval failure** | The content needed to answer never entered context — absent from the retrieved chunks or search results | Fix retrieval (query, depth, index, ranking); no prompt work fixes it (session 30) |
  | **Hallucination** | The needed content *was* in context, or nothing supported the claim, and the output asserts something unsupported by it | Grounding, citations, permission to say "I don't know", verification against a source of truth |
  | **Tool or subagent error** | A tool returned an error, empty, or malformed result — or a subagent failed — and the caller treated it as success and kept going | Fix the tool or its error propagation: structured error results, status fields, the orchestrator checking them |
  | **Model mismatch** | The model is wrong for the task, not misbehaving: failures concentrate on the hardest-reasoning cases, or a large tier is too slow for a trivial one | Change tier or route by difficulty (session 31 owns P2.1) |

- Investigate in order of what entered context: check retrieval and tool results *before*
  blaming generation. A wrong answer with the right evidence in context is hallucination
  or prompt failure; a wrong answer with the evidence missing is retrieval or tool error
- Recognize **model mismatch** as the category most often misdiagnosed as a prompt
  problem, and **tool or subagent error** as the one most often misdiagnosed as
  hallucination (the model faithfully summarized an empty result)

**P3.4 — the instrumentation gap where a failure went undetected**

- Ask, for a failure that went unseen, **what was measured and why it could not see this**:
  HTTP status, error rate, and mean latency are blind to a well-formed wrong answer, a
  silently truncated output, a subagent that returned "no results", or a cost runaway
- Recognize **semantically wrong but well-formed output** as the hardest class — it passes
  schema validation and fails silently — and select detection for it: invariant checks,
  cross-validation against a source of truth, and sampled review (human or calibrated
  judge, session 34)
- Select the monitoring strategy that would have surfaced *the described* failure, from:
  per-step traces of decision points, tool calls, and context state (not just final
  output); tool-result and subagent status rates; retrieval hit signals; stop-reason
  distribution (truncation); refusal rate; cost and tokens per task; input-distribution
  drift; and sampled quality scoring. A strategy that monitors a different failure is a
  distractor, however good
- Place the **validation boundary** so unvalidated model output never reaches a
  side-effecting system, and know what validation cannot catch — which is what monitoring
  is for
- Define **SLOs for a probabilistic system** with an operational definition of "correct"
  so there is something to alert on
- Design **runaway protection** as both a control and a signal: token, cost, iteration,
  and wall-clock ceilings, alerting when they trip

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Idempotency key vs. timeout/retry tuning | Did the side effect execute before the caller saw the result? |
| Retry with backoff vs. circuit breaker / fallback route | Is the dependency momentarily busy, or degraded? |
| Rate-limit handling vs. more parallelism | Are the errors throttling at a peak? |
| Enforceable control vs. prompt instruction | Does the failure happen where the model can see it? |
| Retrieval failure vs. hallucination | Was the needed content in context? |
| Tool/subagent error vs. hallucination | Did a tool or child return an error or empty result the caller ignored? |
| Prompt failure vs. model mismatch | Does it fail on an input class, or on the hardest-reasoning cases? |
| Which monitor would have caught it | What signal did this failure change that current monitoring doesn't read? |
| Schema validation vs. semantic validation | Could the output be well-formed and still wrong? |
| Checkpoint vs. replay from start | Is completed work expensive or side-effecting? |

## How to run this session

1. **Frame** — reliability lives in the system around the model, and every item gives you
   an artifact to read first. State that prompt-level fixes are usually the wrong answer to
   a reliability question on this exam, and why (Sample 2's logic).
2. **Teach the probabilistic-dependency framing.** Ask what the system's error rate should
   be if the model is right 97% of the time. Lead them to: it depends entirely on what's
   built around it.
3. **Teach the four P3.8 controls from traces.** Show four artifacts — a burst of
   rate-limit errors at a peak, a retry wave with synchronized timestamps, a duplicated side effect after a
   client timeout, a sustained error rate from one provider region — and have the learner
   name the control for each. Do not use Sample 2's wording; build your own side-effecting
   tool (a ticket, a refund, a shipment).
4. **Teach "without introducing duplicate effects."** Take their fallback-routing answer
   from step 3 and ask what happens if the primary actually executed before it timed out.
   Drive to idempotency as a precondition for every retry, reroute, and replay, then extend
   it to whole flows and checkpoints.
5. **Teach the fallback ladder and circuit breaker** — have them specify every trigger and
   ceiling. Vague ladders are the common defect.
6. **Teach P4.5 root-cause isolation.** Give five short traces, one per category, without
   labels, and have them classify and prescribe. Then give two harder ones: a correct-looking
   summary of an empty tool result (tool error, not hallucination), and failures only on the
   multi-step-reasoning cases (model mismatch, not prompt). Insist they cite the trace line
   that decided it.
7. **Teach the silent-failure class** as the bridge to P3.4. Ask how they'd detect an
   extraction that's valid JSON with a wrong value. Supply invariant checks,
   cross-validation, and sampled review if they don't reach them.
8. **Teach P3.4 instrumentation gaps.** Describe an incident that ran for a week unseen
   (e.g. a subagent silently returning nothing after an upstream API change while
   dashboards stayed green). Ask what was monitored, why it missed this, and which single
   monitor would have caught it. Then run the selection against three other incidents.
9. **Teach SLOs and runaway ceilings** briefly, as what monitoring alerts against.
10. **Decision table** — walk all ten rows.
11. **Scenario drill — 6 questions**, standalone Professional format, each with a trace,
    log excerpt, or throughput description in the stem. Include a duplicate-effect item, a
    rate-limit or retry-storm item, a fallback-routing item, two root-cause items (one
    retrieval-vs-hallucination, one tool-error or model-mismatch), and one instrumentation-gap
    item. Make one multiple-response.
12. **Distractor autopsy** — expect prompt-level fixes for reliability problems; timeout or
    retry-count tuning offered where the mechanism is a retried side effect; fallback
    routing or replay proposed with no idempotency; batch offered for a synchronous
    side-effecting path; "improve the prompt" for a retrieval failure or a tool error;
    hallucination blamed when a tool returned nothing; schema validation trusted to catch
    semantic errors; and a monitor that is good but would not have seen the described
    failure.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Which component fails first under load, and decomposition review → session 32
- Eval design and regression detection → session 34
- Guardrails and the injection surface → session 35
- Cost and latency telemetry and optimization (P4.6) → session 36
- Governance-mandated controls → sessions 37–38
- Runbooks in an operational handoff (P6.3) → session 40
