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

## Session focus

This is the least technical domain and the one engineers most under-prepare, which at 14% makes it disproportionately worth studying. The crux is **audience translation** — the same decision explained to a CFO, a CISO, a staff engineer, and a product owner — and the session's core work is the role-play, where you play a skeptical stakeholder who pushes back at least twice per exchange. The session opens with the other half of the domain: **structured discovery**, the requirement-gathering that happens *before* any design exists. Every other session in this tier starts from a stated requirement; this is where the learner practices producing one. Teach it as elicitation under the assumption that the stated ask is rarely the real one. Do not let a vague answer pass. Also teach the recommend-against case: advising against a Claude solution when a deterministic system fits better is scored as competence, not as failure to deliver.

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

- Run **structured discovery** on a vague request: establish the decision or task being
  automated today and who owns it, the volume and the shape of the inputs, what "correct"
  means and who adjudicates it, the tolerance for being wrong and the cost of each error
  direction, the constraints already fixed (budget, deadline, compliance posture, systems
  that cannot change), and how success will be measured after launch
- Distinguish the **stated ask from the underlying need** — "we want a chatbot on our
  docs" is a proposed solution, not a requirement — and ask the questions that recover the
  need without dismissing the sponsor's framing
- Identify the **missing stakeholder**: the team that owns the data, the reviewer whose
  workload changes, the compliance function that will gate launch. A requirement set
  gathered from the sponsor alone is incomplete by construction, and the omission usually
  surfaces at the worst moment
- Surface **unstated assumptions** early — expected accuracy, acceptable latency, who sees
  failures, whether a human stays in the loop — because these are the requirements that go
  unrecorded and then decide whether the delivered system is judged a success
- Recognize when discovery should conclude that **the problem is not worth solving this
  way**, and connect that to the recommend-against case below
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
| Ask more discovery questions vs. start designing | Do you know what "correct" means and who decides it? |
| Take the stated ask vs. reframe it | Is the request a need, or a proposed solution? |
| Which framing to use | Who is asking, and what decision do they own? |
| Quantify vs. qualify | Is there measured evidence, or only judgment? |
| Commit to a number vs. state a range | Do you have eval data supporting the number? |
| Recommend build vs. recommend against | Does a deterministic solution meet the requirement better? |
| Escalate a risk vs. own it | Is accepting it within your authority? |
| Explain the mechanism vs. the outcome | Does the audience act on how it works, or on what it does? |

## How to run this session

1. **Frame** — the least technical and most under-prepared domain, at 14%. That combination
   makes it high-value study. Say so directly.
2. **Teach structured discovery by making them do it.** Give a deliberately thin request —
   "leadership wants AI to handle our support tickets" — and have the learner interview you
   as the sponsor. Answer only what's asked, vaguely, the way a real sponsor would. Do not
   volunteer the constraints. Afterwards, name what they never asked: who adjudicates a
   correct answer, what a wrong one costs in each direction, what volume, what's already
   fixed, who else must sign off. Then reveal a constraint that invalidates their implied
   design — a compliance gate, or a data owner who won't grant access — and make the point
   that it was discoverable by asking. This is the session's second core exercise.
3. **Teach the stated-ask-versus-need distinction** and the missing-stakeholder check as
   the two habits that most reliably prevent a late-stage surprise.
4. **Teach audience translation.** Give one architecture decision and have the learner
   explain it four times — to a CFO, a CISO, a staff engineer, and a product owner — and
   critique each for the wrong altitude or the wrong concern. This is the session's core work.
5. **Teach the trade-off-with-an-owner form** and have them restate three decisions from
   earlier sessions in it.
6. **Teach honest uncertainty.** Ask them to answer "can you guarantee it won't make things
   up?" Reject any answer that overclaims; reject any that's so hedged it's useless. The
   target is a truthful answer a stakeholder can act on.
7. **Role-play the hard conversations.** Take all five above, with the agent playing a
   skeptical stakeholder who pushes back at least twice per exchange. Do not let a vague
   answer pass — this is the rehearsal that transfers to the exam.
8. **Teach the recommend-against case.** Give a scenario where a deterministic system is the
   right answer and have them make that recommendation to a sponsor who wants AI in the
   product. Name that the exam scores this as competence.
9. **Teach decision records** and have them write one for a decision from session 4 or 5.
10. **Teach honest status reporting** with an underperforming pilot: what they'd say, what
   options they'd present, and what they would not claim.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 5 questions**, standalone Professional format. Include an audience-
    framing question, an uncertainty-communication question, a recommend-against question, a
    decision-record question, and one multiple-response on what a stakeholder brief must contain.
13. **Distractor autopsy** — expect overclaiming certainty to satisfy a stakeholder, and
    technical depth delivered to an audience that needed the business framing.
14. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — absent from Foundations.

## Out of scope

- Lifecycle mechanics: migration and deprecation → session 13
- Governance controls themselves → sessions 10–11
- Team enablement and productivity → session 16
