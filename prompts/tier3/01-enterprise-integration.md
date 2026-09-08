# Enterprise Integration Patterns — P1 Integration

**Exam weight: 19% (highest of any Professional domain)**

## What this session assumes

All of Tier 1–2 and a passing Foundations mock. The learner knows tool and MCP design at
Foundations altitude; this session raises it to enterprise systems integration.

## Why this domain is worth 19% of your score

P1 is the largest Professional domain — enterprise system connectivity and data wiring.
The altitude shift matters: Foundations asks "how do you define a tool", Professional asks
"how does this land in an enterprise that already has an identity provider, a data
classification policy, an existing event bus, and a network perimeter". Wrong answers are
designs that work in isolation but ignore an existing enterprise constraint.

## Session focus

This session raises tool and MCP design to enterprise systems integration — topology, identity, network boundaries, and delivery semantics. The crux is the **delegation problem**: an agent holding service-level access, invoked by a user without it, is a privilege-escalation design, and recognizing that is a scored skill that returns in the governance domain. Construct that escalation concretely and have the learner design the fix. Frame the altitude shift explicitly: Foundations asks how to define a tool, Professional asks how it lands in an org that already has an IdP, an event bus, and a perimeter.

## Authoritative sources

**Server-hosted agents and their integration surface**
- <https://platform.claude.com/docs/en/managed-agents/overview>
- <https://platform.claude.com/docs/en/managed-agents/webhooks>
- <https://platform.claude.com/docs/en/managed-agents/environments>
- <https://platform.claude.com/docs/en/managed-agents/tools>
- <https://platform.claude.com/docs/en/managed-agents/session-operations>

**MCP at enterprise scale**
- <https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/concepts>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/security>
- <https://code.claude.com/docs/en/managed-mcp>

**Identity and credentials**
- <https://platform.claude.com/docs/en/manage-claude/workload-identity-federation>
- <https://platform.claude.com/docs/en/manage-claude/authentication>
- <https://platform.claude.com/docs/en/manage-claude/workspaces>

**Async and streaming integration**
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/managed-agents/events-and-streaming>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>

## Teaching objectives

By the end, the learner can:

- Choose the **integration topology** for a Claude system inside an existing enterprise:
  synchronous request/response, async job with webhook callback, event-driven off a queue
  or bus, or scheduled batch — and justify it on the consuming system's expectations
- Design the **identity story** properly: workload identity federation over static keys,
  what identity the agent acts as, and how that identity maps to downstream authorization
- Distinguish **the agent's permissions from the end user's** — the delegation problem.
  An agent acting with service-level access on behalf of a low-privilege user is a
  privilege-escalation design, and recognizing that is a scored skill
- Place the **network boundary**: what reaches out from where, what must stay inside the
  perimeter, and what a tunnel or gateway solves that direct connection doesn't
- Decide **where state lives** — in Claude's session storage, in the enterprise's own
  systems, or both — and reason about the consequences for recovery and compliance
- Design the **idempotency and delivery semantics** of an integration: at-least-once
  delivery means the agent will be invoked twice, and the design must tolerate it
- Choose between **managed/hosted agents** and self-operated infrastructure, on operational
  ownership, data-path, and compliance grounds
- Version an integration contract so a Claude-side change doesn't break a consumer
- Recognize when the right answer is **not to integrate directly** — put a queue, an API
  gateway, or an anti-corruption layer between Claude and a fragile legacy system

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Sync vs. async-with-callback | Can the caller hold a connection for the full duration? |
| Event-driven vs. polling vs. scheduled | Who owns the trigger, and how fresh must the result be? |
| Federated identity vs. static credential | Does the credential outlive the workload? |
| Agent identity vs. user delegation | Could the agent do something the requesting user cannot? |
| Direct connection vs. tunnel/gateway | Does traffic cross a network or trust boundary? |
| Managed agents vs. self-hosted | Who must own the runtime, data path, and compliance evidence? |
| Direct integration vs. anti-corruption layer | Is the downstream system stable and well-modeled? |

## How to run this session

1. **Frame the altitude shift** explicitly — this is the same material as Foundations
   viewed from an enterprise architecture position. Then name what's new: identity,
   network boundaries, delivery semantics, and existing systems you don't control.
2. **Teach topology choice** with a worked example, then have the learner pick topologies
   for four different consumers of the same agent and justify each.
3. **Teach the identity story.** Start with the naive design (a service API key in a
   config store) and have them attack it. Supply what they miss: rotation, blast radius,
   audit attribution, and the fact that "the agent did it" is not an acceptable audit entry.
4. **Teach the delegation problem** as the session's most important idea. Construct the
   escalation: an agent with broad service access, invoked by a user without it. Ask what
   goes wrong, then have them design the fix. This shows up in governance questions too.
5. **Teach network boundaries** — where tunnels and gateways earn their complexity.
6. **Teach delivery semantics.** Ask what happens when the queue redelivers. If they don't
   reach idempotency, connect it back to Tier 1 session 13.
7. **Teach managed vs. self-hosted** as an ownership question, not a technology preference.
8. **Teach contract versioning** and the anti-corruption layer.
9. **Decision table** — walk all seven rows, scenario-first.
10. **Scenario drill — 5 questions** at Professional altitude (standalone items, not
    scenario-bundled, matching CCAR-P format). Include: a topology choice, a delegation/
    privilege question, a credential design, a boundary-crossing question, and one
    multiple-response on integration failure modes.
11. **Distractor autopsy** — expect designs that ignore an existing enterprise constraint,
    and static credentials chosen for simplicity.
12. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Cloud deployment surfaces specifically → session 2
- Data pipelines and RAG → session 3
- Compliance controls and residency → session 10
- Cost modeling → session 9
