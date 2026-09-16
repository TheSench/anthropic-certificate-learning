# Tool Errors and Tool Distribution — F4 Tool Design & MCP Integration

**Exam weight: 18%**

## What this session assumes

Sessions 3 (coordinator-subagent orchestration), 7 (reliability across agents), 11
(structured output via tool use and JSON schemas), and 14 (designing tool interfaces).
Session 14 established that a tool description is the model's basis for choosing; this
session applies the same framing to what a tool *returns* when it fails. Session 3
established per-role subagents and the coordinator; session 7 established error propagation
across agents, which this session references rather than repeats. Session 11 established that
the model can be held to a defined output shape, which is what makes structured error
metadata worth designing. This session owns § 6 tasks **2.2 — "Implement structured error
responses for MCP tools"** and **2.3 — "Distribute tools appropriately across agents and
configure tool choice."**

## Why this domain is worth 18% of your score

The F4 domain description names **structured error responses with retry logic** explicitly,
and tool distribution is where F4 and F1 questions overlap — a multi-agent scenario asking
"why is this agent unreliable" often has a tool-distribution answer rather than an
orchestration one. Both tasks here are mechanism-heavy in a way the rest of F4 is not: the
exam expects the literal field names on an error payload and the literal `tool_choice`
values, not a paraphrase of the concept. Two tasks in one session makes this the densest F4
session; budget accordingly.

## Session focus

This session covers what a tool returns when it fails, and which agent gets to call it at
all. The crux is that **an error message is a prompt — `isError` plus `errorCategory` and
`isRetryable` let the model make a recovery decision that a uniform generic error cannot.**
Spend disproportionate time there, and teach the **literal field names**, not only the
concept: `isError`, `errorCategory`, `isRetryable`, `retriable: false`. A learner who can
describe the four kinds of failure but cannot recognise `errorCategory` on an option will
lose the item. The second half is task 2.3, and its crux is a mechanism swap the learner
will get wrong from intuition: **too many tools degrades tool *selection reliability* by
increasing decision complexity** — it is not primarily a token-cost argument. Give the
numeric shape (18 tools where 4–5 would do) and teach selection reliability as the stated
mechanism. Land `tool_choice` with its literal values, including the forced form, which
appears nowhere else in the curriculum in its JSON shape.

## Authoritative sources

Verify the error-payload field names and `tool_choice` values against live docs before
teaching them — but teach the names, not a hedge.

**Tool call handling and error results**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>

**Tool choice and the request contract**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference>
- <https://platform.claude.com/docs/en/api/messages>

**Stop reasons and API-level failure**
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/api/errors>

**Scoping the tool surface**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/agent-sdk/subagents>

## Teaching objectives

### Task 2.2 — structured error responses

By the end, the learner can:

- Treat a tool error as **context, not an exception**: the model reads it and chooses the
  next action, so its wording and its structure decide whether the model recovers, retries
  usefully, or loops
- Name what a **uniform generic error** costs. A tool that returns `"Operation failed"` for
  a timeout, a malformed argument, a policy refusal, and a permission denial has collapsed
  four different recovery paths into one string, and **prevents the agent from making an
  appropriate recovery decision** — it cannot tell whether to retry, to fix its arguments, to
  explain something to the customer, or to stop. The learner must be able to say this as a
  cause, not just as a stylistic complaint
- Signal failure through the protocol: an MCP tool result sets the **`isError`** flag rather
  than returning a success payload whose text describes a failure. Say why the flag matters
  independently of the message — it lets the caller distinguish a failed call from a
  successful call that returned bad news, before anything parses the prose
- Carry the classification in **structured metadata**, by name:
  - **`errorCategory`** — the enum, with **three** values: **`transient`**, **`validation`**,
    **`permission`**
  - **`isRetryable`** — the boolean that tells the model whether trying the same call again
    could plausibly succeed. Name why it matters: it **prevents wasted retries** against
    errors that can never succeed
  - **`retriable: false`** — the literal form the guide uses to signal a **business rule
    violation**, which is not one of the three `errorCategory` values. A business refusal is
    a well-formed call the system rejected on *rules*, and it is marked non-retriable rather
    than given its own category
  - a **human-readable description** of what failed and what to do instead — the field the
    model actually reasons over
- Reconcile the counting explicitly, because the mismatch is confusing and the exam tests
  both halves: there are **four kinds of failure** — transient, validation, business,
  permission — but **`errorCategory` enumerates only three** of them, with business signalled
  through `retriable: false`. Teach it that way round and say so out loud. Do not invent a
  fifth category: a credential-expired failure maps to **permission**
- Route each of the four correctly:
  - **Transient** (timeout, service unavailable, upstream 503, rate limit) → retryable;
    retry with backoff **in code**, not in the model's loop. Letting the model retry a rate
    limit burns context on a wait it cannot perform
  - **Validation** (invalid or malformed input) → not retryable as-is; return to the model
    with the *specific* problem so it can correct its arguments and call again
  - **Business** (policy violation — refund above the limit, account ineligible) → not
    retryable, `retriable: false`. Return a **customer-friendly explanation** the agent can
    relay verbatim plus the alternative path. This is the category teams collapse into a
    generic failure, and doing so leaves the agent retrying a decision that will never change
  - **Permission** (caller not authorized for this record or action) → not retryable; say so
    plainly so the model stops and adapts rather than probing
- Write a **customer-facing** explanation for a business rule violation and check it by
  reading it aloud: if the agent relayed this to a customer verbatim, would it be acceptable?
  Internal rule IDs and stack traces fail that test
- Implement **local error recovery within subagents** for transient failures, and propagate
  to the coordinator **only what cannot be resolved locally** — and when propagating, include
  **the partial results obtained and what was attempted.** A subagent that swallows three
  timeouts, recovers, and returns clean results is doing its job; a subagent that reports
  "failed" with nothing else forces the coordinator to redo work it could have kept. Session
  7 owns the cross-agent propagation and provenance side — reference it, do not re-teach it;
  what belongs here is the *tool-level* decision of what a subagent handles itself
- Distinguish an **access failure** from a **valid empty result**: a search that errored and a
  search that succeeded and matched nothing are different facts. Returning empty for both
  destroys the agent's ability to decide what to do next — it cannot tell "retry or escalate"
  from "there is genuinely nothing here, move on"
- Prevent the **retry loop**: identical call, identical error, repeated. Either the error must
  change what the model knows, or the loop must be cut. Set ceilings at both levels — per tool
  call and per agent loop — and say what happens at each ceiling
- Design **idempotency** for side-effecting tools so a retry cannot double-charge or
  double-send
- Decide what an error must *not* reveal — stack traces, internal hostnames, other users'
  data — since error text enters the model context and may reach a user

### Task 2.3 — tool distribution and tool choice

By the end, the learner can:

- State the mechanism correctly: **giving an agent too many tools degrades tool selection
  reliability by increasing decision complexity.** Use the guide's shape — an agent holding
  **18 tools where 4–5 would serve its role** — and give the numeric target as the remedy.
  Token overhead is real and secondary; if the learner reaches for it as the primary
  argument, correct them. The scored mechanism is selection reliability
- Explain **why an agent holding tools outside its specialization tends to misuse them**: the
  tool is available, it is superficially relevant, and the agent reaches for it instead of
  doing the job it was delegated. A synthesis agent that can search the web starts searching
  rather than synthesizing, and its output degrades in a way that looks like a prompting
  failure and is not
- **Restrict each subagent's tool set to its role.** Distribution is a design decision made at
  subagent definition time, not an emergent property. Pair it with session 3's per-role
  subagent definitions
- Provide **scoped cross-role tools for specific high-frequency needs** rather than either
  extreme. When one role genuinely needs a neighbor's capability often, hand it a **narrow,
  scoped version** of that tool and **route the complex cases back through the coordinator.**
  Make the learner state the ratio argument: if 85% of the need is a simple lookup, a scoped
  tool serves it directly and the coordination path stays available for the remaining 15%.
  The two failing extremes are handing over the general tool (misuse, decision complexity) and
  routing everything through the coordinator (latency and coordination overhead on cases that
  did not need it)
- Replace a generic tool with a **constrained alternative** rather than removing capability
  outright. The guide's example: replace `fetch_url` — which will fetch anything, including
  things the role has no business fetching — with **`load_document`**, which validates that
  the URL is a document and refuses the rest. This is the tool-distribution analogue of
  session 14's split: the narrowing lives in the tool, not in an instruction asking the agent
  to be careful
- Configure **`tool_choice`** with its literal values:
  - **`"auto"`** — the model decides whether to call a tool at all. The default, and correct
    when a plain textual answer is sometimes the right output
  - **`"any"`** — the model must call *some* tool, but chooses which. Correct when the turn
    must produce an action and the choice still needs judgment
  - **forced** — **`{"type": "tool", "name": "..."}`** — the model must call *that specific*
    tool. Correct when the call is not a judgment at all: a known extraction step, a
    guaranteed structured output. Session 11's structured-output enforcement is the canonical
    use
  - The tell across the three: is the *whether* in question, the *which*, or neither? Forcing
    a specific tool where the choice carries judgment throws away the reason you used a model
- Diagnose an unreliable multi-agent system to a distribution cause rather than a prompting
  one: too many tools per agent, tools outside the role, a generic tool where a constrained
  one belongs, or everything routed through a coordinator that did not need to see it

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Generic error vs. structured error payload | Does the agent have to choose a recovery path? (It always does) |
| Retry in code vs. return to the model | Would the *same* call plausibly succeed next time? |
| `errorCategory` value vs. `retriable: false` | Is it transient, validation, or permission — or is it a *business rule* refusal? |
| Business refusal vs. permission denial | Did the *rules* reject it, or the *caller's* access? |
| Error vs. valid empty result | Did the lookup fail, or succeed and find nothing? |
| Recover in the subagent vs. propagate | Can it be resolved locally — and if not, what partial results go up with it? |
| Idempotency key vs. plain retry | Does the tool have a side effect? |
| All tools to every agent vs. per-role sets | Is selection reliability degrading as the surface grows? |
| Scoped cross-role tool vs. route through the coordinator | What fraction of the need is the simple case? |
| Remove a tool vs. replace it with a constrained one | Is the capability wrong, or only its breadth? |
| `"auto"` vs. `"any"` vs. forced `{"type":"tool","name":"..."}` | Is the *whether* in question, the *which*, or neither? |

## How to run this session

1. **Frame** — F4 is 18%; this session owns two task statements, 2.2 and 2.3, and both are
   mechanism-heavy. Say plainly that the field names and the `tool_choice` values are
   themselves the tested content here, not just the ideas behind them.
2. **Teach error-as-context** with a direct comparison. Show `"Operation failed"` returned for
   four genuinely different failures, and ask what the agent can do with each. Drive to the
   stated cause: a uniform generic error prevents the agent from making an appropriate
   recovery decision.
3. **Teach the payload by name.** Write the structured alternative on the board: `isError`
   set on the result, plus `errorCategory`, `isRetryable`, and a human-readable description.
   Have the learner say what each field buys that the prose alone does not — `isRetryable`
   specifically prevents wasted retries against errors that can never succeed. Make them
   reproduce the field names from memory before moving on.
4. **Teach the four kinds and the three-value enum — and reconcile them explicitly.** Name
   transient, validation, business, permission. Then show that `errorCategory` carries only
   `transient`, `validation`, `permission`, and that a business rule violation is signalled
   with **`retriable: false`**. Say out loud that the counts differ and why it is worth
   remembering both. If the learner asks about a credential-expired failure, map it to
   **permission** — do not create a fifth category.
5. **Run the classification drill.** Give eight concrete failures and have the learner route
   each, state `errorCategory` (or `retriable: false`), and set `isRetryable`. Include an
   ambiguous 429 that could be a transient throttle or a hard quota and discuss how you would
   know; include a business refusal (a refund above the policy limit) and a permission denial
   on the same tool, since that is the distinction most often missed; include a lookup that
   legitimately returns nothing, to force the error-vs-empty discrimination. Then have them
   write the full payload for three of the eight, and check the description by reading it
   aloud as if to a customer.
6. **Teach the code-vs-model retry boundary.** Ask what happens when the model retries a rate
   limit itself. Let them reach it: tokens and context spent on a wait it cannot perform.
7. **Teach subagent-local recovery.** Give a research subagent hitting three transient
   timeouts and recovering, and a fourth failure it cannot resolve. Ask what goes up to the
   coordinator. Require all three parts of the answer: the unresolvable error, the partial
   results already obtained, and what was attempted. State explicitly that session 7 owns the
   propagation and provenance machinery, so they know how deep to go here.
8. **Teach idempotency and error hygiene** briefly — a payment or email tool, and what must
   never appear in error text given that it enters the model context.
9. **Pivot to 2.3 and break the intuition first.** Ask why an agent with 18 tools performs
   worse than the same agent with 5. Most learners will answer "tokens". Accept it as
   secondary and correct the primary: **selection reliability degrades because decision
   complexity increases.** Give the 4–5 target. Make them restate the mechanism in their own
   words before continuing.
10. **Teach specialization misuse.** Ask what a synthesis agent does when it can also search
    the web. Drive to: it searches instead of synthesizing. Name why that is a distribution
    bug and not a prompting bug — the capability being present is the cause.
11. **Teach scoped cross-role tools on the 85/15 case.** A synthesis agent needs to verify a
    fact mid-synthesis; most verifications are a single simple lookup. Offer three designs —
    give it the full search tool, route every verification through the coordinator, or give it
    a scoped `verify_fact` tool and keep the coordinator path for complex cases — and make
    them choose and defend. The third is the answer; make them articulate why each other
    option fails on the stated ratio.
12. **Teach the constrained replacement.** `fetch_url` → `load_document` that validates
    document URLs. Ask what this buys over an instruction telling the agent to only fetch
    documents.
13. **Teach `tool_choice`** with all three values written literally, including the forced
    form `{"type": "tool", "name": "..."}`. Give three scenarios and have them pick. Connect
    the forced case back to session 11's structured output.
14. **Decision table** — walk all eleven rows. For each, give a scenario and have them apply
    it before you give the answer.
15. **Scenario drill — 6 questions.** Use a multi-agent order-management system: a research
    subagent with a flaky inventory upstream, a payments tool with side effects, a customer
    lookup with strict permissions, and a synthesis agent that keeps searching instead of
    synthesizing. Ask for: the error payload for a business refusal returned as a generic
    failure; the `errorCategory` / `retriable: false` classification of two failures; what a
    subagent propagates versus handles locally; the scoped-cross-role-tool design for the
    85% case; a `tool_choice` selection including the forced form; and one on the
    error-vs-empty discrimination. Include one multiple-response.
16. **Distractor autopsy.** Expect: model-loop retries offered for transient failures;
    unbounded retry assumed as a default; business refusals treated as retryable; a
    generic-error fix offered as "improve the error message" without structure; token
    overhead offered as the primary reason too many tools hurt; routing every cross-role need
    through the coordinator; and forced `tool_choice` offered where the choice carries
    judgment.
17. Record per `.agents/TUTORIAL.md` Step 5. Glossary **`isError`**, **`errorCategory`**,
    **`isRetryable`**, **`retriable: false`**, **`tool_choice`**, and **scoped cross-role
    tool**.

## Out of scope

Defer and say where it's covered:
- Error propagation across agents, crash recovery, provenance through synthesis → session 7
  (tasks 5.3, 5.4, 5.6), already taught. Reference it when subagent-local recovery comes up;
  do not re-teach it
- Human escalation policy and ambiguity resolution → session 9 (task 5.2), already taught
- Writing the tool description itself, renaming, splitting → session 14 (task 2.1), already
  taught; this session assumes it
- MCP server configuration, `.mcp.json`, `~/.claude.json`, MCP resources → session 17
  (task 2.4)
- Built-in tool selection (Read, Write, Edit, Bash, Grep, Glob) → session 17 (task 2.5)
- Hooks intercepting tool calls for normalization → session 15 (task 1.5), already taught
- Production reliability at scale → Tier 3 session 6
- Observability and alerting → Tier 3 session 16
