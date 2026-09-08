# Capstone: Enterprise Claude Code Rollout

**Spans P1, P2, P4, P5, P7 · Professional capstone 1 of 4**

## What this session is

A **capstone**, not a lesson. The learner works one large architecture problem end to end,
in the role of the architect accountable for it, while the agent plays the organization —
skeptical stakeholders, a security review, a budget owner, and reality intruding partway
through.

Teach nothing new. The work is integrating what Tiers 1–3 taught under realistic pressure,
and the assessment is whether the learner produces a defensible design and can defend it.

## Why this capstone

The Professional exam asks whether you can own a system in production: build it, ship it,
defend the decisions, and keep it safe and compliant. That is one continuous competence,
and testing it in domain-sized pieces misses the integration. This capstone targets the
rollout scenario — the most common real Architect engagement, and the one that most
naturally spans governance, enablement, integration, and stakeholder management.

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

## How to run this session

Run it in phases. Do not let the learner skip ahead to implementation.

### Phase 1 — Requirements and constraints (10 min)
Present the brief. Have the learner extract requirements and constraints, and explicitly
separate the two. Ask what's missing from the brief and what they'd need to ask — a good
architect asks about data classification, existing tooling, and the real success measure.
Answer their questions in character.

### Phase 2 — Architecture (15 min)
Have them design: deployment surface, identity and credential model, configuration
hierarchy and what's centrally enforced, MCP and tool strategy, CI integration, and the
network/trust boundaries. Require a justification per decision, referencing the constraint
that drove it. Push back on any decision made from preference rather than constraint.

### Phase 3 — Governance and risk (10 min)
Have them produce the control set: what's enforced where, what the audit trail contains,
the risk register with likelihood/impact, and at least one **explicitly accepted** risk.
Then play the security reviewer and interrogate it. Ask for evidence, not intent.

### Phase 4 — Rollout and enablement (10 min)
Have them sequence the rollout under the stated deadline, choose success metrics that
resist gaming, and design the cost attribution model. Challenge any activity metric.

### Phase 5 — Stakeholder defense (10 min)
Play the skeptical stakeholder from the brief and press the objection at least three
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
| P1 Integration | [1–4] | |
| P2 Solution Design | [1–4] | |
| P4 Governance & Risk | [1–4] | |
| P5 Stakeholder & Lifecycle | [1–4] | |
| P7 Enablement | [1–4] | |

**Strongest:** …
**Weakest:** …
**Decisions that wouldn't survive a real review:** …
```

Be candid in that last line — a capstone that flatters the learner is worthless. Name
specifically what a real review board would reject and why.

## Assessment criteria

Judge on: constraint-driven decisions rather than preference; trade-offs named without
prompting; at least one risk explicitly accepted; enforcement distinguished from policy;
honest handling of uncertainty under stakeholder pressure; and graceful adaptation in
Phase 6.

Weak signals to call out: designs that ignore a stated constraint, claims of no downside,
compliance overclaimed, activity metrics offered as productivity evidence, and restarting
the design when Phase 6 hits.

## Recording

Record per `.agents/TUTORIAL.md` Step 5. Every weakness becomes a drill card. Update the
readiness rows for all five spanned domains from this session's assessment — a capstone is
stronger evidence than a single drill, though weaker than a mock.
