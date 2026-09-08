# Production Reliability Patterns — P2 Solution Design & Architecture

**Exam weight: 17%**

## What this session assumes

Sessions 4–5. Tier 1 session 15 covered escalation and state; this raises it to
production reliability engineering.

## Why this domain is worth 17% of your score

The Professional exam is explicitly weighted toward **production reliability patterns**.
The distinguishing idea at this altitude: an LLM-based component is a *probabilistic
dependency*, so reliability comes from the system around it — validation, fallbacks,
circuit breakers, idempotency, and observability — not from making the model more
reliable. Exam answers that try to fix reliability inside the prompt are usually wrong.

## Authoritative sources

**Failure handling**
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://platform.claude.com/docs/en/build-with-claude/fallback-credit>
- <https://platform.claude.com/docs/en/api/errors>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>

**Consistency**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>

**State, recovery, and observability**
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://code.claude.com/docs/en/agent-sdk/session-storage>
- <https://code.claude.com/docs/en/agent-sdk/file-checkpointing>
- <https://code.claude.com/docs/en/agent-sdk/observability>
- <https://code.claude.com/docs/en/agent-sdk/cost-tracking>

**Limits and spend as reliability concerns**
- <https://platform.claude.com/docs/en/manage-claude/rate-limits-api>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>

## Teaching objectives

By the end, the learner can:

- Treat the model as a **probabilistic dependency** with a non-zero failure rate, and design
  the surrounding system to absorb that rather than trying to eliminate it
- Build the **validation boundary**: never let unvalidated model output reach a
  side-effecting system, and place validation where a failure is still recoverable
- Design **fallback ladders** deliberately — retry, different prompt, different model,
  cached or default response, human, hard failure — and specify the trigger and ceiling
  for each rung
- Apply **circuit breakers** to model and tool dependencies, and explain what a breaker
  does that retry alone doesn't
- Design **idempotency** across the whole agentic flow, not just single tools, so a
  replayed invocation can't double-execute
- Distinguish the failure classes and their distinct handling: API errors, rate limits,
  refusals, truncation, malformed output, semantically-wrong-but-well-formed output, and
  agent non-termination
- Recognize **semantically wrong but well-formed output** as the hardest class — it passes
  schema validation and fails silently — and design detection for it (invariant checks,
  cross-validation, sampling with review)
- Define **SLOs for a probabilistic system**: what you can promise, what you measure, and
  why "correct answers" needs an operational definition
- Build **observability that makes an agent debuggable**: the decision points, tool calls,
  and context state — not just the final output
- Design **runaway protection**: token, cost, iteration, and wall-clock ceilings, and what
  happens at each

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Validate output vs. trust it | Does anything side-effecting consume it? |
| Retry vs. fallback model vs. human | Is the failure transient, capability-related, or ambiguous? |
| Circuit breaker vs. retry with backoff | Is the dependency degraded, or momentarily busy? |
| Schema validation vs. semantic validation | Could the output be well-formed and still wrong? |
| Checkpoint vs. replay from start | Is the completed work expensive or side-effecting? |
| Cache a default vs. fail | Is a stale answer better than none for this consumer? |

## How to run this session

1. **Frame** — reliability lives in the system around the model. State that prompt-level
   fixes are usually the wrong answer to a reliability question on this exam.
2. **Teach the probabilistic-dependency framing.** Ask what the system's error rate should
   be if the model is right 97% of the time. Lead them to: it depends entirely on what's
   built around it.
3. **Teach the validation boundary.** Give a flow where model output drives a payment and
   have them place validation. Then ask what validation *can't* catch.
4. **Teach fallback ladders.** Have them design one for a specific workload, specifying
   every trigger and ceiling. Push until it's complete — vague ladders are the common defect.
5. **Teach circuit breakers** and the distinction from retry.
6. **Teach flow-level idempotency**, extending Tier 1 session 13 from tools to whole flows.
7. **Teach the failure taxonomy** with a routing exercise across all seven classes.
8. **Teach the silent-failure class** as the session's most important idea. Ask how they'd
   detect an extraction that's valid JSON with a wrong value. Supply invariant checks,
   cross-validation, and sampled human review if they don't reach them.
9. **Teach SLOs for probabilistic systems.** Ask what they'd promise a business owner, and
   how they'd measure it. Connect forward to session 7.
10. **Teach agent observability** — what to log so a bad run is diagnosable later.
11. **Teach runaway protection** — all four ceilings.
12. **Decision table** — walk all six rows.
13. **Scenario drill — 5 questions**, standalone Professional format. Include a validation
    placement, a fallback ladder critique, a silent-failure detection question, an
    idempotency question, and one multiple-response on failure classification.
14. **Distractor autopsy** — expect prompt-level fixes for reliability problems, and
    schema validation trusted to catch semantic errors.
15. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Eval design and regression detection → session 7
- Guardrails against adversarial input → session 8
- Governance-mandated controls → sessions 10–11
- Incident communication → session 12
