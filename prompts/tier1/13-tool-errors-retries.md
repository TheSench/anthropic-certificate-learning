# Tool Errors, Retries, and Failure Modes — F4 Tool Design & MCP Integration

**Exam weight: 18%**

## What this session assumes

Tool Design and MCP Integration.

## Why this domain is worth 18% of your score

The F4 domain description names **structured error responses with retry logic**
explicitly. This is the most directly-scored micro-skill in the domain: an error message
is context the model reads and acts on, so a well-designed error makes the model
self-correct while a bad one makes it loop or give up. The exam rewards knowing that
distinction, and knowing which errors the model should *not* be asked to handle.

## Session focus

This session applies the Tool Design session's framing to failure: **an error message is a prompt**. The model reads it and chooses what to do next, so its wording decides whether the model recovers or loops. The crux is the **four-way failure classification** — transient, validation, business, permission — and routing each to the right handler, because the F4 domain description names structured error responses with retry logic explicitly. Teach those four by name and carry them in structured metadata (a category, a retryable flag, a readable description); *business* is the one learners collapse into "it failed", and it's the category with a customer-facing consequence. Spend the most time on the classification drill, and make sure the code-vs-model retry boundary lands: letting the model retry a rate limit burns context on a wait it cannot perform.

## Authoritative sources

**Tool call handling and errors**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>

**Stop reasons, refusals, and API-level failure**
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://platform.claude.com/docs/en/api/errors>

**Limits and backoff**
- <https://platform.claude.com/docs/en/manage-claude/rate-limits-api>

**Reliability practice**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://code.claude.com/docs/en/agent-sdk/troubleshooting>

## Teaching objectives

By the end, the learner can:

- Treat a tool error as **context, not an exception**: the model reads it and chooses the
  next action, so its wording determines whether the model recovers
- Write a structured error the model can act on — what failed, why, whether retrying could
  help, and what to do instead — and contrast it with an opaque error (`Error: 500`) that
  gives the model nothing to work with
- Signal failure through the protocol correctly: an MCP tool result sets the **`isError`**
  flag rather than returning a success payload describing a failure, so the model can tell
  a failed call from a successful one that returned bad news
- Classify failures into the **four categories the tool contract names**, and route each:
  - **Transient** (timeout, service unavailable, upstream 503, rate limit) → retryable;
    retry with backoff, in code
  - **Validation** (invalid or malformed input) → not retryable as-is; return to the model
    with the specific problem so it can correct the arguments and try again
  - **Business** (policy violation — refund over the limit, account ineligible) → not
    retryable; the call was well-formed and the system refused it on *rules*. Return a
    customer-safe explanation the agent can relay, plus the alternative path (escalate,
    offer a different remedy). This is the category teams most often collapse into a
    generic failure, and doing so leaves the agent retrying a decision that will never
    change
  - **Permission** (caller not authorized for this record or action) → not retryable;
    say so plainly so the model stops and adapts rather than probing
- Carry that classification in **structured metadata on the error**, not just prose: a
  category field, a retryable boolean, and a human-readable description. Name why the
  boolean matters — it prevents wasted retries against errors that can never succeed.
  Verify the exact field names and error-shape conventions against the live tool-use and
  MCP docs before teaching them; teach the four-way distinction as the durable part
- Separate **systemic** failures (dependency down, credential expired) from the four: they
  present as transient but escalate instead, because the model can't fix them and retrying
  only burns the loop
- Distinguish an **access failure** from a **valid empty result** — a search that errored
  and a search that legitimately found nothing are different facts, and returning empty
  for both destroys the agent's ability to decide what to do next
- Explain why transient retries belong in **code, not the model's loop**, and what happens
  when you let the model retry a rate limit
- Set **retry ceilings** at both levels — per tool call and per agent loop — and say what
  happens at the ceiling
- Recognize and prevent the **retry loop**: identical call, identical error, repeated. The
  error must change what the model knows, or the loop must be cut
- Design **idempotency** for tools with side effects, so a retry can't double-charge or
  double-send
- Decide what an error should *not* reveal — stack traces, internal hostnames, other
  users' data — since error text enters the model context and may reach a user
- Distinguish tool failure from model refusal from truncation, and handle each differently
- Define the **degraded path**: what the agent does when a tool is simply unavailable

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Retry in code vs. return to the model | Would the *same* call plausibly succeed next time? |
| Retry vs. fail fast | Is the failure transient, or one of the three that never self-heal? |
| Business refusal vs. permission denial | Did the *rules* reject it, or the *caller's* access? |
| Error vs. valid empty result | Did the lookup fail, or succeed and find nothing? |
| Verbose error vs. redacted | Could the text leak internals or other users' data? |
| Idempotency key vs. plain retry | Does the tool have a side effect? |
| Escalate to human vs. degrade gracefully | Can the task complete usefully without this tool? |
| Cap at the tool vs. at the loop | Is the runaway one bad call, or a bad plan? |

## How to run this session

1. **Frame** — an error message is a prompt. Same framing as tool descriptions, applied to
   failure.
2. **Teach the error-as-context idea** with a direct comparison: show `Error: 500` and a
   structured alternative for the same failure, and ask what the model can do with each.
3. **Teach the four-way classification** — transient, validation, business, permission —
   by name. Give eight concrete failures and have the learner route each and say whether
   it's retryable. This is the session's core drill. Include an ambiguous one (a 429 that
   *could* be transient or could mean a hard quota) and discuss how you'd know; include a
   business refusal (a refund above the policy limit) and a permission denial on the same
   tool, since separating those two is the distinction learners most often miss; and
   include a lookup that legitimately returns nothing, to force the error-vs-empty
   discrimination. Then have them write the structured error payload for three of the
   eight — category, retryable, description — and check that the description would make
   sense if the agent read it aloud to a customer.
4. **Teach the code-vs-model retry boundary.** Ask what happens if the model retries a rate
   limit itself: it burns tokens and context on a wait it can't perform. Let them reach it.
5. **Teach retry loops** by presenting one in a transcript and asking what would break the
   cycle. Both answers matter: change the error, or cut the loop.
6. **Teach idempotency** with a payment or email tool. Ask what a naive retry costs.
7. **Teach error hygiene** — what must not appear in error text, and why the model context
   is the reason.
8. **Teach failure-mode discrimination** — tool error vs. refusal vs. truncation.
9. **Teach the degraded path.** Ask what the agent should do when a tool is just gone.
10. **Decision table** — walk all eight rows.
11. **Scenario drill — 6 questions.** Use an order-management agent with tools for
    inventory (flaky upstream), payments (side-effecting), and customer lookup (strict
    permissions). Ask about classification, where each retry lives, idempotency, an error
    rewrite, and the degraded path. Add one item turning on a business refusal returned as
    a generic failure, where the agent retries a decision that will never change. Include
    one multiple-response.
12. **Distractor autopsy** — expect model-loop retries for transient failures, unbounded
    retry as an implied default, and business refusals treated as retryable.
13. Record per `.agents/TUTORIAL.md` Step 5.

**End of Tier 1.** All five F domains are now taught. Tell the learner Tier 2 is four
remaining scenario drills at exam difficulty, then the Foundations mock gate. Report
readiness across all five F domains and name the weakest.

## Out of scope

- Session state and recovery → Reliability & Escalation
- Human escalation policy design → Reliability & Escalation
- Production reliability at scale → Tier 3 session 6
- Observability and alerting → Tier 3 session 16
