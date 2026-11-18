# Capstone: Enterprise Claude Code Rollout

**Spans P1, P3, P5, P6, P7 · Professional capstone 1 of 4**

## What this session is

A **capstone**, not a lesson. The learner works one large architecture problem end to end,
in the role of the architect accountable for it, while the agent plays the organization —
skeptical stakeholders, a security review, a budget owner, and reality intruding partway
through.

Teach nothing new. The work is integrating what Tiers 1–3 taught under realistic pressure,
and the assessment is whether the learner produces a defensible design and can defend it.

## Session focus

The learner works one enterprise rollout end to end as the accountable architect, while you play the organization — skeptical stakeholders, a security review, a budget owner, and a mid-flight change. Teach nothing new. The crux is whether decisions are **constraint-driven rather than preference-driven**, and whether trade-offs get named without prompting. Phase 6 matters most: when reality intrudes, does the learner protect the load-bearing decisions and give up the right things, or restart the design? Be candid in the assessment — a capstone that flatters the learner is worthless.

## Why this capstone

The Professional exam asks whether you can own a system in production: build it, ship it,
defend the decisions, and keep it safe and compliant. That is one continuous competence,
and testing it in domain-sized pieces misses the integration. This capstone targets the
rollout scenario — the most common real Architect engagement, and the one that most
naturally spans governance, enablement, integration, and stakeholder management. It is the
only capstone that exercises all three P7 objectives (packaging and distribution, permission
modes and headless operation, accountability for AI-generated code).

CCAR-P v1.1 § 6 warns that exam scenarios present artifacts — architecture diagrams,
configuration files, logs and traces, evaluation results, and code — and expect you to reason
from them. So in every phase below, hand the learner an artifact to review rather than only
asking for a design.

## The problem

Construct a fresh brief each run — the point is applied judgment, not recall. Build it to
include, at minimum:

- **An organization**: 300–800 engineers, several business units, an existing cloud
  commitment, a stated compliance regime (financial services, healthcare, or public sector)
- **A mandate** from leadership with a stated business goal and a deadline
- **A budget** with a number
- **A compliance constraint** that eliminates at least one otherwise-obvious option
  (data residency, ZDR, key custody, or an audit requirement)
- **An existing platform**: identity provider, CI system, source control, an internal
  developer platform, a security review process
- **A skeptical stakeholder** with a specific objection — the CISO, a staff engineer who
  thinks it will produce unreviewable code, or a finance owner who's seen a cloud bill
  surprise
- **A constraint that makes the naive plan wrong** — a business unit that can't use the
  chosen surface, or a deadline that precludes a full pilot
- **A proven pilot workflow** one team already runs — a few skills, a hook, a reviewer
  subagent, an MCP server, and a nightly headless job — that leadership wants everywhere
- **An unsupportable commitment** buried in the mandate or a draft SLA (e.g., a productivity
  figure promised before any baseline, or an availability target the chosen surface can't
  evidence)
- **Artifacts** to reason from: a draft managed-settings file, the pilot's plugin manifest
  or CI job definition, and a one-page architecture diagram, each with at least one defect

## How to run this session

Run it in phases. Do not let the learner skip ahead to implementation.

### Phase 1 — Requirements and constraints (10 min)
Present the brief. Have the learner extract requirements and constraints, and explicitly
separate the two. Ask what's missing from the brief and what they'd need to ask — a good
architect asks about data classification, existing tooling, and the real success measure.
Answer their questions in character. Then hand them the mandate and draft SLA and ask
which commitment the architecture cannot meet and what clarification or change resolves it
(P6.1).

### Phase 2 — Architecture (15 min)
Have them design: deployment surface, identity and credential model, configuration
hierarchy and what's centrally enforced, MCP and tool strategy, CI integration, and the
network/trust boundaries. Require a justification per decision, referencing the constraint
that drove it. Push back on any decision made from preference rather than constraint.

Then work two artifacts:
- **The pilot's plugin manifest and the draft managed-settings file** (P7.1). Have them
  package the pilot workflow for org-wide distribution, choose the marketplace arrangement,
  and mark each control centrally enforced or left to teams — then ask which of their
  controls would still hold when the nightly job runs unattended.
- **The pilot's CI job definition**, deliberately running with `bypassPermissions` on a
  shared runner (P7.2). Have them find the defect and assign a permission mode — default,
  acceptEdits, plan, auto, dontAsk, or bypassPermissions — plus the allow/deny rules and
  hooks for each of: interactive development, the CI job, and an exploratory spike.
  Verify current mode behaviour from live docs before judging the answer.

### Phase 3 — Governance and risk (10 min)
Have them produce the control set: what's enforced where, what the audit trail contains,
the risk register with likelihood/impact, and at least one **explicitly accepted** risk.
Then play the security reviewer and interrogate it. Ask for evidence, not intent.

Press one specific surface: a business unit wants to install third-party Skills and plugins
from a public marketplace. Have them rank it among the other risks (P5.3 — dependency and
supply-chain risk) and specify the controls that stop a third-party Skill's content being
treated as instruction (P5.2).

### Phase 4 — Rollout and accountability (10 min)
Have them sequence the rollout under the stated deadline. Then present the staff engineer's
objection as a process description: AI-authored PRs are reviewed by an AI reviewer and
merged by a bot. Ask for the single control that preserves human ownership of AI-generated
code (P7.3) and where it is enforced. Challenge any answer that is a policy without an
enforcement point.

### Phase 5 — Stakeholder defense (10 min)
Have them write a short architecture decision record for their most contested decision.
Play the stakeholder whose constraint it fails to address and ask for the revision that
makes the trade-off and residual risk explicit without overstating certainty about model
behavior (P6.2). Then play the skeptical stakeholder from the brief and press the objection at least three
times, escalating. Then play the CFO and ask why it costs what it costs. Then ask the
question they'll least expect: "what's your plan if the pilot shows no measurable
improvement?"

### Phase 6 — Reality intrudes (5 min)
Introduce one mid-flight change and require them to adapt without restarting: the
compliance regime tightens, a business unit refuses, the budget is cut 30%, or the deadline
moves in. Assess whether they protect the load-bearing decisions and give up the right things.

### Phase 7 — Assessment
Score across the five spanned domains, and report:

```
## Capstone 1 — Enterprise Rollout

| Domain | Assessment | Notes |
|---|---|---|
| P1 Solution Design and Architecture | [1–4] | |
| P3 Integration | [1–4] | |
| P5 Governance, Safety, and Risk Management | [1–4] | |
| P6 Stakeholder Communication and Lifecycle Management | [1–4] | |
| P7 Developer Productivity and Operational Enablement | [1–4] | |

**Strongest:** …
**Weakest:** …
**Decisions that wouldn't survive a real review:** …
```

Be candid in that last line — a capstone that flatters the learner is worthless. Name
specifically what a real review board would reject and why.

## Assessment criteria

Judge on: constraint-driven decisions rather than preference; trade-offs named without
prompting; at least one risk explicitly accepted; enforcement distinguished from policy;
defects found in the artifacts unprompted; permission modes matched to the guardrail;
honest handling of uncertainty under stakeholder pressure; and graceful adaptation in
Phase 6.

Weak signals to call out: designs that ignore a stated constraint, claims of no downside,
compliance overclaimed, safety controls shipped as CLAUDE.md or README guidance instead of
managed settings or hooks, `bypassPermissions` outside an isolated container, AI review
offered as the accountability control, and restarting the design when Phase 6 hits.

## Recording

Record per `.agents/TUTORIAL.md` Step 5. Every weakness becomes a drill card. Update the
readiness rows for all five spanned domains from this session's assessment — a capstone is
stronger evidence than a single drill, though weaker than a mock.
