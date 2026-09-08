# Bedrock, Vertex, Foundry, Gateways — P1 Integration

**Exam weight: 19%**

## What this session assumes

Session 1 (integration topology, identity, boundaries).

## Why this domain is worth 19% of your score

Where a Claude workload runs is an enterprise decision driven by procurement, data
residency, existing cloud commitments, and compliance posture — rarely by capability
alone. The exam tests whether you can pick a deployment surface from *those* constraints
rather than from technical preference, and whether you know what changes about model
availability, feature parity, and billing when you move.

## Session focus

This session covers where a Claude workload runs: cloud provider surfaces, gateways, and self-hosted environments. The crux is that **surface choice is a procurement and compliance decision, not a technical preference** — so practice *eliminating* options against stated constraints rather than optimizing. The second crux: feature parity, model availability, and regional coverage differ per surface and must be verified, never assumed. Say that out loud to the learner, because an assumed-parity answer is exactly what an exam item can hinge on.

## Authoritative sources

Verify current feature parity, model availability per surface, and regional support —
these differ by surface and change often. Never assert parity from memory.

**Cloud provider surfaces**
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock>
- <https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai>
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry>
- <https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws>

**Claude Code against alternative backends**
- <https://code.claude.com/docs/en/amazon-bedrock>
- <https://code.claude.com/docs/en/google-vertex-ai>
- <https://code.claude.com/docs/en/microsoft-foundry>
- <https://code.claude.com/docs/en/third-party-integrations>

**Gateways and centralized control**
- <https://code.claude.com/docs/en/gateways>
- <https://code.claude.com/docs/en/llm-gateway>
- <https://code.claude.com/docs/en/llm-gateway-protocol>
- <https://code.claude.com/docs/en/llm-gateway-rollout>
- <https://code.claude.com/docs/en/network-config>

**Self-hosted and isolated environments**
- <https://code.claude.com/docs/en/self-hosted-environments>
- <https://code.claude.com/docs/en/cloud-environments>
- <https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes>

**Residency and retention constraints that decide the choice**
- <https://platform.claude.com/docs/en/manage-claude/data-residency>
- <https://code.claude.com/docs/en/zero-data-retention>

## Teaching objectives

By the end, the learner can:

- Name the deciding factors for a deployment surface: existing cloud commitment and
  procurement path, data residency requirement, network egress policy, compliance
  evidence needs, and billing consolidation — and rank them for a given org
- Explain what **doesn't** automatically transfer when you move surfaces: model
  availability and version timing, feature parity for newer capabilities, quota and rate
  limit structures, and regional coverage — and state that these must be verified per
  surface, not assumed
- Explain what an **LLM gateway** centralizes: authentication, spend control, routing,
  observability, and policy enforcement — and what it costs in latency and operational
  ownership
- Decide between direct API access, a gateway, a cloud provider surface, and a self-hosted
  environment, and defend it to a platform team
- Explain **zero data retention** and **data residency**, and how each constrains surface
  choice
- Design **multi-surface** operation deliberately — for resilience or regional coverage —
  and name what it costs: divergent feature availability, doubled evaluation surface,
  and prompt behavior that must be validated per surface
- Explain how surface choice interacts with **model migration** timing, since new models
  don't land everywhere simultaneously
- Recognize when a stated constraint makes a surface *non-negotiable* rather than preferred

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Direct API vs. cloud provider surface | Where does procurement and the data path have to sit? |
| Gateway vs. direct | Does the org need central spend, policy, or audit control? |
| Single surface vs. multi-surface | Is there a residency or resilience requirement that one can't meet? |
| Managed vs. self-hosted environment | Must the runtime stay inside the org's own perimeter? |
| ZDR/residency-constrained vs. standard | Is there a contractual or regulatory data-handling term? |
| Wait for parity vs. proceed | Does the workload depend on a capability not yet on that surface? |

## How to run this session

1. **Frame** — surface choice is a procurement and compliance decision more than a
   technical one. Say that plainly; it reframes most of the questions.
2. **Verify before teaching.** Fetch the surface docs and state current availability and
   parity as documented. Explicitly tell the learner that parity claims must be verified
   per surface and per model — and that this is exactly what an exam question can hinge on.
3. **Teach the deciding factors** and have the learner rank them for three org profiles:
   an AWS-committed regulated bank, a startup with no cloud commitment, an EU public-sector
   body with a residency mandate.
4. **Teach what doesn't transfer.** Ask what could break in a migration from direct API to
   a provider surface. Supply what they miss.
5. **Teach gateways** — what they centralize and what they cost. Ask when a gateway is
   over-engineering.
6. **Teach ZDR and residency** as hard constraints that eliminate options, and have them
   practice eliminating rather than optimizing.
7. **Teach multi-surface** honestly, including its evaluation cost.
8. **Teach the migration-timing interaction** and connect forward to session 13.
9. **Decision table** — walk all six rows.
10. **Scenario drill — 5 questions**, standalone Professional format. Include a
    constraint-driven surface elimination, a gateway justification, a parity-risk question,
    and one multiple-response on what changes across surfaces.
11. **Distractor autopsy** — expect surfaces chosen on technical preference over a stated
    procurement or residency constraint, and parity assumed rather than verified.
12. Record per `.agents/TUTORIAL.md` Step 5. Log any parity detail verified, with its date.

## Out of scope

- Data pipelines and retrieval → session 3
- Compliance program design → session 10
- Cost optimization → session 9
- Migration execution → session 13
