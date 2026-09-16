# Enforcement, Handoff, and Session State — F1 Agentic Architecture & Orchestration

**Exam weight: 27% (highest of any Foundations domain)**

*Owns § 6 task statements 1.4 — Implement multi-step workflows with enforcement and
handoff patterns — and 1.7 — Manage session state, resumption, and forking.*

## What this session assumes

Sessions 1 and 3. From session 1: the agentic loop, harness vs. model, and that most
production failures are harness failures — this session is that claim applied twice, to
enforcement and to state. From session 3: the coordinator-subagent shape, context
isolation, `fork_session`, and that a subagent can only see what it was handed. Session 2
is useful background but not required here.

## Why this domain is worth 27% of your score

F1 is the largest domain on Foundations and this session closes it, carrying two of its
seven task statements. Both are scored as judgment calls rather than recall: given a
requirement that must hold every time, do you write it into the prompt or build it into
the harness; and given a session whose prior work may or may not still be true, do you
resume it or start fresh with a summary. The wrong answers in both families are the
comfortable ones — "instruct the model more clearly" and "resume, you already have the
context" — and they are wrong for the same underlying reason.

## Session focus

This session covers the two things that make a multi-step workflow survive its own boundaries: enforcement and handoff (1.4), and session state across resumption and forking (1.7). The crux is that **both halves are about what survives a boundary** — a gate between steps, a handoff to a human who never saw the transcript, a session crossing a restart — and in all three the question is the same: what is guaranteed to make it across, versus what you are merely hoping makes it across. Spend disproportionate time on the two judgment calls the exam actually scores: programmatic enforcement vs. prompt-based guidance when compliance must be deterministic, and resumption vs. a fresh session with an injected summary when prior tool results may be stale. Teach enforcement here as an *architectural* choice; the hook mechanism that implements it is session 15, and that ordering is deliberate — a gate is a design decision before it is an API.

## Authoritative sources

Fetch these to verify current behavior before teaching specifics.

**Enforcement and interception**
- <https://code.claude.com/docs/en/hooks>
- <https://code.claude.com/docs/en/agent-sdk/hooks>

**Multi-step workflows and handoff**
- <https://code.claude.com/docs/en/workflows>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing>

**Sessions, resumption, and forking**
- <https://code.claude.com/docs/en/sessions>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://code.claude.com/docs/en/cli-reference>

## Teaching objectives

By the end, the learner can:

### 1.4 — Enforcement and handoff

- Apply the decision rule that separates a workflow from an agentic step: *if you can
  enumerate the steps in advance, a workflow is the better design* — defensible on cost,
  testability, latency, and debuggability. § 6 1.1 draws this as **model-driven
  decision-making** (the model reasons about which tool to call next from context) versus
  **pre-configured decision trees or tool sequences**; use those words, because that is how
  an item will phrase it. Do **not** teach a three-way taxonomy with "conversational" as a
  third category — it is not exam vocabulary, it is not on an axis with the other two (a
  human-driven chat is a *posture*, not a control-flow shape), and a scenario that does not
  say who decides the next step cannot be keyed on it at all
- Design the **hybrid**, which is the usual right answer in production: a deterministic
  pipeline with one agentic step, placed exactly where judgment is genuinely needed. Say
  what each part buys — the pipeline gives reproducibility and bounded cost everywhere it
  covers, the agentic step gives handling of the case nobody enumerated
- Choose between **programmatic enforcement** (a gate in the harness that blocks the call)
  and **prompt-based guidance** (an instruction the model is asked to follow), on the tell
  that decides it: *is deterministic compliance required?* When it is — identity
  verification before a financial operation is the canonical case — **prompt instructions
  alone have a non-zero failure rate**, and a gate has none. Teach that phrase; the gap
  between "almost always" and "always" is the entire content of this decision, and the
  exam's distractors are all variations on making the prompt more emphatic
- Implement a **prerequisite gate**: block a downstream tool until an upstream step has
  actually completed, so a required *ordering* is guaranteed rather than requested. The
  canonical case is **blocking `process_refund` until `get_customer` has returned a
  verified customer ID**. Note that the gate is checked against the *result* — a verified
  ID came back — not against the fact that a call was attempted
- Say where enforcement belongs architecturally versus where it does not: a gate is
  correct for an invariant that must hold on every path, and over-applied it turns a
  flexible agent into a brittle pipeline with extra steps. The question is whether a
  violation is unacceptable or merely undesirable
- **Decompose a multi-concern customer request into distinct items, investigate each in
  parallel using shared context, then synthesize a unified resolution.** Name all three
  moves: one message can carry several independent problems, each is investigated
  separately against the same customer context, and what the customer receives is a single
  coherent answer — not three disconnected replies, and not one reply addressing whichever
  concern was mentioned first. State the failure mode this exists to prevent: partial
  resolution that reads as complete
- Compile a **structured handoff summary for a human agent who lacks access to the
  conversation transcript.** That clause is the whole design constraint — the receiving
  human cannot scroll back, so anything not in the summary is lost. The summary carries
  the customer details, the root cause as far as it was determined, what was already
  attempted and what it returned, what is blocked, and the recommended actions. Contrast
  with the failure it replaces: a handoff that says "escalating, see above" resets the
  customer to the start
- State the general rule both halves of 1.4 share: an agentic system's boundaries — between
  steps, and to a human — are where guarantees are lost unless something explicitly carries
  them across

### 1.7 — Session state, resumption, and forking

- Name the mechanisms by identifier: **`--resume <session-name>`** to continue a named
  session, named sessions themselves as the thing that makes a session addressable later,
  and **`fork_session`** to branch a session so the branch inherits the parent's context
  without contaminating the parent. § 17 lists all three in scope; the learner must
  recognize the exact spellings
- Make the judgment call the exam actually scores: **choose between session resumption
  (when prior context is mostly still valid) and starting fresh with an injected summary
  (when prior tool results are stale).** Teach it as a question about the *truth* of what
  is in the session, not about its convenience — the transcript is a record of what was
  true when the tools ran, and resumption reinstates all of it, accurate or not
- Explain **why starting a new session with a structured summary is more reliable than
  resuming with stale tool results**: a resumed session carries file contents, query
  results, and conclusions drawn from them as though they were current, and the model has
  no way to know which lines are now false. A structured summary is a deliberate selection
  of what is still true, so nothing stale is reinstated by default. The reliability
  argument is about what is *absent* from the fresh session as much as what is present
- Handle the specific case § 6 names: **inform the agent about changes to previously
  analyzed files when resuming after code modifications.** If you do resume, the delta is
  not optional — the agent's picture of those files is the version it read, and the gap is
  silent. State what the notice must contain: which files changed, and enough about how
  that the earlier conclusions can be re-examined rather than trusted
- Choose between resume, fork, and fresh on a single tell each: resume when the prior
  context is still true and you want to continue the same line of work; `fork_session`
  when you want that context but the new work should not pollute the original; fresh with
  a summary when the prior context contains results you can no longer vouch for
- Decide what session state must be durable versus what can be reconstructed, and say
  where the resumption point lives

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Programmatic enforcement vs. prompt-based guidance | Is deterministic compliance required, or is best-effort acceptable? |
| Prerequisite gate vs. ordering stated in the prompt | Is a single violation unacceptable, or merely undesirable? |
| Gate on the result vs. gate on the call being made | Does the prerequisite mean "attempted" or "returned a verified value"? |
| Deterministic pipeline vs. hybrid with one agentic step | Is there exactly one place judgment is genuinely needed? |
| Handle concerns serially vs. investigate in parallel then synthesize | Does the request carry multiple independent concerns? |
| Structured handoff vs. "escalating, see transcript" | Can the receiving human see the conversation? (Assume no.) |
| `--resume` vs. fresh session with a summary | Are the prior tool results still true? |
| `--resume` vs. `fork_session` | Should the new work's context land back in the original session? |
| Resume silently vs. resume with a change notice | Have any previously analyzed files been modified since? |

## How to run this session

1. **Frame** — this session closes F1 and owns two task statements. Name the unifying
   question in the first minute: what survives a boundary? Say the boundaries are a gate
   between steps, a handoff to a human, and a restart.
2. **Start from the workflow shapes and the enumerate-the-steps rule**, briefly — the
   learner needs the hybrid before they can place a gate in one. Have them locate the one
   step in a concrete pipeline where judgment is genuinely needed.
3. **Teach the enforcement decision by making them get it wrong first.** Give the refund
   scenario: the policy is that identity must be verified before any refund issues, and
   the proposed design is a clear, emphatic system prompt saying so. Ask whether that is
   sufficient. Accept their answer, then ask the question that decides it: over ten
   thousand refunds, how many violations is this design allowed? Land the phrase —
   **prompt instructions alone have a non-zero failure rate** — and let them derive that
   the compliance requirement, not the model's quality, is what rules the prompt out.
4. **Teach the prerequisite gate concretely**, still architecturally: block
   `process_refund` until `get_customer` has returned a verified customer ID. Then ask the
   sharpening question — does the gate check that `get_customer` was *called*, or that it
   *returned a verified ID*? The distinction is the whole implementation. Forward-reference
   plainly: "the hook mechanism that implements this, including the event names, is
   session 15 — a gate is a design decision before it is an API." Do not teach event names
   here; naming `PostToolUse` before tool interfaces exist teaches the API and loses the
   architecture.
5. **Teach the limits of enforcement.** Ask where a gate would be wrong. Drive to: an
   invariant that must hold on every path earns a gate; a preference does not, and gating
   preferences rebuilds a brittle pipeline out of an agent.
6. **Teach multi-concern decomposition.** Give one customer message carrying three
   genuinely independent problems — a billing error, a shipping delay, a feature question.
   Ask for the handling. Most will answer serially or address the first concern. Drive to
   the three moves: split into distinct items, investigate each in parallel against the
   shared customer context, synthesize one unified resolution. Then ask what the customer
   experiences if only two of the three are resolved but the reply reads as complete.
7. **Teach the handoff summary from the constraint, not the template.** State first that
   the receiving human cannot see the transcript, then ask what they need. Build the list
   from their answers — customer details, root cause, what was attempted and what it
   returned, what is blocked, recommended actions — and only then confirm it against § 6's
   wording. A summary derived from the constraint is remembered; a template is not.
8. **Pivot to session state** and name the mechanisms with their exact spellings:
   `--resume <session-name>`, named sessions, `fork_session`. Check the spellings back.
9. **Teach the resume-vs-fresh judgment**, which is the most testable thing in 1.7. Set it
   up concretely: an agent analyzed 30 files yesterday and reached conclusions; overnight,
   a refactor touched eight of them. Ask whether to resume. Most say yes — it is the
   intuitive answer and it is the trap. Draw out why it fails: the session reinstates
   yesterday's file contents as though current, and nothing in it is marked stale. Then
   give the other direction — a session where nothing external changed and the reasoning
   is still valid — and let them see resumption is right there. The tell is the *truth* of
   the prior tool results, not their usefulness.
10. **Teach the middle path**: if you do resume, inform the agent about the changes to
    previously analyzed files. Ask what that notice must contain to be worth anything.
11. **Contrast fork with both.** `fork_session` is for when the context is still true and
    you want a branch; resume continues the trunk; fresh-with-summary discards. One tell
    each, said out loud.
12. **Decision table** — walk all nine rows, scenario-first.
13. **Scenario drill — 5 questions.** Use a customer support agent that looks up accounts,
    issues refunds, and escalates to humans. Ask which step needs programmatic enforcement
    and why the prompt is insufficient, what the gate actually checks, how a three-concern
    message is handled, what a handoff summary must contain given the human cannot see the
    transcript, and one resume-vs-fresh call with the staleness stated in the scenario.
    Include one multiple-response.
14. **Distractor autopsy** on all five. Expect three tells: "strengthen the system prompt"
    where deterministic compliance was required, "resume — the context is already there"
    where the tool results were stale, and a handoff summary that assumes the human can
    read back through the conversation.
15. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

Defer and say where it's covered:

- The hook mechanism itself — event names including `PostToolUse`, registration, blocking
  semantics, and normalization hooks → session 15. Teach the architectural choice here and
  forward-reference explicitly.
- Escalation *triggers* — when to escalate, ambiguity resolution, and the unreliable
  proxies (sentiment, self-reported confidence) → session 9. This session covers what the
  handoff carries, not when it fires.
- Crash recovery, checkpointing, and error propagation across agents → session 7
- Context window mechanics, token budgets, and compaction → session 6. Here, sessions are
  about what is *true*, not about what fits.
- Tool interface authorship, including how `get_customer` and `process_refund` should be
  designed → session 14
