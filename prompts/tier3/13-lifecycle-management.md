# Lifecycle: Migration and Deprecation — P5 Stakeholder Communication & Lifecycle Management

**Exam weight: 14% · part of the 35% that appears ONLY on Professional**

## What this session assumes

Sessions 4, 7, and 12 (model selection; evals; stakeholder communication). Evals are the
precondition for everything here.

## Why this domain is worth 14% of your score

The P5 domain description names **system ownership over time**. A Claude system's
dependencies move underneath it — models are released and deprecated, prompts drift as
requirements change, and the input distribution shifts. The scored skill is owning that
change safely, and the recurring right answer is that an eval suite is what makes
migration a managed process rather than a gamble.

## Authoritative sources

Verify the current deprecation schedule and migration guidance — dates and supported
models change, and a stale date is a wrong answer.

**Model lifecycle**
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>
- <https://platform.claude.com/docs/en/about-claude/models/migration-guide>
- <https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions>
- <https://platform.claude.com/docs/en/models/overview>

**Model-specific migration notes**
- <https://platform.claude.com/docs/en/models/opus-5/migration-guide>
- <https://platform.claude.com/docs/en/models/sonnet-5/migration-guide>

**Prompt portability across models**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

**Validation and monitoring**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/manage-claude/analytics-api>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>

**SDK and platform version changes**
- <https://code.claude.com/docs/en/agent-sdk/migration-guide>
- <https://code.claude.com/docs/en/changelog>

## Teaching objectives

By the end, the learner can:

- Explain the **model lifecycle** — release, general availability, deprecation notice,
  retirement — and design an upgrade cadence that doesn't leave the system on a retiring
  model
- Pin **model versions explicitly** in production rather than tracking a moving alias, and
  explain the trade-off: reproducibility versus manual upgrade work
- Run a **migration** as a managed process: run the eval suite on the new model, compare
  against the baseline, investigate regressions, adjust prompts if needed, canary in
  production, then roll out — with a rollback path at every stage
- Explain why **prompts are not perfectly portable** across models, and that a migration
  can require prompt work even when the new model is stronger overall
- Design **canary and staged rollout** for a probabilistic system, including what signal
  would abort the rollout and who watches it
- Detect **prompt and data drift**: the input distribution moves, so a prompt that was
  tuned for last year's traffic silently degrades — and monitoring output metrics is how
  you notice
- Maintain a **prompt inventory** with ownership, so an org knows what prompts exist, which
  model each targets, and who maintains them — an unowned prompt is a latent outage
- Plan for **deprecation of a system you built**: what happens to it when the owner leaves
  or the business need ends
- Communicate a migration to stakeholders: what could change, what you'll validate, and the
  rollback plan — connecting to session 12
- Explain why migrating **without** an eval suite is the wrong answer, and what to do when
  you inherit exactly that situation

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Pin a version vs. track latest | Does reproducibility or automatic improvement matter more? |
| Migrate now vs. wait | How close is retirement, and is the eval evidence in hand? |
| Adjust the prompt vs. accept the regression | Is the regression in a criterion that matters? |
| Canary vs. full cutover | Is the failure detectable quickly and reversible? |
| Build evals first vs. migrate under deadline | Is there a forced retirement date? |
| Monitor drift vs. periodic re-evaluation | Does the input distribution move continuously? |

## How to run this session

1. **Frame** — ownership over time. The recurring right answer here is the eval suite.
2. **Verify the deprecation schedule and current model set** from live docs before teaching
   any date or model name.
3. **Teach the lifecycle** and have the learner design an upgrade cadence for a system with
   a stated risk tolerance.
4. **Teach version pinning** and its trade-off. Ask which they'd choose for a regulated
   workload versus an internal tool, and why.
5. **Teach the migration process** end to end. Have them write out the runbook, then
   interrogate it: what aborts the rollout, who decides, how do you roll back, and what if
   the regression is only in one criterion?
6. **Teach prompt non-portability.** Ask whether a stronger model can score worse on their
   suite. It can — and understanding why is the point.
7. **Teach canary design** for probabilistic systems, including the abort signal.
8. **Teach drift detection** — the failure that arrives without any change on your side.
   Ask how they'd notice, and what they'd monitor.
9. **Teach the prompt inventory** and the unowned-prompt risk.
10. **Teach the inherited-no-evals situation**, which is the realistic case: what do you do
    when a retirement date is fixed and you have no suite? Have them sequence it under the
    deadline.
11. **Teach migration communication**, connecting to session 12.
12. **Decision table** — walk all six rows.
13. **Scenario drill — 5 questions**, standalone Professional format. Include a
    pinning decision, a migration sequencing question under a retirement deadline, a
    regression-triage question, a drift-detection question, and one multiple-response on
    what a migration plan must include.
14. **Distractor autopsy** — expect migration without eval evidence, and stronger-model
    upgrades assumed safe.
15. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — absent from Foundations.

## Out of scope

- Eval construction itself → session 7
- Model selection criteria → session 4
- Deployment surface parity timing → session 2
- Team enablement → session 16
