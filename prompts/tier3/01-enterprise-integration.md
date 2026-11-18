# Enterprise Integration Patterns — P3 Integration

**Exam weight: 21% (highest of any Professional domain)**

*Owns CCAR-P v1.1 § 5 task statements:*

- P3.2 — Authentication and Authorization Posture: Analyzing the authentication and
  authorization posture of an integration design to identify credential exposure and
  privilege escalation risks, and specifying the mitigation for each.
- P3.6 — Connection Mechanism Selection: Evaluating MCP, direct API/CLI, and agent-to-agent
  handoff against scenario constraints on latency, security, and statefulness, and
  selecting the connection mechanism the constraints favor.

## What this session assumes

All of Tier 1–2 and a passing Foundations mock. The learner knows tool and MCP design at
Foundations altitude; this session raises it to enterprise systems integration.

## Why this domain is worth 21% of your score

P3 is the largest Professional domain, and it grew in v1.1 — eight objectives, three
sessions. The altitude shift matters: Foundations asks "how do you define a tool",
Professional asks "how does this land in an enterprise that already has an identity
provider, a network perimeter, and services you don't control". Wrong answers are designs
that work in isolation but ignore an existing enterprise constraint — a credential that
outlives its workload, an agent that can do what its caller cannot, or a connection
mechanism chosen for familiarity rather than for the latency, security, and state the
scenario states.

## Session focus

This session owns two P3 decisions: reading an integration design's auth posture for
credential exposure and privilege escalation (P3.2), and choosing among MCP, direct
API/CLI, and agent-to-agent handoff (P3.6). The crux is the **delegation problem**: an
agent holding service-level access, invoked by a user without it, is a
privilege-escalation design, and recognizing that — then specifying the mitigation, not
just naming the risk — is the scored skill. Construct that escalation concretely and have
the learner design the fix; spend disproportionate time here. The second half is
connection-mechanism selection taught as elimination against the three constraints the
statement names — latency, security, statefulness — with agent-to-agent handoff treated as
delegation to a peer with its own judgment, not as a function call. Frame the altitude
shift explicitly: Foundations asks how to define a tool, Professional asks how it lands in
an org that already has an IdP and a perimeter.

## Authoritative sources

**MCP at enterprise scale**
- <https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/concepts>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/security>
- <https://code.claude.com/docs/en/managed-mcp>

**Identity and credentials**
- <https://platform.claude.com/docs/en/manage-claude/workload-identity-federation>
- <https://platform.claude.com/docs/en/manage-claude/authentication>
- <https://platform.claude.com/docs/en/manage-claude/workspaces>
- <https://platform.claude.com/docs/en/managed-agents/vaults>

**Agent-to-agent and hosted-agent integration surface**
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>
- <https://platform.claude.com/docs/en/managed-agents/webhooks>
- <https://platform.claude.com/docs/en/managed-agents/session-operations>

**Async and streaming integration** — latency shape of a connection
- <https://platform.claude.com/docs/en/build-with-claude/streaming>
- <https://platform.claude.com/docs/en/managed-agents/events-and-streaming>

## Teaching objectives

By the end, the learner can:

- **Read an integration design for credential exposure** (P3.2): find every credential in
  the diagram or config and ask where it lives, who can read it, how long it lives, and
  what its blast radius is. Name the standard exposures — a static key in a config store,
  env var, or prompt; a secret reachable from the model's context or a tool result; a
  long-lived token shared across tenants or workloads — and specify the mitigation for
  each: workload identity federation over static keys, a secrets store or vault the model
  never reads, short-lived scoped tokens, per-tenant credentials
- **Read an integration design for privilege escalation** (P3.2) — the delegation problem.
  An agent acting with service-level access on behalf of a low-privilege user can do what
  the user cannot; so can a subagent that inherits its orchestrator's credentials, or an
  MCP server that runs under one shared service account for every caller. Specify the
  mitigation: propagate the end user's identity (on-behalf-of / token exchange) so
  downstream authorization is evaluated against the *user*, scope the agent's own
  identity down to the intersection, and enforce authorization in the downstream system,
  never in the prompt. "The agent did it" is not an acceptable audit entry — attribution
  must reach the human
- Pair **every risk with its mitigation**. The statement asks for both; an answer that
  correctly names the escalation but proposes a system-prompt instruction as the fix is
  wrong, because a prompt is not an authorization control
- Place the **network boundary** as part of the auth posture: what reaches out from
  where, what must stay inside the perimeter, and what a tunnel or gateway solves (no
  inbound exposure, central credential handling) that direct connection doesn't
- **Select the connection mechanism** (P3.6) by what sits on the other end and what the
  scenario constrains:
  - **MCP** — a reusable, discoverable tool surface exposed to a model, shared across
    agents or clients; costs a server to operate and a protocol hop, and its responses
    are model-visible content (the injection side of that is session 35)
  - **Direct API/CLI** — a service called directly by code or by one agent's own tool,
    lowest latency and simplest auth when there is one consumer and no reuse; the right
    answer more often than MCP enthusiasm suggests
  - **Agent-to-agent handoff** — the peer is itself an autonomous system with its own
    loop and judgment. It can refuse, misinterpret, or take its own actions, so the
    failure modes are those of delegation rather than those of a request: what context
    and authority cross the handoff, and who owns the outcome
- Evaluate each mechanism against the **three named constraints**:
  - **Latency** — each hop (MCP server, peer agent's own model calls) adds round trips;
    a handoff to an agent is a whole inference loop, not a call
  - **Security** — where credentials sit and whose identity the call carries; MCP
    centralizes auth for many consumers, a handoff transfers authority to a peer that must
    be trusted with it
  - **Statefulness** — whether the interaction needs state across calls (a session, a
    cursor, a conversation), who holds it, and what happens to it when a call is retried
    or a peer restarts. Stateless request/response is easiest to secure and retry;
    stateful sessions need an owner. State only the consequence here — a retried
    side-effecting call needs a dedup guard — and leave idempotency keys, retry and
    backoff to session 33 (P3.8)
- Recognize the integration **topology** (synchronous, async with callback, event-driven,
  scheduled) only as far as it sets the latency and statefulness constraint for the
  mechanism choice — can the caller hold a connection, and who owns the trigger

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Federated identity vs. static credential | Does the credential outlive the workload, or sit anywhere the model or a log can read it? |
| Agent identity vs. user delegation | Could the agent do something the requesting user cannot? |
| Authorization in downstream system vs. in prompt | Is the control enforceable when the model is wrong or manipulated? |
| Shared service account vs. per-tenant/per-user credential | Does one compromise or one confused call reach every tenant? |
| Direct connection vs. tunnel/gateway | Does traffic cross a network or trust boundary? |
| MCP vs. direct API/CLI | Is the tool surface reused across agents or clients, or called by one consumer? |
| Tool/API call vs. agent-to-agent handoff | Does the peer need its own judgment and loop — and can you afford its latency and trust it with the authority? |
| Stateless call vs. stateful session | Must state survive across calls, and who owns it on retry or restart? |

## How to run this session

1. **Frame the altitude shift** explicitly — this is Foundations tool and MCP material
   viewed from an enterprise architecture position. Then name what's new: identity,
   network boundaries, and existing systems you don't control.
2. **Teach credential exposure.** Start with the naive design (a service API key in a
   config store, readable by the agent's runtime) and have them attack it. Supply what
   they miss: rotation, blast radius, audit attribution, and exposure via the model's own
   context or logs. Then have them specify a mitigation for each exposure — naming the
   risk without the fix is half an answer on this objective.
3. **Teach the delegation problem** as the session's most important idea. Construct the
   escalation: an agent with broad service access, invoked by a user without it. Ask what
   goes wrong, then have them design the fix (identity propagation, scoped agent identity,
   downstream enforcement). Extend it twice: a subagent that inherits the orchestrator's
   credentials, and an MCP server that calls a backend as one shared account. This shows
   up again in governance (sessions 35 and 38).
4. **Teach network boundaries** — where tunnels and gateways earn their complexity, as
   part of the posture rather than as plumbing.
5. **Teach connection-mechanism selection** as elimination. Give four integrations — an
   internal ticketing API used by one agent, a document store exposed to six teams'
   agents, a partner's autonomous scheduling agent, a fast lookup inside a tight latency
   budget — and have them pick MCP, direct API/CLI, or handoff, naming which of latency,
   security, or statefulness decided it.
6. **Teach agent-to-agent handoff honestly.** Ask what crosses the boundary (context,
   authority, credentials) and who owns a wrong outcome. A peer agent is not a function;
   if they treat it as one, that's the gap.
7. **Teach statefulness** as a selection constraint: who holds session state, and what a
   retry does to it. State the dedup consequence and point forward to session 33 for the
   reliability controls themselves.
8. **Decision table** — walk all eight rows, scenario-first.
9. **Scenario drill — 5 questions** at Professional altitude (standalone items, not
   scenario-bundled, matching CCAR-P format). Include: a credential-exposure question that
   asks for the mitigation, a delegation/privilege-escalation question, a connection-
   mechanism choice decided by latency, one decided by statefulness or security, and one
   multiple-response on auth-posture risks in a supplied design.
10. **Distractor autopsy** — expect designs that ignore an existing enterprise constraint,
    static credentials chosen for simplicity, authorization enforced by a prompt
    instruction, MCP chosen where one consumer calls one API, and an agent-to-agent
    handoff treated as a function call.
11. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Deployment surface and agent runtime selection (including managed vs. self-hosted
  agents) → session 29 (P1.6)
- Retrieval architecture and data wiring → session 30 (P3.5)
- Rate-limit handling, retry and backoff, idempotency for side-effecting tools, fallback
  routing → session 33 (P3.8)
- Least-privilege tool configuration and context-efficient access patterns → session 41
  (P3.1)
- MCP responses and tool results as an injection surface → session 35 (P5.2)
- Compliance controls and residency → session 37 (P5.5)
- Cost modeling → session 36
