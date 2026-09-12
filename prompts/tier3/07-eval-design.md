# Designing Evals That Catch Regressions — P3 Evaluation, Testing & Optimization

**Exam weight: 16%**

## What this session assumes

Sessions 4–6. Session 6 raised the question of how you'd measure an SLO; this answers it.

## Why this domain is worth 16% of your score

P3 is quality measurement, and it's the domain most often skipped by practitioners who
learned Claude by building rather than by operating. The scored idea: you cannot manage
prompt or model changes without an eval suite, so "how would you know if this change made
it worse" is the question behind most P3 items. Answers that rely on spot-checking or
vibes are wrong.

## Session focus

This session answers the question behind most P3 items: **"how would you know if this change made it worse?"** Hold the learner to it — any answer that can't be measured isn't an answer. The crux is LLM-as-judge done properly, including the step most people skip: validating the judge against human labels. An unvalidated judge is a measurement you cannot trust, and spot-checking is not a regression strategy. Also do the eval-set sizing arithmetic; the number of cases needed to detect a small regression is persuasive in a way the principle isn't.

## Authoritative sources

**Test design**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

**Grading approaches**
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
- <https://platform.claude.com/docs/en/build-with-claude/citations>

**What evals gate**
- <https://platform.claude.com/docs/en/about-claude/models/migration-guide>
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>

**Running evals cheaply at volume**
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>

**Claude Code-side evaluation**
- <https://code.claude.com/docs/en/agent-sdk/observability>

## Teaching objectives

By the end, the learner can:

- Build test frameworks using **mixed methodologies** (the guide's phrase) — combining
  programmatic assertions, LLM-judged criteria, and human review in one suite rather than
  committing to a single grading mode, because different criteria in the same task are
  checkable in different ways
- Build an eval suite from real production data — the failure cases you've actually seen —
  rather than synthetic happy paths, and explain why that ordering matters
- Choose the **grading method** per criterion and justify it: exact match, programmatic
  assertion or invariant check, **LLM-as-judge**, or human review — and name the cost and
  reliability of each
- Design an LLM-judge rubric that's actually reliable: explicit criteria, a scale with
  defined levels, and validation of the judge itself against human labels — and explain
  why an unvalidated judge is a measurement you can't trust
- Explain the **judge-model independence** concern and why judging with the same model and
  prompt family you're evaluating is a weak design
- Distinguish what to measure: task success, output format validity, faithfulness to
  sources, refusal rate, latency, and cost per task — and pick the ones that map to the
  business requirement
- Set up **regression gating**: an eval that runs on prompt and model changes, with a
  threshold, so a quality drop is caught before deployment rather than by users
- Design evals for **agentic systems specifically**, where the trajectory matters as well
  as the output — did it use the right tools, escalate correctly, stay in budget
- Evaluate a **retrieval pipeline as its own stage**, separately from the generation that
  consumes it — session 3 designs the pipeline and defers its measurement here:
  - **Retrieval metrics**: *recall@k* (did the needed chunk make the top k at all — the
    ceiling on everything downstream), *precision@k* (how much of what came back was
    relevant), and a rank-sensitive measure (MRR or NDCG) for whether the right chunk
    landed near the top rather than at position 40
  - **Generation-side metrics**: *faithfulness* / groundedness — is the answer actually
    supported by the retrieved chunks — and answer relevance, which is a different
    question from whether retrieval succeeded
  - The diagnostic that follows: **low recall@k is a retrieval bug** (chunking, embedding,
    or strategy) and no amount of prompt work fixes it, while **good recall with poor
    faithfulness is a generation bug**. Being able to say which stage failed is the point
    of measuring them separately
  - Build the retrieval eval set as **query → known-relevant-chunk pairs**, and mind that
    it needs refreshing when the corpus changes, just like any other eval set
- Run an **A/B test** to validate an improvement in production, and say what it buys over
  an offline eval: offline suites measure against fixed cases you chose, an A/B test
  measures against live traffic you didn't. Name the mechanics — split traffic between
  variants, fix the success metric *before* running, and let it run long enough that the
  difference clears noise
- Distinguish **A/B test from canary**: a canary is a risk-limiting rollout (small share
  first, watching for breakage, roll forward or back), an A/B test is a *comparison*
  designed to answer which variant is better. They look alike and answer different
  questions
- Place A/B testing in the **iteration loop** rather than treating it as a one-off:
  baseline → offline eval gates the change → A/B validates it on real traffic →
  production signal feeds the next eval set
- Explain **eval set hygiene**: holding out data, avoiding overfitting to the suite, and
  refreshing it as production distribution shifts
- Size an eval set sensibly and explain why a 20-case suite can't detect a 2% regression
- Establish a **baseline** before optimizing anything, and connect this to the
  measure-before-optimizing discipline from session 5

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Programmatic assertion vs. LLM judge | Is correctness mechanically checkable? |
| LLM judge vs. human review | Is the judgment subjective *and* high-stakes? |
| Gate on the eval vs. monitor in production | Is the failure's cost recoverable after release? |
| Trajectory eval vs. output-only | Could the right answer be reached the wrong way? |
| Fix retrieval vs. fix the prompt | Did the needed chunk make the top k at all? |
| Recall@k vs. faithfulness | Is the suspect stage retrieval, or generation? |
| Offline eval vs. A/B test | Are you gating a change, or comparing two live variants? |
| A/B test vs. canary rollout | Are you asking "which is better" or "is this safe"? |
| Grow the eval set vs. ship | Is the suite large enough to detect the regression you care about? |
| Refresh the suite vs. keep it stable | Has the production input distribution moved? |

## How to run this session

1. **Frame** — every P3 item reduces to "how would you know?". Say it, and hold the learner
   to it: any answer that can't be measured is not an answer.
2. **Teach production-data-first eval construction.** Ask where their test cases should come
   from. If they say "write representative examples", push back: the failures you've seen
   are more valuable than the cases you can imagine.
3. **Teach the grading methods** and have them assign one per criterion for a stated task
   with five criteria. Include one that's mechanically checkable (a date format) and one
   genuinely subjective (tone appropriateness).
4. **Teach LLM-as-judge properly**, including the validation step. Have them draft a rubric,
   then ask: how do you know the judge is right? If they don't reach validating against
   human labels, supply it — this is the most commonly missed step.
5. **Teach judge independence** and why same-model judging is weak.
6. **Teach metric selection** against a business requirement, not for its own sake.
7. **Teach regression gating.** Have them design the gate: what runs, on what trigger, at
   what threshold, and who can override.
8. **Teach agentic evals** — trajectory as well as outcome. Ask for an example where the
   output was right and the trajectory was unacceptable (e.g. burned the budget, escalated
   when it shouldn't have, took a destructive path that happened to work).
9. **Teach eval set hygiene and sizing.** Do the arithmetic on detecting a small regression
   with a small suite — the number is persuasive.
10. **Teach retrieval evaluation** — session 3 built the pipeline and deferred its
    measurement to here, so close that loop explicitly. Give a RAG system returning
    confident, wrong answers and ask how they'd localize the fault. Drive to measuring
    the stages separately: recall@k first, because it caps everything downstream, then
    precision and rank position, then faithfulness on the generation side. Make the
    diagnostic rule explicit — low recall@k is never fixed by prompt work — since
    "improve the prompt" is the tempting wrong answer to most RAG failures. Finish on
    how the eval set is built (query → known-relevant chunks) and when it goes stale.
11. **Teach A/B testing** as the production half of the loop. Ask what an offline suite
    can't tell them (how it behaves on traffic they didn't anticipate), then have them
    design one: traffic split, the metric fixed in advance, and how long it must run.
    Separate it from a canary explicitly — same mechanism, different question — since
    conflating them is the common error. Close the loop back to step 2: production signal
    becomes next quarter's eval cases.
12. **Teach baselines** as a precondition for all optimization, setting up session 9.
13. **Decision table** — walk all ten rows.
14. **Scenario drill — 7 questions**, standalone Professional format. Include a grading
    method choice, a judge-validity question, a gating design, an agentic trajectory
    question, a retrieval-failure localization item, an A/B-vs-canary or A/B-design item,
    and one multiple-response on eval suite defects.
15. **Distractor autopsy** — expect unvalidated LLM-judge answers, spot-checking offered as
    a regression strategy, eval sets too small for the claim being made, and prompt fixes
    offered for retrieval failures.
16. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Adversarial robustness and guardrails → session 8
- Cost and latency tuning → session 9
- Compliance evidence and audit → session 10
- Model migration validation → session 13
