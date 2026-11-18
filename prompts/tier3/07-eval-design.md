# Designing Evals That Catch Regressions — P4 Evaluation, Testing, and Optimization

**Exam weight: 17%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P4.1 — Evaluation Coverage Gaps: Analyzing an existing evaluation suite after a failure
  reached production to determine which metric dimension (accuracy, groundedness, latency,
  cost, safety, security) or grading target was missing, and specifying the metric that
  would have detected the failure pre-release.
- P4.2 — Deriving Evaluations from Business Processes: Determining which portion of a
  business process constitutes a valid evaluation for a decision it must support (model
  change, prompt change, release gate), deriving the success criterion from the business
  outcome, and selecting the test-methodology mix that covers the deployed distribution.
- P4.3 — LLM-as-Judge Design and Bias: Evaluating the design of an LLM-as-judge or
  rubric-based evaluation whose results are inconsistent with human review, and selecting
  the correction that addresses the responsible bias (position, verbosity, self-preference,
  judge drift).
- P4.4 — Experimental Design for Configuration Comparison: Applying an experimental design
  that, within a stated sample and cost budget, yields an interpretable comparison of two
  candidate prompt or model configurations, including the number of trials per case needed
  to separate the configuration effect from run-to-run variance.

## What this session assumes

Sessions 31–33. Session 33 raised the question of what you'd monitor and how you'd
measure an SLO; this answers the pre-release half.

## Why this domain is worth 17% of your score

P4 Evaluation, Testing, and Optimization is 17% of the Professional exam, and this session
owns four of its seven objectives. It's the domain most often skipped by practitioners who
learned Claude by building rather than by operating. The question behind most P4 items is
"how would you know if this change made it worse?" — and v1.1 sharpens it into four
diagnose-and-select tasks: which dimension the suite missed, which slice of the business
process the eval should be, which bias is skewing the judge, and how many trials it takes
to trust a comparison. Answers that rely on spot-checking or vibes are wrong.

## Session focus

This session answers **"how would you know if this change made it worse?"** and holds the learner to it — any answer that can't be measured isn't an answer. The crux is that a measurement must both **see the failure and be trustworthy**: a suite that never scores groundedness or the right grading target cannot catch the failure that reached production (P4.1), and a judge whose verdicts drift from human review is a measurement you cannot act on (P4.3). Spend disproportionate time on P4.3 — given a judge that disagrees with humans, the learner must name the responsible bias from *where* it disagrees (position, verbosity, self-preference, judge drift) and pick the matching correction — and on the P4.4 arithmetic: run-to-run variance means one trial per case cannot separate a configuration effect from noise, and the number of trials needed is persuasive in a way the principle isn't.

## Authoritative sources

**Test design and success criteria**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

**Groundedness and grading**
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>

**Decisions evals support**
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>
- <https://platform.claude.com/docs/en/about-claude/models/migration-guide>

**Running evals cheaply at volume**
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>

**Agent-side evaluation**
- <https://code.claude.com/docs/en/agent-sdk/observability>

## Teaching objectives

By the end, the learner can:

**P4.1 — finding the missing dimension or grading target**

- Name the six metric dimensions P4.1 lists — **accuracy, groundedness, latency, cost,
  safety, security** — and, given a production failure, say which one the suite never
  measured. Groundedness is the one learners forget: an answer can be accurate-looking
  and fluent yet unsupported by the sources it was given, and only a faithfulness check
  against those sources (citations, claim-to-source verification) sees it
- Tell the other dimensions apart from the failure described: **latency** and **cost**
  failures are SLA or budget breaches that a quality-only suite passes; **safety** is
  harmful or policy-violating output to an ordinary request; **security** is the system
  being made to act against its owner — injected instructions followed, data exfiltrated,
  a tool misused. Safety vs. security is the pair items use against each other: ask
  whether the harm came from the model's own output or from an adversary steering it
- Recognize a **grading-target** gap, distinct from a missing dimension: the suite
  measured the right dimension on the wrong object — the final answer but not the
  trajectory (right answer reached by a destructive path or a blown budget), the format
  but not the values, the answer but not its citations, the single turn but not the
  multi-turn session
- Specify the metric that would have detected the failure **pre-release**: what is scored,
  on which cases, by which grader, against what threshold
- Keep retrieval measurement only as it serves groundedness: scoring retrieval separately
  (did the needed chunk reach context — recall@k) tells you whether an ungrounded answer
  is a generation defect or a retrieval one. Root-causing a live failure from its traces
  (P4.5) is session 33's; session 30 designs the retrieval pipeline

**P4.2 — deriving evals from a business process**

- Identify which **portion of a business process** is a valid eval for the decision at
  hand: the step whose output the business actually relies on, where ground truth exists
  (historical decisions with known outcomes, reviewed cases), not the whole process or
  the easiest-to-score step
- Shape the eval to the **decision** it supports:
  - **Model change** — broad regression across the deployed distribution, plus latency and
    cost, because everything may move (validating a migration under a deprecation
    timeline, P4.7, is session 40's)
  - **Prompt change** — targeted cases for the behaviour changed, plus the regression set
    to catch collateral damage
  - **Release gate** — a threshold on the business-derived criterion, plus the safety and
    security sets, run automatically with a named override owner
- **Derive the success criterion from the business outcome** ("misrouted claims below the
  current human rate", "no refund issued without a matching order") rather than from a
  proxy that is easy to score ("judge rates 4 of 5")
- Report results **per segment** (user group, language, input class) as well as in
  aggregate: an aggregate can pass while a failure concentrates in one group. Session 38
  builds its bias-evidence work on this
- Select the **test-methodology mix** that covers the deployed distribution: programmatic
  assertions for mechanically checkable criteria, LLM-judged criteria for open-ended
  quality, human review for subjective high-stakes judgments, production-sampled cases
  (the failures you've actually seen) over synthetic happy paths, and adversarial and
  edge cases — stratified so rare-but-costly slices are represented, not just the common
  traffic. Different criteria in the same task are checkable in different ways, so one
  grading mode is rarely enough
- Keep the suite representative: hold out data, avoid overfitting prompts to the suite,
  and refresh it when the production input distribution moves

**P4.3 — LLM-as-judge bias and its correction**

- Treat a judge as a measurement instrument that must be **calibrated against human
  labels** before its results are trusted; when it disagrees with human review, diagnose
  *which* bias from the pattern of disagreement:

  | Bias | The disagreement pattern | Correction |
  |---|---|---|
  | **Position** | In pairwise comparison, verdicts favour whichever response is shown first (or second); swapping order flips them | Run both orders and keep only consistent verdicts (or average), randomize order |
  | **Verbosity** | Disagreements concentrate where the candidate is longer; length predicts score | Rubric criteria that score content, not length; length-matched comparisons; check score–length correlation |
  | **Self-preference** | The judge rates outputs from its own model family higher than humans do | Judge with a different model family, or calibrate against human labels and correct |
  | **Judge drift** | Scores move over time with no change to the system under test — after a judge model version or judge-prompt change | Pin the judge model version and rubric; re-validate against a fixed human-labelled anchor set on a schedule and on any judge change |

- Design a rubric that resists these: explicit criteria, a scale with defined levels,
  reasoning before the score, and a human-labelled calibration set with an agreement
  threshold the judge must meet
- Know when a judge is the wrong grader: mechanically checkable criteria want a
  programmatic assertion; subjective *and* high-stakes judgments want human review

**P4.4 — experimental design for comparing two configurations**

- Explain **run-to-run variance**: the same configuration on the same case can pass on one
  trial and fail on the next, so a single trial per case confounds the configuration
  effect with noise
- Design a comparison that is interpretable within a stated sample and cost budget:
  - **Paired** — both configurations on the same cases, holding the judge, data, and
    everything else fixed, so case difficulty cancels out
  - **Multiple trials per case** — enough to estimate each case's pass rate; more trials
    where per-case variance is high
  - **A noise floor** — an A-vs-A run (the same configuration twice) shows how large a
    difference variance alone produces; a configuration difference smaller than that is
    not a finding
  - **The cases-vs-trials trade-off** — with a fixed budget, more cases reduce
    case-sampling error and more trials reduce per-case noise; spend on whichever
    dominates the variance
- Do the sizing arithmetic: why a 20-case, one-trial suite cannot detect a 2-point
  regression, and what it would take
- Decide what the success metric is **before** running, and establish a **baseline**
  before optimizing anything (session 36's cost work depends on it)
- Place **A/B testing** on live traffic as the online version of the same design — split
  traffic, fix the metric in advance, run until the difference clears noise — and
  distinguish it from a **canary**, which limits rollout risk rather than comparing
  variants

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Missing dimension vs. missing grading target | Was the property never scored, or scored on the wrong object? |
| Accuracy check vs. groundedness check | Could the answer look right yet be unsupported by its sources? |
| Safety metric vs. security metric | Did harm come from the model's own output, or from an adversary steering the system? |
| Trajectory eval vs. output-only | Could the right answer be reached the wrong way? |
| Which process step is the eval | Which output does the business rely on, and where does ground truth exist? |
| Eval shape for model change vs. prompt change vs. release gate | What decision does the result have to support? |
| Programmatic assertion vs. LLM judge vs. human review | Is it mechanically checkable — and if not, is it high-stakes? |
| Position vs. verbosity vs. self-preference vs. drift | Does disagreement track order, length, the candidate's model family, or time? |
| One trial per case vs. several | Is run-to-run variance comparable to the effect you want to detect? |
| More cases vs. more trials | Which dominates the variance — case sampling or per-case noise? |
| A/B test vs. canary | Are you asking "which is better" or "is this safe"? |

## How to run this session

1. **Frame** — every P4 item reduces to "how would you know?". Say it, and hold the learner
   to it: any answer that can't be measured is not an answer.
2. **Teach P4.1 with a post-mortem.** Give a failure that reached production (e.g. a policy
   assistant confidently citing a clause that isn't in the retrieved policy) and the suite
   that passed it (exact-match accuracy plus latency). Ask which dimension was missing
   (groundedness) and what metric would have caught it. Then a second post-mortem where the
   dimension was present but the grading target was wrong (final-answer grading on an
   agent that deleted and recreated a record to get there).
3. **Teach P4.2 from a business process.** Describe a process (e.g. insurance claims:
   intake, document extraction, coverage decision, customer letter) and a decision
   ("switch the model", "change the extraction prompt", "release to all regions"). Have
   the learner pick the step that is the valid eval, derive the success criterion from
   the business outcome, and assemble the methodology mix. Push back on synthetic happy
   paths: the failures you've seen beat the cases you can imagine.
4. **Teach grading methods** by having them assign one per criterion for a task with five
   criteria — include one mechanically checkable (a date format) and one subjective (tone).
5. **Teach regression gating** for the release-gate case: what runs, on what trigger, at
   what threshold, and who can override.
6. **Teach P4.3 — the four biases.** Have them draft a judge rubric, then ask how they know
   the judge is right; supply human-label calibration if they don't reach it. Then show
   four disagreement patterns between judge and humans without naming the bias, and have
   them diagnose and correct each. Insist on the evidence that identifies the bias.
7. **Teach P4.4 experimental design.** Give two prompt configurations, a budget, and
   noisy single-trial results showing a small difference. Ask whether it's real. Drive to
   paired design, multiple trials per case, an A-vs-A noise floor, and the cases-vs-trials
   trade-off. Do the arithmetic — the numbers are persuasive.
8. **Teach A/B vs. canary** briefly, as the live-traffic version of step 7. Close the loop:
   production signal becomes next quarter's eval cases.
9. **Decision table** — walk all eleven rows.
10. **Scenario drill — 7 questions**, standalone Professional format with evaluation
    results or a judge's scores in each stem. Include two missing-dimension items (one on
    groundedness, one where the gap is safety vs. security, latency, or cost), a grading-target item, a business-process derivation item, two judge-bias
    items (different biases), a trials-per-case item, and one multiple-response on eval
    suite defects.
11. **Distractor autopsy** — expect unvalidated LLM-judge answers; spot-checking offered as
    a regression strategy; accuracy checks offered where the gap is groundedness; a fix
    for the wrong judge bias (randomizing order when the pattern tracks length, or
    swapping judge family when scores drifted after a judge update); eval sets too small,
    or single-trial comparisons, for the claim being made; and success criteria taken from
    an easy-to-score proxy instead of the business outcome.
12. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Root-cause isolation from traces (P4.5) and production monitoring → session 33
- Guardrails and the injection surface → session 35
- Cost and latency telemetry and optimization (P4.6) → session 36
- Compliance evidence and audit → session 37
- Bias across demographic groups (P5.6) → session 38
- Model version migration (P4.7) → session 40
