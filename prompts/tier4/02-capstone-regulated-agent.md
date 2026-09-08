# Capstone: Agent in a Regulated Industry

**Spans P1, P2, P3, P4, P6 · Professional capstone 2 of 4**

## What this session is

A **capstone**. The learner designs a customer-facing agentic system inside a regulated
industry, end to end, while the agent plays the organization: a compliance officer, a
skeptical risk committee, and an incident that arrives late in the session.

Teach nothing new. This tests integration under the hardest combination on the exam —
autonomy plus regulation.

## Why this capstone

Capstone 1 covered internal rollout, where the blast radius is your own engineers. This one
inverts it: an agent taking actions that affect customers, under rules with legal force.
It's the scenario where the *right* answer is most often less autonomy, tighter validation,
and more human oversight than the technology strictly requires — and where an architect who
optimizes for capability fails. It also exercises P3 and P6, which capstone 1 doesn't.

## The problem

Construct a fresh brief each run. Include at minimum:

- **A regulated domain**: retail banking, health insurance claims, lending, or clinical
  triage support
- **A customer-facing task** the agent performs, with real consequences — payment disputes,
  claims adjudication support, eligibility determination, or account servicing
- **Volume figures** and a **latency expectation**
- **A cost ceiling**
- **The regulatory regime**, with at least two specific obligations: an explainability or
  adverse-action requirement, a data-handling rule (PHI/PII), a retention obligation, or a
  fair-treatment/non-discrimination requirement
- **A tiered action authority** — some actions the agent may take, some it may only
  recommend, some it must never touch
- **Multi-tenancy or data segregation** requirement
- **A stated quality bar** with a number, plus the consequence of missing it
- **An existing manual process** the agent is meant to augment, with its current accuracy

## How to run this session

Phases, in order. Do not let the learner design the agent before framing the risk.

### Phase 1 — Requirements, obligations, and the quality bar (10 min)
Have them extract the requirements and, separately, the **regulatory obligations** and what
each implies technically. Ask what the real quality bar is and how it compares to the
existing manual process — a common trap is holding the agent to perfection while the human
baseline is 94%.

### Phase 2 — Autonomy boundary (10 min)
Before any architecture: have them draw the autonomy boundary. Which actions are
autonomous, which are recommend-only, which are prohibited — justified on **reversibility,
stakes, and regulatory requirement**, not difficulty. Interrogate every autonomous
classification.

### Phase 3 — Architecture (15 min)
Agentic vs. workflow (and whether parts should be deterministic), model selection against
the constraints, tool design and permissions, data delivery with per-tenant/per-user
filtering, context architecture, and the validation boundary before any side effect. Demand
constraint-based justification throughout.

### Phase 4 — Quality, evals, and guardrails (10 min)
Have them design the eval suite — including how they'd measure fair treatment across
groups, which is a regulatory obligation as well as a quality one — the grading methods,
the regression gate, and the guardrails matched to specific failure modes. Ask the P3
question directly: "how would you know if it got worse?"

### Phase 5 — Governance, audit, and oversight (10 min)
Controls, enforcement points, audit trail sufficient for a regulator, retention, and the
human oversight model. Then play the compliance officer: "show me how you'd demonstrate to
an examiner that this system treated customers fairly last quarter." Accept only evidence.

### Phase 6 — The incident (10 min)
Introduce a live incident: the agent has been issuing incorrect adverse determinations for
three weeks, and it's just been discovered. Require them to work it: contain, assess scope,
identify root cause, remediate affected customers, report, and prevent recurrence. Ask what
in their design would have caught it sooner — and whether their answer in Phase 4 actually
would have.

### Phase 7 — Assessment

```
## Capstone 2 — Regulated Agent

| Domain | Assessment | Notes |
|---|---|---|
| P1 Integration | [1–4] | |
| P2 Solution Design | [1–4] | |
| P3 Evaluation & Optimization | [1–4] | |
| P4 Governance & Risk | [1–4] | |
| P6 Context & Prompting | [1–4] | |

**Strongest:** …
**Weakest:** …
**What a regulator would find:** …
```

Be blunt in that last line.

## Assessment criteria

Judge on: an autonomy boundary drawn on reversibility and regulation rather than
difficulty; a validation boundary before every side effect; evals that address the
regulatory obligations, not just accuracy; audit design that produces evidence; per-tenant
data isolation handled correctly; and incident handling in Phase 6 that starts with
containment rather than root cause.

Weak signals: autonomy granted because it's technically feasible, the quality bar set at
perfection without reference to the human baseline, guardrails offered generically,
compliance overclaimed, and a Phase 6 response that jumps to a fix before scoping the harm.

## Recording

Record per `.agents/TUTORIAL.md` Step 5. Weaknesses become drill cards. Update readiness
for all five spanned domains.
