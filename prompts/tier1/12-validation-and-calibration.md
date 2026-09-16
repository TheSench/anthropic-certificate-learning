# Validation, Retry, and Confidence Calibration — F3 Prompt Engineering & Structured Output

**Exam weight: 20% (F3) and 15% (F5)**

## What this session assumes

Session 11 (Structured Output via Tool Use and JSON Schemas), and through it sessions 1 and
8. The learner can already enforce a schema with `tool_use`, knows that a strict schema
eliminates syntax errors but not semantic ones, and has seen nullable fields and the
`"unclear"` enum value make absence and ambiguity representable. Session 11 deliberately
stopped at the point where a wrong-but-well-formed extraction goes uncaught. This session
picks it up there.

## Why this domain is worth 20% of your score

This session owns one task statement from each of two domains: F3's **4.4 — "Implement
validation, retry, and feedback loops for extraction quality"** — and F5 Context Management
& Reliability's **5.5 — "Design human review workflows and confidence calibration"**. That
pairing is deliberate and you should say so out loud in the session: the extraction result
and the decision of whether to trust it are one lesson, not two. A validation layer with no
calibrated confidence routes everything to humans or nothing; a confidence score with no
validation layer is a number nobody checked. Coverage is scored per task statement, so 5.5
credits F5 regardless of this session's F3 label — the learner should know that this
session is carrying weight in two domains.

## Session focus

This session builds the layer that sits after enforcement: validate, retry with the error
fed back, and then decide what a human looks at. The crux has two halves and both are
tested. First, **retry fixes format and structural errors but cannot conjure information
absent from the source** — retrying for a fact the document does not contain burns tokens
and eventually produces an invention. Second, **an aggregate accuracy of 97% masks the
document type or the field where it is failing** — the number that looks like permission to
cut human review is the number most likely to be hiding the reason you can't. Spend
disproportionate time on those two, and on the concrete field names the exam uses
verbatim: `detected_pattern`, `calculated_total`, `stated_total`, `conflict_detected`.
Those field names are the scored vocabulary of this session; write them on the board.

## Authoritative sources

Verify parameter names and current behavior before teaching specifics.

**Validation and consistency**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use>

**Failure modes that are not validation failures**
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>

**Provenance and auditability**
- <https://platform.claude.com/docs/en/build-with-claude/citations>

**Evaluation and measurement**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/test-and-evaluate/eval-tool>

## Teaching objectives

By the end, the learner can:

**Validation and retry (task 4.4)**

- Design the **validation layer** end to end: what is validated, in what order, and what
  each check can catch. Separate **schema/syntax validation** (does it parse, are the types
  right, are required fields present — **Pydantic** is the reference implementation) from
  **semantic validation** (do the line items sum, is the date range coherent, does the
  total match the arithmetic). The first is a shape check; the second is a meaning check,
  and only the second catches what session 11 showed passing strict enforcement
- Implement **retry with error feedback**: on failure, the follow-up request appends the
  **specific validation errors** — not a generic "that was invalid, try again". Naming the
  field and the constraint that failed is what turns a retry into a correction
- Include **all three** elements in the follow-up request: the **original document**, the
  **failed extraction**, and the **specific validation errors**. Dropping any one of the
  three is a distinct wrong answer on this item. Without the document the model cannot
  re-read the source; without the failed extraction it cannot see what it did; without the
  errors it does not know what was wrong. The tempting incomplete answer is to send only
  the error back, which fixes nothing the model cannot re-derive
- State **the limits of retry** as a categorical rule, because this is the crux: retry is
  effective for **format and structural errors** — a malformed value, a missing field the
  source does contain, a constraint the model can satisfy on a second pass. Retry is
  **ineffective when the required information is simply absent from the source document**.
  No number of retries produces a fact that isn't there; what additional attempts produce
  is an increasingly plausible invention. The correct design for that case is an explicit
  null plus a route to human review — which is the bridge into 5.5
- Set a **retry ceiling** and decide what happens after it: escalate to a stronger model,
  or route to a human, and log which
- Build **self-checking into the schema** so semantic errors surface as data rather than
  requiring a reader to notice them. Use the exam's own field names:
  - **`calculated_total`** extracted alongside **`stated_total`**, so a mismatch between
    the document's own claimed total and the sum of its line items is a comparison in code
    rather than a judgment call
  - **`conflict_detected`**, a boolean the model sets when the source contradicts itself,
    instead of forcing the model to silently pick one reading of a document that says two
    things
- Add a **`detected_pattern`** field to findings-style output — tracking **which code
  constructs trigger findings, to enable systematic analysis of dismissal patterns**. This
  is the field that turns a review pipeline into a measurable one: when developers dismiss
  findings, `detected_pattern` tells you *which construct* the dismissals cluster on, so you
  can fix that category's criteria (session 8) or temporarily disable it rather than
  guessing at the prompt. Without it you have a dismissal rate and no way to act on it
- Distinguish **validation failures from refusals and truncation** — three different bugs,
  three different fixes, and retry is the right response to only one of them

**Confidence calibration and human review (task 5.5)**

- Explain why an **aggregate accuracy number hides a broken segment**: 97% overall is fully
  consistent with one document type or one field failing badly while everything else is near
  perfect. The aggregate is a weighted average, and a small segment can be catastrophic
  inside a good one
- **Validate accuracy by document type and by field segment before automating.** This is the
  action the exam scores: a team proposing to reduce human review on the strength of a
  strong aggregate must first segment. Name both axes — document type *and* field — because
  candidates reliably name one and stop
- Have the model emit **field-level confidence**, not one score per document. A document is
  rarely uniformly hard; a per-document score averages an easy header with an illegible
  line-item table and routes on neither. Per-field scores are what make routing possible
- **Calibrate field-level confidence using labeled validation sets.** A raw model
  confidence is not a probability until it has been checked against known answers. "The
  model said 0.9" and "documents where the model says 0.9 are right 90% of the time" are
  different claims, and only the second supports a threshold. Calibration is measurement
  against labels, not a prompt instruction
- Design the **human review workflow** around calibrated confidence rather than reviewing
  everything or nothing: route the **low-confidence** extractions and the ones from
  **ambiguous or internally contradictory source documents** to human review first —
  `conflict_detected` and an `"unclear"` enum value are exactly the machine-readable
  signals that populate that queue — so that **limited reviewer capacity** lands where it
  changes outcomes
- Use **stratified random sampling** of the **high-confidence** extractions as an ongoing
  control, and name **both** of its purposes:
  1. **Ongoing error-rate measurement** — the population nobody is reviewing is the only
     part of the pipeline with no observed error rate, and sampling it is what gives you one
  2. **Novel error pattern detection** — a new failure mode (a changed source template, a
     new vendor's layout) shows up first as high-confidence wrong answers, precisely because
     the model has no signal that anything changed. Sampling the confident population is how
     you find a pattern you didn't know to look for
  Stratification matters because a simple random sample over a skewed population
  under-samples the rare document types where new patterns appear; stratify by document type
  so each stratum is represented
- Decide what the review queue produces beyond corrections: reviewed items are labeled data,
  which feeds the next calibration round. The loop closes

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Retry vs. explicit null + human review | Is the information in the source at all? |
| Retry vs. escalate to a stronger model | Is the failure format/structural, or genuine ambiguity in the source? |
| Generic retry vs. retry with specific validation errors | Can the model tell what was wrong without being told? |
| Error alone vs. document + failed extraction + errors | Can the model re-derive the source and its own output? |
| Schema validation vs. semantic validation | Is the risk malformed output, or well-formed nonsense? |
| `stated_total` alone vs. `calculated_total` alongside it | Does a mismatch have to be *noticed*, or can it be *computed*? |
| Silently picking a reading vs. `conflict_detected` | Does the source contradict itself? |
| Dismissal rate vs. `detected_pattern` | Do you need to know *which construct* the dismissals cluster on? |
| Aggregate accuracy vs. per-segment accuracy | Could one document type or field be failing inside a good average? |
| Per-document confidence vs. field-level confidence | Is the document uniformly hard? |
| Raw model confidence vs. calibrated against a labeled set | Is that number a probability, or a self-report? |
| Review everything vs. confidence routing | Is reviewer capacity the binding constraint? |
| Reviewing only low-confidence vs. also sampling high-confidence | Who is watching the population nobody reviews? |
| Simple random sampling vs. stratified random sampling | Are the rare document types represented? |

## How to run this session

1. **Frame** — say explicitly that this session owns a task from two domains, and why:
   the extraction result and the decision of whether to trust it are one lesson. Then pick
   up session 11's unfinished argument — the extraction that passed strict validation and
   was still wrong.
2. **Teach the two validation layers.** Have the learner sort a list of eight failures into
   schema/syntax versus semantic. Include a value in the wrong field and line items that
   don't sum, and make them say which layer catches each.
3. **Teach retry with error feedback.** Have the learner write the retry request. Most will
   send back the error alone. Push until all three parts are there — original document,
   failed extraction, specific validation errors — and have them say what each one buys.
4. **Teach the limit of retry.** Give a failure where the required field is genuinely not on
   the page (a scanned invoice with the PO number torn off). Ask how many retries. Drive to
   zero, and to the explicit null plus human review. Then have them state the rule in
   general form: retry fixes format and structure, never absence. This is the first half of
   the crux — make them say it back.
5. **Teach self-checking fields by name.** Have them redesign the invoice schema so it
   catches itself: `calculated_total` beside `stated_total`, and `conflict_detected` for a
   source that states two different figures. Insist on the literal field names — the exam
   uses them.
6. **Teach `detected_pattern`.** Switch to the code-review pipeline from session 8. Tell
   them developers dismiss 40% of findings and the team wants to fix it. Ask what data they
   need. Most will propose a dismissal rate; push until they reach per-construct tracking,
   then give them the field name and the phrase: tracking which code constructs trigger
   findings to enable systematic analysis of dismissal patterns. Close the loop to session
   8 — this is what tells you *which* category to fix criteria for or temporarily disable.
7. **Teach failure-mode discrimination** — validation failure vs. refusal vs. truncation.
   Retry is right for one of the three.
8. **Pivot to 5.5 with the audit question.** The pipeline reports 97% accuracy and the team
   wants to cut human review. What do you check first? Let them answer, then drive to
   segmentation by **document type and by field**. This is the second half of the crux.
   Make the arithmetic concrete: 97% overall with one document type at 60% is unremarkable
   if that type is 5% of volume — and catastrophic if that type is the contracts.
9. **Teach field-level confidence and calibration.** Ask why a per-document score is the
   wrong granularity. Then the harder question: the model says 0.9 — what does that mean?
   Drive to the labeled validation set, and to the difference between a self-report and a
   calibrated probability.
10. **Teach the review queue.** Have them design routing with limited reviewer capacity as
    the binding constraint: low-confidence first, plus the ambiguous and internally
    contradictory — and have them name the machine-readable signals that populate it
    (`conflict_detected`, `"unclear"`, field-level confidence below the calibrated
    threshold).
11. **Teach stratified random sampling with both purposes.** Ask what is wrong with
    reviewing only the low-confidence queue. Drive to: nobody is watching the confident
    population, and that is exactly where a *novel* error pattern will hide, because a new
    source template produces confident wrong answers. Land both purposes explicitly —
    ongoing error-rate measurement *and* novel error pattern detection — and why the sample
    must be stratified.
12. **Decision table** — walk all fourteen rows.
13. **Scenario drill — 6 questions.** Keep the invoice-and-contract extraction pipeline from
    session 11, now in production with a human review queue that must shrink. Ask: what goes
    in the retry request; how many retries for a field that isn't on the page; how to make a
    line-item mismatch machine-detectable; what to check before cutting review on a 97%
    aggregate; what to do with the high-confidence population; and one item on the
    code-review pipeline where the answer is `detected_pattern`. Include one
    multiple-response.
14. **Distractor autopsy** — expect: unbounded retries; retrying for a fact that isn't in
    the document; a retry request carrying only the error; an aggregate accuracy figure
    accepted without segmentation; a global confidence threshold applied to an uncalibrated
    score; per-document confidence chosen over field-level; and sampling only the
    low-confidence queue.
15. Record per `.agents/TUTORIAL.md` Step 5. Glossary `detected_pattern`,
    `calculated_total`, `stated_total`, `conflict_detected`, and "stratified random
    sampling" verbatim.

## Out of scope

Defer and say where it's covered:
- Schema enforcement mechanics, `tool_use`, `tool_choice`, nullable fields and the
  `"unclear"` enum — the prerequisite, already taught → session 11
- Criteria design and few-shot examples for the categories `detected_pattern` tracks →
  session 8 (Explicit Criteria and Few-Shot Prompting)
- Multi-instance and multi-pass review architecture, and batch processing of extractions →
  session 13 (Multi-Pass Review and Batch Processing)
- Escalation patterns and ambiguity resolution at the agent level → session 9 (Escalation
  and Ambiguity Resolution)
- Provenance across multiple sources → session 7 (Reliability Across Agents)
- Eval design and formal test-set construction → Tier 3 session 7
- Semantically-wrong-but-well-formed output as its own failure family, at depth → Tier 3
  session 6
