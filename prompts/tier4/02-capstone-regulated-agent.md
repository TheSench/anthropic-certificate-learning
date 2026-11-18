# Capstone: Agent in a Regulated Industry

**Spans P1, P2, P3, P4, P5 · Professional capstone 2 of 4**

## What this session is

A **capstone**. The learner designs a customer-facing agentic system inside a regulated
industry, end to end, while the agent plays the organization: a compliance officer, a
skeptical risk committee, and an incident that arrives late in the session.

Teach nothing new. This tests integration under the hardest combination on the exam —
autonomy plus regulation.

## Session focus

The learner designs a customer-facing agentic system under a regulatory regime, while you play a compliance officer and a risk committee. The crux is the **autonomy boundary drawn on reversibility, stakes, and regulatory requirement — never on difficulty** — and it must be drawn *before* any architecture. Interrogate every autonomous classification. Watch for the trap of holding the agent to perfection when the human baseline it replaces is 94%. In Phase 6, a strong response starts with containment and scoping the harm, not with root cause.

## Why this capstone

Capstone 1 covered internal rollout, where the blast radius is your own engineers. This one
inverts it: an agent taking actions that affect customers, under rules with legal force.
It's the scenario where the *right* answer is most often less autonomy, tighter validation,
and more human oversight than the technology strictly requires — and where an architect who
optimizes for capability fails. It also exercises P4 and P2, which capstone 1 doesn't.

CCAR-P v1.1 § 6 warns that exam scenarios present artifacts — architecture diagrams,
configuration files, logs and traces, evaluation results, and code — and expect you to reason
from them. Phases 3, 4, and 6 below each hand the learner one to review.

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
- **A residency or data-custody obligation** that constrains both deployment surface and
  agent runtime
- **Untrusted content in context**: customer-uploaded documents, retrieved policy text, and
  at least one MCP server or third-party Skill
- **A side-effecting tool** (issue a refund, file a claim decision) behind a rate-limited
  downstream API

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

Add three beats:
- **Runtime selection (P1.6).** Have them choose the deployment surface and the agent
  runtime — Messages API loop, self-hosted Agent SDK or headless Claude Code, or Claude
  Managed Agents — under the residency obligation, and name what the choice costs in
  feature availability, session state, sandboxing, and data custody. Verify current
  per-surface runtime availability from live docs.
- **Injection surface (P5.2).** Have them trace every path untrusted content enters context
  — uploads, retrieved documents, tool results, MCP responses, the third-party Skill — and
  specify the control for each that stops it being treated as instruction.
- **Reliability under load (P3.8).** Show an error trace: a burst of rate-limit errors,
  client retries with backoff, and two customers refunded twice after client-side timeouts.
  Have them name the control (idempotency on the side-effecting tool) and explain why
  tuning retries alone would not fix it.

### Phase 4 — Quality, evals, and guardrails (10 min)
Have them design the eval suite — including how they'd measure fair treatment across
groups, which is a regulatory obligation as well as a quality one — the grading methods,
the regression gate, and the guardrails matched to specific failure modes. Ask the P4
question directly: "how would you know if it got worse?"

Then show **evaluation results**: an LLM judge scores the agent's explanations 4.6/5 while
human reviewers rate the same sample far lower, and the judge's scores rise with
explanation length while order and model family show no pattern. Have them name the
responsible bias — position, verbosity, self-preference, or judge drift — and the correction
(P4.3). Then show a fairness breakdown with disparate outcomes across groups and have them
decide whether the source is data, prompt framing, or evaluation design before choosing a
mitigation (P5.6).

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

Give the root cause as **traces**, not a narrative: a handful of request traces where the
retrieval step returns a superseded policy version and the agent cites it faithfully. Have
them isolate the cause among prompt failure, retrieval failure, hallucination, tool or
subagent error, and model mismatch (P4.5), then name the monitoring signal that would have
surfaced it (P3.4).

### Phase 7 — Assessment

```
## Capstone 2 — Regulated Agent

| Domain | Assessment | Notes |
|---|---|---|
| P1 Solution Design and Architecture | [1–4] | |
| P2 Claude Models, Prompting, and Context Engineering | [1–4] | |
| P3 Integration | [1–4] | |
| P4 Evaluation, Testing, and Optimization | [1–4] | |
| P5 Governance, Safety, and Risk Management | [1–4] | |

**Strongest:** …
**Weakest:** …
**What a regulator would find:** …
```

Be blunt in that last line.

## Assessment criteria

Judge on: an autonomy boundary drawn on reversibility and regulation rather than
difficulty; a validation boundary before every side effect; evals that address the
regulatory obligations, not just accuracy; audit design that produces evidence; per-tenant
data isolation handled correctly; a runtime choice justified against the residency
obligation; idempotency rather than retry tuning for the duplicate side effect; the judge
bias named correctly; root cause read from the traces rather than guessed; and incident
handling in Phase 6 that starts with containment rather than root cause.

Weak signals: autonomy granted because it's technically feasible, the quality bar set at
perfection without reference to the human baseline, guardrails offered generically, a
prompt instruction offered where an enforceable control was needed, compliance overclaimed,
and a Phase 6 response that jumps to a fix before scoping the harm.

## Recording

Record per `.agents/TUTORIAL.md` Step 5. Weaknesses become drill cards. Update readiness
for all five spanned domains.
