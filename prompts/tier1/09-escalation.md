# Escalation and Ambiguity Resolution — F5 Context Management & Reliability

**Exam weight: 15%**

## What this session assumes

Sessions 1 (the agentic loop and `stop_reason`) and 8 (explicit criteria and few-shot
prompting). Session 8 is the direct prerequisite and is sequenced immediately before this
one on purpose: the concrete deliverable of this session is escalation criteria written into
a system prompt **with few-shot examples**, and that is session 8's technique applied to
F5's problem. Session 1 supplies the loop in which an agent decides to stop and hand off.
This session owns § 6 task **5.2 — "Design effective escalation and ambiguity resolution
patterns."** It is the last of the three F5 sessions, and the session immediately after it
is the S1 Customer Support Resolution drill.

## Why this domain is worth 15% of your score

The F5 domain description names **escalation protocols** explicitly, and "when a support
agent should escalate to a human versus handle something autonomously" is a named exam
skill. Support escalation is also one of the six scenario archetypes, so this material is
likely to appear on your exam regardless of which scenarios you draw. Escalation items are
scored on whether you can name the *deciding* factor — and the guide is unusually specific
about what those factors are, which makes this one of the few places on the exam where
memorizing the named triggers reliably pays.

## Session focus

This session is about three triggers and two impostors. The crux, stated as the guide states it: **escalate on explicit human requests, policy gaps, and inability to make meaningful progress — sentiment and self-reported confidence are unreliable proxies.** Those three triggers are the whole scored core; spend disproportionate time making them retrievable by name and distinguishable from the near-misses the exam offers ("the case is complex" is not the policy trigger; "the customer sounds angry" is not a trigger at all). Then spend the rest on ambiguity resolution — multiple matches means asking for another identifier, never picking by heuristic — and close by having the learner write the criteria into a system prompt with few-shot examples, which is the deliverable form the exam asks about.

## Authoritative sources

**Escalation in practice — study the design, not just the prose**
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing>

**Human-in-the-loop mechanics**
- <https://code.claude.com/docs/en/agent-sdk/user-input>
- <https://code.claude.com/docs/en/agent-sdk/permissions>
- <https://code.claude.com/docs/en/permission-modes>

**Criteria and consistency in the system prompt**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>

## Teaching objectives

By the end, the learner can:

- Name the **three escalation triggers** the guide specifies, in the guide's own terms, and
  apply each to a case:
  - **The customer explicitly requests a human.** Escalate **immediately, without first
    attempting investigation.** Not one more lookup, not one more proposed fix — the request
    itself is the trigger, and investigating first is a named wrong answer even when the
    issue turns out to be trivially fixable
  - **A policy exception or gap** — the policy does not address what is being asked, or is
    ambiguous about it. Note carefully that this is *not* "the case is complex." A policy
    covering price adjustments on your own site says nothing about **matching a
    competitor's price**; that silence is the trigger, and a confident answer in the gap is
    how an agent invents policy
  - **Inability to make meaningful progress** — the agent is looping, repeating tool calls,
    or has exhausted its approaches
- Handle the **frustrated-but-hasn't-asked** case correctly, because the exam draws it
  directly against trigger one: when a customer is frustrated but has *not* requested a
  human and the issue is within the agent's capability, **acknowledge the frustration while
  offering the resolution**, and **escalate only if the customer reiterates** the request
  for a person. Make the learner state the difference from trigger one out loud — an
  explicit demand gets no investigation, and frustration alone gets a resolution offered
- Name the **two unreliable proxies** the exam offers as distractors, and why each fails:
  - **Customer sentiment.** Frustration is not complexity. Angry customers often have
    simple, in-policy problems, and calm ones can have intractable ones. Routing on tone
    escalates the wrong cases in both directions
  - **Self-reported confidence.** A model is least able to flag the cases where it has
    misunderstood — which are exactly the cases needing a human — so a confidence score it
    produces about its own interpretation cannot be the deciding factor. This is worth
    stating sharply, because it is intuitive to reach for and the guide names it as a
    proxy, not a trigger
- Resolve **ambiguity in identity lookups**: when a lookup returns **multiple customer
  matches**, **ask for an additional identifier** — an order number, an email, a postal code
  — rather than selecting heuristically. "Most recent" and "closest name match" are guesses
  wearing a rule's clothes, and acting on the wrong customer's record is the failure mode
  the clarification exists to prevent
- Generalize the pattern: ambiguity is resolved by **asking a narrow question**, not by
  picking a branch and proceeding. Distinguish **escalate** (hand the case to a human),
  **ask** (block for one input and keep the task), and **defer** (complete what's possible,
  flag the rest)
- **Add explicit escalation criteria to the system prompt, with few-shot examples.** This is
  the deliverable, and it is session 8's technique aimed at this problem: a criteria list
  alone underspecifies the boundary, and the examples are what make the boundary
  reproducible across cases. Write at minimum one example per trigger, plus the
  frustrated-but-hasn't-asked case as a *negative* example — the one that shows the model
  where the boundary is by showing it a case that does **not** escalate
- Design the **escalation handoff** so escalation isn't a reset: the human receives what was
  attempted, what was learned, what is blocked, and the recommendation. A handoff that makes
  the human re-read the whole transcript is worse than useless
- *(Curriculum aid, not exam vocabulary)* Use **irreversibility** as a background heuristic
  when a case matches none of the three triggers cleanly — a hard-but-reversible action is
  safer to attempt than an easy-but-irreversible one. Label it as an aid when you teach it.
  The guide's § 6 language for task 5.2 names the three triggers and the two proxies; it does
  not name irreversibility or stakes, so do not let the learner produce "irreversibility" as
  an answer where the expected answer is one of the three triggers

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Escalate now vs. investigate first | Has the customer *explicitly* asked for a human? If yes, escalate with no investigation |
| Escalate vs. acknowledge-and-resolve | Is the customer frustrated but not asking for a person, with the issue in capability? |
| Escalate on reiteration vs. keep offering | Did the customer repeat the request for a human after your offer? |
| Policy gap vs. merely complex | Does the policy *address* this request at all, or is it silent? |
| Escalate vs. keep trying | Is the agent making meaningful progress, or repeating itself? |
| Named trigger vs. sentiment | Is the routing signal the request/gap/stall, or the customer's tone? |
| Named trigger vs. self-reported confidence | Would the model know it had misunderstood? |
| Ask for an identifier vs. pick a match | Did the lookup return more than one customer? |
| Escalate vs. ask vs. defer | Does the human need to take over, decide one thing, or just be told? |
| Criteria list vs. criteria plus few-shot examples | Is the boundary reproducible from the rule text alone? |

## How to run this session

1. **Frame** — F5 is 15%, support escalation is one of the six scenario archetypes, and the
   next session is the S1 Customer Support Resolution drill. Say that the guide names the
   triggers explicitly, which makes this rare territory where naming them back earns points.
2. **Teach the three triggers by name, first, before any scenario.** Explicit human request;
   policy exception or gap; inability to make meaningful progress. Have the learner repeat
   them back before proceeding — retrieval is the goal, not recognition.
3. **Run four vignettes and have the learner call escalate-or-resolve with a reason:**
   - A customer who says "just get me a person" over a trivially fixable issue → escalate
     immediately, **no investigation first**. Push on this one: ask whether it's worth one
     quick lookup. The answer is no, and they should be able to say why
   - A furious customer with a standard, in-policy replacement who has *not* asked for a
     human → acknowledge the frustration, offer the resolution; escalate only if they
     reiterate. Contrast it explicitly with the previous vignette
   - A request the policy simply doesn't address — matching a competitor's advertised price
     when policy covers only adjustments on your own site → escalate; the gap is the
     trigger, and guessing invents policy. Ask them to distinguish this from "a complex
     case", which is not the trigger
   - A lookup returning three customers with the same name → ask for an additional
     identifier, don't pick
4. **Teach the two unreliable proxies directly, by name.** Sentiment and self-reported
   confidence. For sentiment, give the calm customer with the intractable problem and the
   furious one with the one-click fix. For self-reported confidence, make the argument
   sharply: the cases where a model has misunderstood are precisely the cases where its
   confidence is uninformative, so a confidence score cannot be the trigger. Expect
   pushback — confidence *feels* like the right signal — and hold the line, because the
   guide names it as a proxy.
5. **Teach ambiguity resolution as a general move.** Multiple matches → one narrow
   clarifying question. Then generalize to escalate vs. ask vs. defer with a scenario each.
6. **Build the system prompt.** Have the learner write the escalation criteria into a system
   prompt **with few-shot examples**, applying session 8's technique. Require at least four
   examples: one per trigger, plus the frustrated-but-hasn't-asked case as a negative
   example. Then critique: does the example set make the boundary reproducible, or does it
   only restate the rules? This step is the session's deliverable — do not skip it for time.
7. **Teach the handoff.** Have them draft what the human receives, then critique it: could
   the human act without re-reading the whole transcript?
8. **Offer irreversibility as a labeled aid**, briefly, for cases that match no trigger
   cleanly — and say in the same breath that it is a curriculum aid, not the guide's
   vocabulary, so they don't produce it where a named trigger is the expected answer.
9. **Decision table** — walk all ten rows. For each, give a scenario and have them apply it
   before you give the answer.
10. **Scenario drill — 6 questions.** Use a support agent for a subscription service:
    tiered refund authority, a policy that addresses own-site price adjustments only, an
    identity lookup that returns multiple matches, and a requirement that escalations arrive
    actionable. Ask about an explicit request for a human; the frustrated-but-hasn't-asked
    case; the competitor-price-match policy gap; the multiple-match resolution; the handoff
    contents; and one on what belongs in the system prompt to make the criteria
    reproducible. Include one multiple-response — make it the set of valid triggers against
    sentiment and self-reported confidence as distractors.
11. **Distractor autopsy** — expect an investigation attempted after an explicit request for
    a human, "the case is complex" offered as the policy trigger, sentiment offered as a
    routing signal, a model-produced confidence score trusted as the decider, and a
    heuristic match ("most recent order") chosen over asking for an identifier.
12. Record per `.agents/TUTORIAL.md` Step 5. Glossary the three triggers and the two
    proxies verbatim.

**Next is an interleaved drill.** F1 and F5 are now both complete, so the session after
this one is the S1 Customer Support Resolution scenario drill at exam difficulty. Tell the
learner that's coming and report current F1/F5 readiness.

## Out of scope

Defer and say where it's covered:
- Error propagation between agents, structured error context, coverage annotations, crash
  recovery manifests → session 7 (tasks 5.3, 5.4, 5.6), already taught; reference it when a
  failed subagent is what triggers the escalation
- Conversation context, the case facts block, what summarization destroys → session 6
  (task 5.1), already taught. The handoff draws on the case facts block — say so, don't
  re-teach it
- Few-shot prompting technique itself — example selection, ordering, count → session 8
  (task 4.2), already taught. Apply it here; do not re-derive it
- Tool-level error handling and retry policy → session 16 (task 2.2)
- Human review workflows and **confidence calibration against labeled validation sets** →
  session 12 (task 5.5). That is calibrated, measured confidence — a different thing from
  the model's self-reported confidence this session rejects. Draw the distinction explicitly
  if a learner raises it, and defer the method
- Session state, checkpointing, `--resume`, `fork_session` → session 4 (task 1.7)
- Governance-mandated human oversight → Tier 3 sessions 10–11
- Production reliability at enterprise scale → Tier 3 session 6
