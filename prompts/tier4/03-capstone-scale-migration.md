# Capstone: Scale and Model Migration

**Spans P2, P3, P5, P6, P7 · Professional capstone 3 of 4**

## What this session is

A **capstone**. The learner inherits an existing Claude system that works but doesn't
scale, and must both fix it and migrate it off a retiring model — under a deadline, with
no eval suite, and with stakeholders who were promised it was done.

Teach nothing new. This is the inheritance scenario, and it's the most realistic of the
four.

## Session focus

The learner inherits a working-but-unscalable system, undocumented and unevaluated, on a model with a retirement date. This is the most realistic of the four capstones. The crux is the **sequencing decision in Phase 2**: with a deadline, no evals, a cost overrun, and a scaling problem, the strong answer builds a minimal eval suite first, because everything else is unsafe without it. Push hard if the learner sequences the migration first — ask how they'd know it broke something. Require they name the planted defects unprompted.

## Why this capstone

The first two capstones design greenfield systems. Most real Architect work is inheriting
something: undocumented, unevaluated, over-budget, and depending on a model with a
retirement date. This capstone is built around the domain's recurring right answer — that
you cannot safely change what you cannot measure — and forces the learner to sequence
building that measurement under time pressure. It's also the only capstone that
substantially exercises P5 lifecycle mechanics.

## The problem

Construct a fresh brief each run. Include at minimum:

- **An inherited system** in production, serving real users, with a described purpose
- **Its current architecture**, deliberately including two or three defects a Tier 1–3
  learner should recognize: unbounded context growth, model-loop retries, an unvalidated
  side effect, a shared cacheable prefix containing per-tenant data, or a single model
  handling both trivial and hard requests
- **A retiring model** with a stated retirement date close enough to force sequencing
- **No eval suite**, and prompts stored somewhere unversioned
- **Cost figures** showing it's over budget, with a target
- **Growth projections** — traffic multiplying within a stated period
- **A latency problem** at p99 while the mean looks fine
- **Stakeholders** who believe the system is finished, and a prior commitment made about it
- **One team member** who wrote it and has since left, plus one who's protective of it

## How to run this session

Phases in order. The sequencing decision in Phase 2 is the heart of the session.

### Phase 1 — Assessment and triage (10 min)
Have them assess the inherited system: what's actually wrong, and which problems are urgent
versus important. Require them to name the defects from the brief without being pointed at
them. Ask what they'd measure first and what they'd need access to.

### Phase 2 — Sequencing under the deadline (10 min)
The central exercise. They have a retirement date, no evals, a cost overrun, and a scaling
problem. Have them sequence the work and defend the order. The strong answer builds a
minimal eval suite first — from production traffic and known failures — because everything
else is unsafe without it. Push hard if they sequence the migration first; ask how they'd
know the migration broke something.

### Phase 3 — The eval suite under time pressure (10 min)
Have them design a *minimal viable* eval suite: where the cases come from, how many, what
grading method per criterion, and what threshold gates the migration. Ask what they're
knowingly not covering, and whether that's acceptable.

### Phase 4 — Fix the architecture (10 min)
Have them address the defects and the scaling problem: context architecture, cost levers
with side effects named, p99 versus mean, and the growth projection. Require the arithmetic
on whether their plan meets the cost target.

### Phase 5 — Execute the migration (10 min)
The runbook: eval on the new model, triage regressions, prompt adjustments, canary, rollout,
rollback triggers, and who watches. Then introduce a complication: the new model scores 4%
worse on one criterion that matters and better on the rest. Have them decide and justify.

### Phase 6 — Stakeholders and ownership (10 min)
Play the stakeholder who was told this was done, and ask why more investment is needed. Then
play the protective original-team engineer objecting to the changes. Then require them to
establish ongoing ownership: prompt inventory, who owns what, drift monitoring, and the
upgrade cadence so this doesn't recur.

### Phase 7 — Assessment

```
## Capstone 3 — Scale and Migration

| Domain | Assessment | Notes |
|---|---|---|
| P2 Solution Design | [1–4] | |
| P3 Evaluation & Optimization | [1–4] | |
| P5 Stakeholder & Lifecycle | [1–4] | |
| P6 Context & Prompting | [1–4] | |
| P7 Enablement | [1–4] | |

**Strongest:** …
**Weakest:** …
**What would have gone wrong in production:** …
```

## Assessment criteria

Judge on: evals sequenced before the migration; the inherited defects identified unprompted;
cost levers named with their side effects; p99 addressed distinctly from mean; a migration
runbook with real rollback triggers; a defensible call on the mixed-regression complication;
and ownership established so the situation doesn't repeat.

Weak signals: migrating without measurement, optimizing before baselining, fixing everything
at once under a deadline, treating the 4% regression as automatically disqualifying (or
automatically acceptable) without asking whether that criterion matters, and no ongoing
ownership model.

## Recording

Record per `.agents/TUTORIAL.md` Step 5. Weaknesses become drill cards. Update readiness for
all five spanned domains.
