# Reliability, State, and Escalation — F5 Context Management & Reliability

**Exam weight: 15%**

## What this session assumes

The four F1 sessions and Context Management. This is the second F5 session; together the
two complete F5 and unlock the interleaved Multi-Agent Research drill that follows.

## Why this domain is worth 15% of your score

The F5 domain description names **escalation protocols** and **error handling in
distributed setups**, and "when a support agent should escalate to a human versus handle
something autonomously" is a named exam skill. The support-escalation scenario is one of
the six archetypes, so this material is likely to appear on your exam regardless of which
scenarios you draw. Escalation questions are scored on whether you can identify the
*deciding* factor — usually irreversibility or confidence, not difficulty.

## Session focus

This session completes F5 with escalation, state, and distributed failure, and feeds directly into the interleaved Multi-Agent Research drill that follows it. The crux is that **escalation is decided by irreversibility and stakes, not by difficulty** — a hard-but-reversible action is safer to attempt than an easy-but-irreversible one. The second crux, close behind: a model cannot reliably self-assess when it has misunderstood, so escalation triggers should be structural (this action type always escalates; no progress after N attempts) rather than left to model-judged confidence. Both are named exam skills; spend the session's weight there.

## Authoritative sources

**Session state and recovery**
- <https://code.claude.com/docs/en/sessions>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://code.claude.com/docs/en/agent-sdk/session-storage>
- <https://code.claude.com/docs/en/checkpointing>
- <https://code.claude.com/docs/en/agent-sdk/file-checkpointing>

**Human-in-the-loop**
- <https://code.claude.com/docs/en/agent-sdk/user-input>
- <https://code.claude.com/docs/en/agent-sdk/permissions>
- <https://code.claude.com/docs/en/permission-modes>

**Escalation in practice — study the design, not just the prose**
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing>

**Reliability and consistency**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://code.claude.com/docs/en/agent-sdk/observability>

## Teaching objectives

By the end, the learner can:

- Design an **escalation policy** around the factors that actually decide it:
  **irreversibility** of the action, **confidence** in the interpretation, **stakes**
  (financial, legal, safety), **policy requirement**, and **repeated failure to progress**
- Explain why *task difficulty* is the wrong criterion — a hard-but-reversible action is
  safer to attempt than an easy-but-irreversible one
- Recognize that an agent cannot reliably self-assess confidence, so escalation triggers
  should be **structural** (this action type always escalates; no progress after N
  attempts; a required field is missing) rather than purely model-judged
- Design the **escalation handoff**: what the human receives — what was attempted, what
  was learned, what's blocked, and the recommendation — so escalation isn't a reset
- Distinguish **escalate** (hand off), **ask** (block for input, keep the task), and
  **defer** (complete what's possible, flag the rest)
- Design **session state** so work survives interruption: what must be durable, what can
  be reconstructed, and where the resumption point lives
- Explain **checkpointing** and when it's the right recovery mechanism
- Handle failure in distributed setups: a subagent dies, a tool is unavailable, a partial
  result exists — and decide between retry, degrade, and escalate
- Define the **idle/stuck detector**: no progress across N iterations is a distinct failure
  from an error, and needs its own trigger
- Explain what to log for an agent to be debuggable after the fact, and why the decision
  points matter more than the output

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Escalate vs. handle autonomously | Is the action reversible, and are the stakes bounded? |
| Escalate vs. ask for input | Does the human need to *take over*, or just *decide one thing*? |
| Structural trigger vs. model judgment | Can the model reliably know it's wrong here? |
| Checkpoint vs. restart | Is the completed work expensive to redo? |
| Degrade vs. fail | Is a partial result useful to the requester? |
| Retry the subagent vs. escalate | Is the failure in the worker, or in the plan? |

## How to run this session

1. **Frame** — this is a named exam skill and appears in one of the six scenario
   archetypes. Also flag that it completes F5, so the next session is a full scenario drill.
2. **Teach the escalation factors** by having the learner sort actions first. Give eight
   support-agent actions (issue a refund under $10, issue one over $10,000, reset a
   password, close an account, explain a policy, change a billing address, waive a fee,
   delete data) into autonomous vs. escalate, and make them name the deciding factor each
   time. Then ask which factor did the most work: irreversibility, not difficulty.
3. **Teach the self-assessment limit.** Ask whether a model can tell when it has
   misunderstood. Lead them to structural triggers.
4. **Teach the handoff.** Have them draft what the human receives, then critique it: could
   the human act without re-reading the whole transcript? A bad handoff makes escalation
   worse than useless.
5. **Teach the three-way distinction** — escalate vs. ask vs. defer — with a scenario for
   each.
6. **Teach session state.** Ask what must survive a crash mid-task, and what can be
   recomputed. Then teach checkpointing against that.
7. **Teach distributed failure** — dead subagent, missing tool, partial results — and the
   retry/degrade/escalate choice.
8. **Teach the stuck detector** as distinct from error handling.
9. **Teach observability** — the decision points are what you need later.
10. **Decision table** — walk all six rows.
11. **Scenario drill — 5 questions.** Use a support agent for a subscription service:
    tiered refund authority, a compliance rule about account deletion, an integration that
    intermittently fails, and a requirement that escalations arrive actionable. Ask about
    the policy design, structural vs. judged triggers, the handoff contents, state
    durability, and a distributed failure choice. Include one multiple-response.
12. **Distractor autopsy** — expect difficulty used as the escalation criterion, and
    model-judged confidence trusted where a structural rule was needed.
13. Record per `.agents/TUTORIAL.md` Step 5.

**Next is an interleaved drill.** F1 and F5 are now both complete, so the session after
this one is the Multi-Agent Research scenario drill (S3) at exam difficulty, narrowed to
those two domains. Tell the learner that's coming and report current F1/F5 readiness.

## Out of scope

- Production reliability at enterprise scale → Tier 3 session 6
- Governance-mandated human oversight → Tier 3 sessions 10–11
- Full observability stack → Tier 3 session 16
