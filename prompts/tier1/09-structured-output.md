# Structured Output and Schema Validation — F3 Prompt Engineering & Structured Output

**Exam weight: 20%**

## What this session assumes

Prompt Engineering (diagnosis).

## Why this domain is worth 20% of your score

The F3 domain description names **JSON schema validation** explicitly, and one of the six
scenario archetypes is structured data extraction from unstructured sources. The scored
judgment is the difference between *asking* for JSON and *guaranteeing* it — and what to
do about the residual failures either way. Extraction scenarios always come with a
downstream consumer that breaks on malformed data, which is what makes the guarantee
matter.

## Session focus

This session covers getting structured data out reliably. The whole session turns on one word: **guarantee**. Prompting for JSON improves the odds; schema enforcement constrains the generation — and knowing which is which is the scored distinction. The crux, and the most consequential idea in the domain, is the **missing-value problem**: when a required field isn't in the source, a model will often produce something plausible, so the schema and prompt must make absence representable and detectable. Spend real time there; silent invention is the signature failure of this domain's scenario archetype.

## Authoritative sources

Verify parameter names, supported models, and current limitations before teaching.

**Structured output**
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
- <https://code.claude.com/docs/en/agent-sdk/structured-outputs>

**Tool-based extraction**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use>

**Failure handling**
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

**Grounding extraction in sources**
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/pdf-support>
- <https://platform.claude.com/docs/en/build-with-claude/files>

## Teaching objectives

By the end, the learner can:

- Distinguish the three ways to get structured data and choose among them: **prompt-and-parse**
  (ask for JSON, validate yourself), **tool/function schema** (`tool_use` with a JSON
  schema), and **native structured outputs / strict schema enforcement** (strict mode)
- Use `tool_choice` deliberately — `"auto"`, `"any"`, or forcing one named tool — and say
  what each guarantees about whether a tool is called and which one
- State what each guarantees. Prompting improves the odds; schema enforcement constrains
  the generation. Knowing which of these is a *guarantee* is the scored distinction
- Design a schema the model fills reliably: flat over deeply nested, explicit enums over
  free strings, required vs. optional chosen deliberately, and field names that carry
  their own meaning
- Handle the **unextractable field** — the value genuinely isn't in the source. Design for
  an explicit null/unknown rather than letting the model invent one — **nullable fields**
  to prevent hallucination, and the `"other"` + detail-string pattern when the value exists
  but no enum case fits. This is the top cause of silent extraction errors
- Add **confidence or provenance** to extracted output, and use citations to make an
  extraction auditable against its source
- Design the **human review workflow** around that confidence, rather than reviewing
  everything or nothing:
  - Have the model emit **field-level** confidence, not one score per document — the
    document is rarely uniformly hard, and per-field scores are what let you route
  - **Calibrate** the review threshold against a **labeled validation set**. A raw model
    confidence is not a probability until you've checked it against known answers
  - Route the low-confidence and the internally contradictory to humans first, so limited
    reviewer capacity lands where it changes outcomes
- Explain why an **aggregate accuracy number can hide a broken segment**: 97% overall is
  consistent with one document type or one field failing badly. Before reducing human
  review, **segment accuracy by document type and by field** and check each
- Use **stratified random sampling** of the *high-confidence* extractions as an ongoing
  control — the population nobody is reviewing is exactly where a new error pattern will
  go unnoticed, and sampling it is what surfaces drift
- Design the **validation and retry layer**: validate against the schema (**Pydantic** is
  the reference implementation — distinguish its *syntactic* schema failures from
  *semantic* validation errors), and on failure decide between retry, retry-with-the-error,
  route to a stronger model, or escalate to a human — and set a retry ceiling
- Explain why the retry must feed the validation error back, not just re-ask
- State the limit of schema enforcement plainly: a strict schema eliminates **syntax**
  errors but not **semantic** ones. Line items that don't sum to the stated total, a date
  in the right format but the wrong field, a plausible invented vendor name — all pass
  validation. Guaranteed shape is not guaranteed meaning
- Build **self-checking into the schema** so semantic errors surface as data rather than
  requiring a reader to notice them: extract a computed value alongside the stated one
  (a calculated total next to the document's stated total) so a mismatch is visible, and
  add an explicit flag field for internally inconsistent sources instead of forcing the
  model to silently pick one reading
- Know when a retry **cannot** help: if the information simply isn't in the source
  document, no number of retries will produce it, and the correct design is an explicit
  null plus a route to human review. Retries fix format and structure problems, not
  absent facts
- Recognize when a schema is too complex for one call and should be split into passes
- Handle refusals and truncation as distinct failure modes from invalid schema

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Prompt-and-parse vs. schema enforcement | Does a downstream consumer break on malformed output? |
| Tool schema vs. native structured output | Is the model *acting*, or just *returning data*? |
| Optional field vs. explicit null | Do you need to distinguish "absent" from "not found"? |
| Retry vs. escalate | Is the failure transient/format, or a genuine ambiguity in the source? |
| One call vs. multi-pass extraction | Does the schema exceed what one pass fills reliably? |
| Add citations vs. add confidence | Must a human verify it, or must code route it? |
| Retry vs. explicit null | Is the information in the source at all? |
| Aggregate accuracy vs. per-segment | Could one document type be failing inside a good average? |
| Review everything vs. confidence routing | Is reviewer capacity the binding constraint? |

## How to run this session

1. **Frame** — the whole session hangs on one word: *guarantee*. Ask upfront what happens
   downstream when one document in ten thousand returns malformed JSON.
2. **Verify** the structured-output docs before teaching parameter names or model support.
3. **Teach the three approaches** and immediately separate them by guarantee. Ask which one
   they'd defend to a downstream team, and why.
4. **Teach schema design** by critique. Give a deeply nested schema with free-text fields
   where enums belong and ambiguous optionality, and have the learner redesign it. Then ask
   what their redesign made *harder*.
5. **Teach the missing-value problem** as the session's most important idea. Ask what a
   model does when a required field isn't in the source — the answer is that it will often
   produce something plausible. Then have them design the schema and prompt so absence is
   representable and detectable.
6. **Teach provenance and citations** — how an extraction becomes auditable.
7. **Teach the semantic-error limit.** Show an extraction that passes strict validation and
   is still wrong — line items that don't sum to the stated total. Ask what caught it; the
   answer is nothing, and that's the point. Then have them redesign the schema so it
   catches itself: a calculated total beside the stated one, a flag field for contradictory
   sources. This is the bridge to Tier 3's semantically-wrong-but-well-formed material.
8. **Teach the validation/retry layer.** Have the learner design it end to end: what's
   validated, what's retried, how many times, what happens after the ceiling, and what gets
   logged. Push on the retry prompt: does it include the validation error? Then ask which
   failures a retry *cannot* fix — the fact absent from the source — and what the design
   does instead.
9. **Teach confidence routing and its measurement.** Field-level scores, not per-document;
   calibrated against a labeled set, not taken at face value. Then the audit question: the
   pipeline reports 97% accuracy and the team wants to cut human review — what do you check
   first? Drive to per-document-type and per-field segmentation, and to stratified sampling
   of the high-confidence population nobody is reviewing. This is the F5 half of the
   extraction archetype.
10. **Teach failure-mode discrimination** — invalid schema vs. refusal vs. truncation are
    three different bugs with three different fixes.
11. **Decision table** — walk all nine rows.
12. **Scenario drill — 6 questions.** Use invoice extraction from mixed-quality scanned
    PDFs feeding an accounting system, with a stated accuracy requirement and a human
    review queue that must stay small. Ask about approach choice, missing-field handling,
    the retry ladder, provenance, and when to split passes. Add one item on reducing review
    volume safely, where the tempting answer is a global confidence threshold on a strong
    aggregate number. Include one multiple-response.
13. **Distractor autopsy** — expect "prompt it more firmly" chosen where enforcement is
    required, unbounded retries, retrying for a fact that isn't in the document, and an
    aggregate accuracy figure accepted without segmentation.
14. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Batch processing of extractions → Batch & Throughput
- Tool schema design in general → Tool Design
- Eval design for extraction accuracy → Tier 3 session 7
- RAG and document pipelines → Tier 3 session 3
