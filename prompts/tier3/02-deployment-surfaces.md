# Deployment Surfaces and Agent Runtimes — P1 Solution Design and Architecture

**Exam weight: 18%**

*Owns CCAR-P v1.1 § 5 task statement:*

- P1.6 — Deployment Surface and Agent Runtime Selection: Selecting a deployment surface
  (Anthropic API, Amazon Bedrock, Google Vertex AI, Microsoft Foundry) and an agent runtime
  (Messages API loop, self-hosted Agent SDK or headless Claude Code, Claude Managed Agents)
  under data residency, compliance, model-availability, and operational-ownership
  constraints, and justifying the trade-offs the selection imposes on latency, feature
  availability, hosting, session state, sandboxing, and data custody.

*Supports P5.5 (session 37) wherever residency or retention decides the surface.*

## What this session assumes

Session 28 (identity, network boundaries, connection mechanisms). Tier 1's agent-loop and
Agent SDK sessions — the learner knows what an agent loop is; this session decides who
runs it and where.

## Why this domain is worth 18% of your score

P1 is solution design, and v1.1 made "where does this run, and who runs the loop" a P1
decision rather than an integration detail. Where a Claude workload runs is driven by
procurement, data residency, existing cloud commitments, compliance posture, and who is
willing to own operations — rarely by capability alone. The exam tests whether you can
pick a surface *and* a runtime from those constraints, name the one that binds, and state
the trade-off the choice forces. Its own § 6 directs candidates to "the feature-availability
and data-handling differences across the Anthropic API, Amazon Bedrock, Google Vertex AI,
and Microsoft Foundry".

## Session focus

This session teaches two coupled selections — the deployment surface and the agent
runtime — under residency, compliance, model-availability, and operational-ownership
constraints. The crux is **find the binding constraint, eliminate, then name the price**:
a residency obligation is a hard constraint that removes options outright, and whatever
survives carries trade-offs (feature lag, owning the loop and its session state, owning
the sandbox) that the right answer states rather than wishes away. Spend disproportionate
time on the coupling: the surface constrains which runtimes and features exist, so "pick
the best surface and the best runtime independently" is the classic wrong answer, and any
option claiming every requirement is met with no trade-off should be treated as suspect.
Say out loud that feature parity, model availability, regional coverage, and runtime
availability differ per surface and must be verified, never assumed. Keep the two
recurring confusions in view all session: **zero data retention governs how long data is
held, not where it is processed**, so it never satisfies a residency obligation; and
mirroring data inside the boundary does nothing if model inputs still leave it.

## Authoritative sources

Verify current feature parity, model availability per surface, regional support, and which
agent runtimes each surface offers — these differ by surface and change often. Never
assert parity or runtime availability from memory.

**Cloud provider surfaces**
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock>
- <https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed>
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry>
- <https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws> — Anthropic-operated, *not* Bedrock; see the surface-variants objective

**Agent runtimes**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent> — Messages API loop you own
- <https://code.claude.com/docs/en/agent-sdk/overview> · <https://code.claude.com/docs/en/agent-sdk/hosting> · <https://code.claude.com/docs/en/agent-sdk/sessions> — self-hosted Agent SDK
- <https://code.claude.com/docs/en/headless> — headless Claude Code
- <https://platform.claude.com/docs/en/managed-agents/overview> · <https://platform.claude.com/docs/en/managed-agents/sessions> · <https://platform.claude.com/docs/en/managed-agents/environments> · <https://platform.claude.com/docs/en/managed-agents/tools> — Claude Managed Agents
- <https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes>

**Claude Code against alternative backends**
- <https://code.claude.com/docs/en/amazon-bedrock>
- <https://code.claude.com/docs/en/google-vertex-ai>
- <https://code.claude.com/docs/en/microsoft-foundry>
- <https://code.claude.com/docs/en/third-party-integrations>

**Gateways and centralized control**
- <https://code.claude.com/docs/en/gateways>
- <https://code.claude.com/docs/en/llm-gateway>
- <https://code.claude.com/docs/en/network-config>

**Residency, retention, and sandboxing constraints that decide the choice**
- <https://platform.claude.com/docs/en/manage-claude/data-residency>
- <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>
- <https://code.claude.com/docs/en/zero-data-retention>
- <https://code.claude.com/docs/en/sandboxing>

## Teaching objectives

By the end, the learner can:

- Name the four **deployment surfaces** the exam lists — Anthropic API, Amazon Bedrock,
  Google Vertex AI, Microsoft Foundry — and the factors that select among them: data
  residency and where existing attestations already sit, compliance evidence, existing
  cloud commitment and procurement path, model availability, and billing consolidation
- Name the three **agent runtimes** the exam lists and what each makes you own:
  - **Messages API loop** — your code runs the loop, tools, state, and retries; maximum
    control and portability across surfaces, maximum operational ownership
  - **Self-hosted Agent SDK or headless Claude Code** — a prebuilt agent loop with tools,
    sessions, and permissions, running on infrastructure you host; you own hosting, the
    sandbox, and session persistence. The loop, files, and session state stay where you
    run it, but model inputs still go to whichever inference surface it calls
  - **Claude Managed Agents** — in its default form Anthropic hosts and scales the loop,
    and sessions are stateful server-side resources; least operational ownership. It comes in **three
    hosting variants**, and the variant decides custody: an **Anthropic-managed cloud
    sandbox** (loop, sessions, and execution all in Anthropic's infrastructure); a
    **self-hosted sandbox** (Anthropic runs the loop and stores sessions, but tool
    execution, files, and egress stay on infrastructure you control); and **self-hosted
    Managed Agents** (the whole service, sessions and history included, on your
    infrastructure). The stateful variants carry retention consequences — verify current
    ZDR and BAA eligibility per variant on the Managed Agents overview — and the runtime
    is available only where it is offered, so verify per surface from live docs
- Decide residency by **where inference runs** (which infrastructure, which geography)
  for the exact variant in the scenario, not by the surface's brand or whose invoice it
  appears on. The variants differ in who operates them and where they run, and the
  differences are easy to get backwards:
  - **Amazon Bedrock** and **Google Cloud (Google-managed)** are operated by the cloud
    provider, which also sets model availability and retirement dates
  - **Microsoft Foundry** is Anthropic-operated under both hosting options; "Hosted on
    Azure" runs inference on Azure infrastructure, "Hosted on Anthropic" does not. The
    hosting option, not the operator, decides whether inputs leave Azure
  - **Claude Platform on AWS** and **Google Cloud (Anthropic-managed)** are Anthropic-
    operated, run on that cloud's infrastructure, and track the Claude API closely (AWS:
    "typically same-day"), with listed exceptions — HIPAA readiness among them on AWS
  - The **Anthropic API** can itself restrict inference geography per workspace (session
    37 teaches the control), so a residency obligation does not automatically force a
    cloud surface; Sample 1's binding constraint is the firm's *own cloud boundary*
  Verify current variants, hosting options, and exceptions from live docs before teaching
- Apply the **four selection constraints** the statement names and rank them for a
  scenario: **data residency** (where inputs may be processed — usually binding and
  non-negotiable), **compliance** (what evidence must exist and who can produce it),
  **model availability** (is the model and version the workload needs on that surface,
  in that region), **operational ownership** (who is willing and able to run the loop,
  state, and sandbox)
- Justify the **six trade-offs** the selection imposes, naming each for a given choice:
  - **Latency** — region placement, an extra gateway hop, a hosted loop's round trips
    versus an in-process loop
  - **Feature availability** — new capabilities and models can lag on some surfaces;
    a workload depending on a not-yet-available feature fails there
  - **Hosting** — who runs and scales the compute for the loop and tools
  - **Session state** — who stores conversation and agent state, for how long, and who
    recovers it after a crash
  - **Sandboxing** — who provides and hardens the environment where agent-executed code
    and tools run
  - **Data custody** — where prompts, files, tool outputs, and session state physically
    reside and under whose control
- Hold the **coupling** between the two selections: surface choice constrains which
  runtimes and features exist, so choosing for residency can force self-hosting the
  runtime, and choosing a hosted runtime can force a surface. Reject any answer that
  claims all requirements are met with no trade-off without checking the surface actually
  offers that combination
- Separate **residency from retention**: zero data retention governs how long data is
  held, not where it is processed, so ZDR never satisfies a residency obligation; and a
  design that keeps documents inside the boundary while sending model inputs outside it
  still violates it
- Explain what **doesn't** automatically transfer when you move surfaces: model and
  version timing, feature parity, quota and rate-limit structure, regional coverage — and
  state that these must be verified per surface, not assumed
- Explain what an **LLM gateway** centralizes (authentication, spend control, routing,
  observability, policy) and what it costs in latency and operational ownership — a
  supporting choice, not one of the four surfaces
- Recognize when a stated constraint makes a surface or runtime *non-negotiable* rather
  than preferred, and when a competing preference (fast feature adoption, not owning
  session state) is the one that must give

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Anthropic API vs. cloud provider surface | Must model inputs stay inside an existing cloud boundary, or does procurement have to run through it? |
| Which cloud provider surface | Where do the existing commitment and residency attestations already sit — and is the needed model there? |
| Residency vs. ZDR as the fix | Is the obligation about *where* data is processed, or *how long* it is kept? |
| Messages API loop vs. Agent SDK / headless Claude Code | Do you need the built-in loop, tools, and sessions, or full control over each step? |
| Self-hosted runtime vs. Claude Managed Agents (and which variant) | Who must own hosting, session state, and the sandbox — and is that Managed Agents variant offered on the surface the constraints force? |
| Wait for parity vs. proceed | Does the workload depend on a model or feature not yet on that surface? |
| Gateway vs. direct | Does the org need central spend, policy, or audit control across teams? |
| Single surface vs. multi-surface | Is there a residency or resilience requirement one surface can't meet — and can you afford the doubled evaluation? |

## How to run this session

1. **Frame** — surface and runtime are procurement, compliance, and ownership decisions
   more than technical ones, and they are coupled. Say that plainly; it reframes most of
   the questions.
2. **Verify before teaching.** Fetch the surface and Managed Agents docs and state current
   model availability, feature parity, and which runtimes each surface offers, as
   documented and dated. Tell the learner that parity and runtime-availability claims must
   be verified per surface — and that this is exactly what an exam item can hinge on.
3. **Teach the four surfaces and the four constraints.** Have the learner rank the
   constraints for three org profiles: an AWS-committed regulated bank with residency
   attestations, a startup with no cloud commitment, an EU public-sector body with a
   residency mandate on Azure. The point is elimination, not optimization.
4. **Teach the three runtimes as ownership choices.** For each, have the learner say who
   owns hosting, session state, sandboxing, and data custody. If they can't place session
   state for a runtime, stop there.
5. **Teach the coupling with a conflicting-requirements case.** Build one of your own: a
   binding residency constraint, a product team that wants new features immediately, and
   a platform team that wants the loop hosted for them. Ask which constraint decides, and
   what the org must accept. The correct shape: residency binds; the surviving surface
   brings feature lag and possibly self-owned runtime and session state. Then show the
   three wrong shapes — treating a preference as binding and using ZDR for residency,
   keeping data inside while sending inputs outside, and claiming no trade-off — and make
   the learner name what is wrong with each. Do not reuse the § 7 sample wording; write
   fresh scenarios.
6. **Teach the six trade-offs** by walking one scenario through all six — latency,
   feature availability, hosting, session state, sandboxing, data custody — for two
   candidate selections side by side.
7. **Teach residency vs. retention** as its own drill: four obligations, and for each the
   learner says whether residency, ZDR, both, or neither addresses it. Connect forward to
   session 37 for the full compliance control set.
8. **Teach what doesn't transfer** across surfaces and the migration-timing interaction —
   new models don't land everywhere at once. Connect forward to session 40 (P4.7).
9. **Teach gateways briefly** — what they centralize, what they cost, when they're
   over-engineering.
10. **Decision table** — walk all eight rows.
11. **Scenario drill — 5 questions**, standalone Professional format. Include a
    residency-driven surface elimination, a runtime choice decided by session-state or
    sandbox ownership, a surface/runtime coupling item where the hosted runtime isn't
    available on the forced surface, a feature-parity risk question, and one
    multiple-response on the trade-offs a stated selection imposes.
12. **Distractor autopsy** — expect surfaces chosen on technical preference over a stated
    residency or procurement constraint, ZDR offered as a residency control, data mirrored
    inside the boundary while model inputs leave it, parity or hosted-runtime availability
    assumed rather than verified, and "all requirements met, no trade-off" answers.
13. Record per `.agents/TUTORIAL.md` Step 5. Log any parity or runtime-availability
    detail verified, with its date.

## Out of scope

- Connection mechanisms, identity, and network boundaries → session 28 (P3.2, P3.6)
- Retrieval architecture → session 30 (P3.5)
- Compliance control sets (retention, PII redaction, audit, tenant isolation) → session
  37 (P5.5)
- Permission modes, hooks, and headless/CI configuration of Claude Code or the Agent SDK
  → session 43 (P7.2)
- Cost optimization → session 36
- Migration execution → session 40 (P4.7)
