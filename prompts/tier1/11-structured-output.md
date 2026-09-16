# Structured Output via Tool Use and JSON Schemas — F3 Prompt Engineering & Structured Output

**Exam weight: 20%**

## What this session assumes

Sessions 1 (The Agentic Loop and `stop_reason`) and 8 (Explicit Criteria and Few-Shot
Prompting). From session 1 the learner knows that `stop_reason == "tool_use"` is how a
model signals it has produced a structured tool call. From session 8 they know that
prompting improves the *distribution* of outputs but never guarantees one — this session
is the guarantee. They also arrive knowing how a few-shot example teaches a model to leave
a field empty rather than invent a value; here they build the schema that makes that
absence representable.

## Why this domain is worth 20% of your score

F3 task statement **4.3 — "Enforce structured output using tool use and JSON schemas"** —
names the mechanism in its own title, and one of the six scenario archetypes is structured
data extraction from unstructured sources. The scored judgment is the difference between
*asking* for JSON and *guaranteeing* it, and then the harder judgment on top: what a
guarantee does and does not buy you. Extraction scenarios always come with a downstream
consumer that breaks on malformed data, which is what makes the guarantee matter — and
always come with a source document that doesn't contain everything the schema asks for,
which is what makes the guarantee insufficient.

## Session focus

This session teaches enforcement: `tool_use` with JSON schemas as the mechanism, and
schema design as the craft. The crux is the double-edged conclusion — **a strict schema
eliminates *syntax* errors but not *semantic* ones**: the line items still fail to sum to
the stated total, the date still lands in the wrong field, the vendor name is still
plausibly invented — **and nullable fields plus an `"unclear"` enum value are what stop
the model fabricating**. Spend disproportionate time there. Candidates who learn only that
strict schemas guarantee valid JSON walk into every semantic-error item and every
missing-field item and pick the wrong answer. Teach the ranking explicitly too: among the
approaches, `tool_use` with JSON schemas is **the most reliable** for guaranteed
schema-compliant output — the exam ranks it, so do not present the three approaches as
equals. Validation, retry, and calibration are session 12's; stop at the point where you
have the enforced shape and can name what it doesn't cover.

## Authoritative sources

Verify parameter names, supported models, and current limitations before teaching.

**Tool-based structured output** — settles `tool_use`, `tool_choice`, strict mode
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>

**Native structured outputs**
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
- <https://code.claude.com/docs/en/agent-sdk/structured-outputs>

**Failure handling**
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>

**Grounding extraction in sources**
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/pdf-support>

## Teaching objectives

By the end, the learner can:

**The mechanism and its ranking**

- Distinguish the three ways to get structured data: **prompt-and-parse** (ask for JSON,
  validate it yourself), **`tool_use` with a JSON schema** (the model's output is
  constrained to the tool's input schema), and **native structured outputs / strict schema
  enforcement** (strict mode)
- State the ranking, not just the list: **`tool_use` with JSON schemas is the most reliable
  approach** for producing guaranteed schema-compliant output. Prompt-and-parse improves
  the odds and nothing more. Present this as the default answer for an extraction scenario
  with a downstream consumer, and make the learner say *why* — the schema constrains
  generation rather than describing a target
- Use **`tool_choice`** deliberately and state exactly what each setting guarantees:
  - **`"auto"`** — the model *may* call a tool or *may* return plain text instead. This is
    the setting that does not guarantee structured output, and the reason it is the wrong
    answer whenever a downstream consumer must not receive prose
  - **`"any"`** — the model **must** call a tool, but chooses *which* one. Use it to
    guarantee structured output when **multiple extraction schemas exist and the document
    type is unknown**: give the model one tool per document type and let it select, and you
    get both a guaranteed structured result and a classification for free
  - **forced `{"type": "tool", "name": "..."}`** — the model must call *that specific*
    tool. Use it when one particular extraction must run and no other: forcing
    `{"type": "tool", "name": "extract_metadata"}` **ensures that extraction runs before
    enrichment steps**, with the subsequent steps processed in follow-up turns rather than
    left to the model's own sequencing
- Sequence a multi-step extraction with forcing: force the first tool, take its result,
  then issue the follow-up turns for enrichment — rather than defining one giant tool and
  hoping the ordering holds

**Schema design**

- Design a schema the model fills reliably: flat over deeply nested, explicit **enums**
  over free strings, **required vs. optional** chosen deliberately rather than marking
  everything required, and field names that carry their own meaning
- Choose required vs. optional on the question "does the consumer need to distinguish
  absent from empty?" — and understand that marking a field required is a *pressure* on the
  model to produce something for it
- Use **nullable** fields to prevent the model fabricating values to satisfy required
  fields. This is the mechanical counterpart to session 8's few-shot lesson: the example
  teaches that empty is acceptable, the nullable field makes empty *expressible*. Without
  it, a required non-nullable string is an instruction to invent
- Use the **enum plus `"other"` and a detail string** pattern, and give the *extensibility*
  rationale rather than treating it as a mere fallback: a closed enum breaks the first time
  reality produces a category you didn't anticipate, and `"other"` with a free-text detail
  captures the unanticipated case as data you can mine to extend the enum later. It turns
  schema evolution into an observation problem instead of a production incident
- Add the enum value **`"unclear"`** for genuinely ambiguous cases — distinct from
  `"other"`. `"other"` means "a real category that isn't in your list"; `"unclear"` means
  "the source does not settle which category this is". Collapsing the two destroys the
  signal that should route a document to review, and forcing a model to pick between
  concrete categories when the source is ambiguous is how confident-sounding wrong values
  enter the pipeline
- Write **format normalization rules in the prompt alongside the strict output schema** to
  handle inconsistent source formatting. The schema constrains the *shape*; it says nothing
  about which of several valid renderings of a date, currency, or name the model should
  emit. State the normalization rules in prose ("dates as ISO 8601; strip currency symbols
  and emit a decimal") and enforce the shape in the schema — the two are complements, and
  reaching for only one is the tell on this item
- Use **Pydantic** as the reference implementation of the schema on the consuming side, and
  keep straight which failures it catches — syntactic schema violations — versus the
  semantic ones it does not. (The full validation-and-retry design is session 12.)

**The limit of enforcement — the crux**

- State plainly: **a strict schema eliminates syntax errors but not semantic ones.** Line
  items that don't sum to the stated total, a correctly-formatted date placed in the wrong
  field, a plausible invented vendor name — all of these pass strict validation. Guaranteed
  shape is not guaranteed meaning
- Recognize the value-in-the-wrong-field failure specifically, because it is the one that
  survives every shape check and every type check: two string fields, both populated, both
  valid, swapped
- Recognize when a schema is too complex for one call and should be split into passes, and
  name the tell: fields deep in a large schema get filled less reliably than fields at the
  top
- Add **confidence or provenance** to extracted output, and use citations to make an
  extraction auditable against its source. (How to calibrate and route on that confidence
  is session 12.)
- Handle refusals and truncation as failure modes distinct from an invalid schema — three
  different bugs with three different fixes

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Prompt-and-parse vs. `tool_use` with a schema | Does a downstream consumer break on malformed output? |
| `tool_choice: "auto"` vs. `"any"` | Is plain text an acceptable response at all? |
| `tool_choice: "any"` vs. forced named tool | Is the document type unknown, or is the extraction fixed? |
| Forced tool vs. one large tool | Must a specific extraction run *before* the enrichment steps? |
| Required non-nullable vs. nullable | Would a required field pressure the model into inventing a value? |
| Enum `"other"` + detail vs. free string | Do you need to observe the unanticipated categories to extend the enum? |
| Enum `"other"` vs. `"unclear"` | Is the category real but unlisted, or is the source ambiguous? |
| Schema alone vs. schema + normalization rules in the prompt | Is the source formatting inconsistent across documents? |
| Flat schema vs. deep nesting | Which fields are being filled unreliably? |
| One call vs. multi-pass extraction | Does the schema exceed what one pass fills reliably? |
| Add citations vs. add confidence | Must a *human* verify it, or must *code* route it? |
| Strict schema vs. a semantic check | Is the risk malformed output, or well-formed nonsense? |

## How to run this session

1. **Frame** — the session hangs on one word: *guarantee*. Ask upfront what happens
   downstream when one document in ten thousand returns malformed JSON. Then name the twist
   the session ends on: the guarantee is real and it is not enough.
2. **Verify** the structured-output and strict-tool-use docs before teaching any parameter
   name or model-support claim.
3. **Teach the three approaches, then rank them.** Do not present them as equals — state
   that `tool_use` with JSON schemas is the most reliable route to guaranteed
   schema-compliant output, and have the learner defend that choice to a downstream team.
4. **Teach `tool_choice` as three distinct guarantees.** Walk `"auto"`, `"any"`, and the
   forced form. Then give three scenarios and have them pick before you answer: (a) a
   pipeline that must never receive prose — rules out `"auto"`; (b) mixed incoming
   documents of unknown type with one extraction schema per type — `"any"`; (c) metadata
   that must be extracted before enrichment can run — forced
   `{"type": "tool", "name": "extract_metadata"}`, with enrichment in follow-up turns. Make
   them say the literal parameter values; the exam uses them verbatim.
5. **Teach schema design by critique.** Give a deeply nested schema with free-text fields
   where enums belong, everything marked required, and no nullable anywhere. Have the
   learner redesign it. Then ask what their redesign made *harder* — there is always a
   trade.
6. **Teach the missing-value problem as the session's most important design idea.** Ask
   what a model does when a required field isn't in the source. The answer is that it will
   often produce something plausible. Then have them make absence representable: nullable
   fields, and — connecting back to session 8 — a few-shot example showing the field left
   empty. Land that these two are one intervention in two places.
7. **Teach the enum trio: closed enum, `"other"` + detail, `"unclear"`.** Give a document
   the enum doesn't cover and one the source leaves ambiguous, and have them route each to
   the right value. Push on why collapsing them into a single catch-all is a loss: the
   ambiguous one is a review-routing signal, the unlisted one is a schema-evolution signal,
   and they need different follow-up.
8. **Teach normalization rules alongside the schema.** Show three source documents with the
   same date rendered three ways, all of which satisfy a `string` field. Ask what the schema
   did about it — nothing — and have them write the prose rules that go next to it.
9. **Teach the semantic-error limit — the crux.** Show an extraction that passes strict
   validation and is still wrong: line items that don't sum to the stated total, and a value
   in the wrong field. Ask what caught it. The answer is nothing, and that is the point.
   Stop there deliberately: session 12 builds the self-checking schema and the validation
   layer that catch these. Say so, so the learner knows the argument is unfinished by
   design.
10. **Teach failure-mode discrimination** — invalid schema vs. refusal vs. truncation.
11. **Decision table** — walk all twelve rows.
12. **Scenario drill — 5 questions.** Use invoice and contract extraction from
    mixed-quality scanned PDFs feeding an accounting system, with documents arriving in
    several types and a downstream consumer that hard-fails on malformed data. Ask: which
    approach and why; which `tool_choice` setting for the unknown-document-type case; how to
    guarantee metadata extraction precedes enrichment; how to stop the model inventing a
    vendor name for an illegible field; and one item where the extraction passes strict
    validation and is still wrong. Include one multiple-response.
13. **Distractor autopsy** — expect "prompt it more firmly" chosen where enforcement is
    required; `"auto"` chosen because it sounds flexible; `"any"` and the forced form
    confused with each other; everything marked required as a supposed reliability measure;
    and a strict schema offered as the fix for a semantic error.
14. Record per `.agents/TUTORIAL.md` Step 5. Glossary the `tool_choice` values verbatim.

## Out of scope

Defer and say where it's covered:
- Validation layers, Pydantic retry loops, retry-with-error-feedback, `calculated_total`
  and `conflict_detected` self-checking fields → session 12 (Validation, Retry, and
  Confidence Calibration)
- Confidence calibration, labeled validation sets, stratified random sampling, human review
  routing → session 12
- Batch processing of extractions and multi-pass review architecture → session 13
  (Multi-Pass Review and Batch Processing)
- Tool interface and description design in general — here a tool is a *schema*, not an
  action → session 14 (Designing Tool Interfaces)
- Structured tool *errors* and the `isError` flag → session 16 (Tool Errors and Tool
  Distribution)
- Eval design for extraction accuracy → Tier 3 session 7
- RAG and document pipelines → Tier 3 session 3
