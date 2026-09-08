# Defending Architecture Decisions — P5 Stakeholder Communication & Lifecycle Management

**Exam weight: 14% · part of the 35% that appears ONLY on Professional**

## What this session assumes

Sessions 1–11. This domain is about communicating and owning the decisions those sessions
taught you to make.

## Why this domain is worth 14% of your score

The Professional exam asks whether you can "defend the decisions to stakeholders". This is
the least technical domain and the one engineers most often under-prepare, which makes it
disproportionately worth studying — 14% is more than enough to decide a pass. Items are
scored on choosing the *right communication for the audience and situation*, and honest
communication of uncertainty consistently beats confident overclaiming.

## Authoritative sources

Less documentation-driven than other domains; the material to ground on is what these
documents let you *promise*, and what they don't.

**What you can and can't commit to**
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>
- <https://platform.claude.com/docs/en/about-claude/pricing>
- <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>
- <https://code.claude.com/docs/en/legal-and-compliance>

**Evidence to communicate with**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>
- <https://platform.claude.com/docs/en/manage-claude/analytics-api>
- <https://code.claude.com/docs/en/analytics>

**Adoption and organizational material**
- <https://code.claude.com/docs/en/champion-kit>
- <https://code.claude.com/docs/en/communications-kit>
- <https://code.claude.com/docs/en/best-practices>

## Teaching objectives

By the end, the learner can:

- Translate an architecture decision for the **audience that's asking**: an executive wants
  cost, risk, and timeline; a security reviewer wants controls and evidence; an engineering
  team wants mechanism and constraints; a product owner wants capability and limits
- State a decision as a **trade-off with an owner**: what was chosen, what was given up, why
  the constraint decided it, and who is accountable for the residual risk
- Communicate **uncertainty honestly** — probabilistic systems have error rates, and
  promising determinism you can't deliver is a failure mode, not diplomacy
- Set **expectations about non-determinism** with non-technical stakeholders, including that
  the same input may not produce the same output, and what the system does about that
- Handle the recurring hard conversations:
  - "Why can't it be 100% accurate?" → error rates, the validation boundary, and what the
    system does on failure
  - "Why is this so expensive?" → the cost model, the levers, and what each would cost in
    quality
  - "Can't we just use the best model?" → constraint-driven selection, with the arithmetic
  - "Is our data safe?" → retention, residency, and the controls, without overclaiming
  - "Why did it do that?" → observability, and the honest limits of explaining a model's
    choice
- Present a **build/no-build recommendation**, including recommending *against* a Claude
  solution when a deterministic system fits better — and recognize that this is a scored
  competence, not a failure to deliver
- Write a **decision record** that survives staff turnover: context, constraints,
  alternatives considered, decision, and revisit triggers
- Manage **scope and expectations over a project lifecycle**, including saying no with an
  alternative
- Report status honestly when a pilot underperforms, and frame the options rather than
  hiding the result

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which framing to use | Who is asking, and what decision do they own? |
| Quantify vs. qualify | Is there measured evidence, or only judgment? |
| Commit to a number vs. state a range | Do you have eval data supporting the number? |
| Recommend build vs. recommend against | Does a deterministic solution meet the requirement better? |
| Escalate a risk vs. own it | Is accepting it within your authority? |
| Explain the mechanism vs. the outcome | Does the audience act on how it works, or on what it does? |

## How to run this session

1. **Frame** — the least technical and most under-prepared domain, at 14%. That combination
   makes it high-value study. Say so directly.
2. **Teach audience translation.** Give one architecture decision and have the learner
   explain it four times — to a CFO, a CISO, a staff engineer, and a product owner — and
   critique each for the wrong altitude or the wrong concern. This is the session's core work.
3. **Teach the trade-off-with-an-owner form** and have them restate three decisions from
   earlier sessions in it.
4. **Teach honest uncertainty.** Ask them to answer "can you guarantee it won't make things
   up?" Reject any answer that overclaims; reject any that's so hedged it's useless. The
   target is a truthful answer a stakeholder can act on.
5. **Role-play the hard conversations.** Take all five above, with the agent playing a
   skeptical stakeholder who pushes back at least twice per exchange. Do not let a vague
   answer pass — this is the rehearsal that transfers to the exam.
6. **Teach the recommend-against case.** Give a scenario where a deterministic system is the
   right answer and have them make that recommendation to a sponsor who wants AI in the
   product. Name that the exam scores this as competence.
7. **Teach decision records** and have them write one for a decision from session 4 or 5.
8. **Teach honest status reporting** with an underperforming pilot: what they'd say, what
   options they'd present, and what they would not claim.
9. **Decision table** — walk all six rows.
10. **Scenario drill — 5 questions**, standalone Professional format. Include an audience-
    framing question, an uncertainty-communication question, a recommend-against question, a
    decision-record question, and one multiple-response on what a stakeholder brief must contain.
11. **Distractor autopsy** — expect overclaiming certainty to satisfy a stakeholder, and
    technical depth delivered to an audience that needed the business framing.
12. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — absent from Foundations.

## Out of scope

- Lifecycle mechanics: migration and deprecation → session 13
- Governance controls themselves → sessions 10–11
- Team enablement and productivity → session 16
