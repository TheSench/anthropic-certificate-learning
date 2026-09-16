# Explicit Criteria and Few-Shot Prompting — F3 Prompt Engineering & Structured Output

**Exam weight: 20%**

## What this session assumes

Session 1 (The Agentic Loop and `stop_reason`) only. The learner has written prompts and
has a working vocabulary for the agentic loop, but no systematic model of which prompt
interventions address which failure mode. No structured-output material is assumed — this
session is about the *text* of a prompt, not the shape of its output.

## Why this domain is worth 20% of your score

The F3 § 6 task statements name this session's two objectives directly: **4.1 "Design
prompts with explicit criteria to improve precision and reduce false positives"** and
**4.2 "Apply few-shot prompting to improve output consistency and quality"**. Between
them they are a third of the domain's task statements, and the exam does not test prompt
trivia or magic phrases — it hands you a prompt that is failing in a specific way and
asks which intervention addresses *that cause*. Wrong answers are real techniques applied
to the wrong failure mode, which is why the diagnosis matters more than the technique
list.

## Session focus

This session teaches the two interventions the F3 task statements name by hand: explicit
categorical criteria, and few-shot examples. The crux is that **"be conservative" is not
a criterion** — specific categorical rules define report-vs-skip, and 2–4 examples showing
*why* one action was chosen over a plausible alternative do what instructions alone
cannot. Spend disproportionate time on the pairing: criteria give the model a boundary it
can apply, and few-shot examples show it how that boundary behaves on the ambiguous cases
where the boundary is hardest to state in prose. Both halves get full weight — few-shot is
the technique the guide calls **the most effective** for its stated failure mode, and
session 9 (Escalation and Ambiguity Resolution) immediately depends on it. Keep the
diagnostic discipline throughout: the learner must never be allowed to answer "add
few-shot examples" to every failing prompt, because technique-shotgunning is the exact
bias the exam punishes — but that caution is about *misapplication*, not about teaching
few-shot shallowly.

## Authoritative sources

Fetch these to verify current behavior before teaching specifics.

**Core technique reference** — the granular per-technique pages (multishot, system
prompts, chain prompts) were consolidated into the best-practices page; its § "examples"
settles few-shot and its § "general principles" settles explicit criteria
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

**Model-specific guidance** — verify which applies to the model in the scenario
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5>

**Reliability under prompting** — settles the false-positive and hallucination material
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>

**System prompt design** — settles where criteria and examples live
- <https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts>

## Teaching objectives

By the end, the learner can:

**Explicit criteria (task 4.1)**

- Write **explicit success criteria** into a prompt — what "good output" means in terms
  checkable by someone who didn't write the prompt — and explain why vague quality words
  ("professional", "concise", "accurate") don't constrain behavior
- Replace a vague instruction with a **specific categorical rule**. The exam's own
  example: "flag a comment only when the behavior it claims contradicts the code's actual
  behavior" is a criterion; "check that comments are accurate" is not. The test is whether
  a reader could sort a pile of candidate findings into report and skip without asking the
  author a question
- Explain why calibration language **fails**: "be conservative" and "only report
  high-confidence findings" give the model *no new boundary to apply*. They express a mood,
  not a rule, so the model's own notion of what counts as high-confidence is unchanged and
  the false-positive rate moves little or not at all. This is the single most-tested
  distinction in 4.1 — the tempting wrong answer on every precision item
- Name the **trust cost** of false positives: in any review or flagging system, one noisy
  category trains users to dismiss the *accurate* categories too. The damage is not
  confined to the bad category — it is the whole system's credibility
- Apply the remedy the guide names: **temporarily disable the high-false-positive
  categories** to restore trust while their prompts are improved, rather than asking for
  more caution across the board. Disabling is a deliberate, reversible precision
  intervention, not an admission of defeat, and it is the answer the exam rewards
- Frame criteria as defining **report-vs-skip**, not as a confidence filter. A threshold on
  a self-reported confidence score is not a criterion — it moves the cut point on an
  uncalibrated number. Criteria change what the model *counts as a finding at all*
- Define **severity levels with a concrete code example at each level**, and say why an
  abstract severity ladder ("high = serious issues") produces inconsistent labels across
  runs while the same ladder anchored with one real snippet per level does not

**Few-shot prompting (task 4.2)**

- State the guide's own ranking: few-shot examples are **the most effective technique for
  achieving consistently formatted, actionable output when detailed instructions alone
  produce inconsistent results**. That failure mode — instructions are detailed, output is
  still inconsistent — is the trigger condition. Say it as a rule the learner can apply
  under time pressure
- Construct **2–4 targeted examples for ambiguous scenarios that show the reasoning** for
  why one action was chosen over a plausible alternative. The reasoning is the payload: an
  example that shows only input and output teaches the format; an example that shows why
  the *other* defensible choice was rejected teaches the boundary
- Choose which cases to exemplify: **the ambiguous ones**, not the easy middle. Two worked
  instances the exam uses — selecting the right tool for an ambiguous request, and
  identifying branch-level test coverage gaps where the obvious line-coverage reading is
  wrong — are both cases where a rule is hard to state but an example is easy to give
- Use examples to demonstrate the desired output **format** concretely: location, issue,
  severity, suggested fix. Format inconsistency across runs is a few-shot problem, and
  prose describing the format is a weaker lever than one instance of it
- Explain how a well-chosen example set enables **generalization to novel patterns** rather
  than matching only the pre-specified cases. This is the objective the exam scores and the
  one candidates get backwards: examples chosen as a *checklist of cases to catch* produce
  a model that catches those cases and nothing adjacent; examples chosen to *demonstrate
  the kind of reasoning* produce a model that recognizes the same reasoning applied to a
  pattern nobody listed. Hold both halves at once — examples generalize *and* they
  constrain, and an unrepresentative set narrows behavior harmfully
- Apply few-shot to **reduce hallucination in extraction tasks**: examples that show a
  field left empty or null when the source doesn't contain it teach the model that absence
  is an acceptable output, which is exactly the behavior a plausible invention replaces
- Cover **varied document structures** in the example set when sources are heterogeneous —
  inline citations vs. separate bibliographies, dedicated methodology sections vs. details
  embedded in prose. One example per structural variant is what stops the model applying
  the first variant's layout assumptions to all of them
- Include at least one example that demonstrates **empty or null handling for a required
  field**, so the model has seen the shape of "not present here" rather than inferring that
  every field must be filled

**Diagnosis — the skill that ties both halves together**

- Diagnose a failing prompt to a *cause* — ambiguous criteria, missing context, unstated
  edge-case handling, conflicting instructions, format inconsistency, or genuinely needing
  a stronger model — and pick the matching intervention
- Say which of the two techniques a given failure calls for: criteria when the model
  doesn't know where the boundary is, few-shot when it knows the boundary but can't apply
  it consistently to hard cases or can't produce a consistent shape
- Explain why "add more instructions" often makes a prompt worse (dilution, conflicting
  directives) and what to do instead
- State the boundary of prompting itself: prompting improves the *distribution* of outputs;
  it never *guarantees* one. Anything requiring a guarantee needs enforcement and
  validation — sessions 11 and 12

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Categorical criteria vs. "be conservative" | Does the model have a boundary, or just a mood? |
| Explicit criteria vs. few-shot examples | Is the gap in *knowing the target*, or in *applying it consistently*? |
| Few-shot vs. more detailed instructions | Are the instructions already detailed, with output still inconsistent? |
| Fix a noisy category vs. disable it meanwhile | Is it eroding trust in the accurate categories? |
| Criteria defining report-vs-skip vs. a confidence threshold | Are you changing what counts as a finding, or moving a cut point on an uncalibrated number? |
| Examples as a case checklist vs. examples showing reasoning | Must it generalize to patterns nobody listed? |
| 2–4 ambiguous examples vs. many easy ones | Where does the model actually fail — the middle, or the boundary? |
| Abstract severity ladder vs. one concrete example per level | Are labels consistent across runs? |
| More instruction vs. less | Are the current instructions conflicting or diluted? |
| Prompt fix vs. output validation | Must correctness be *guaranteed*, or improved on average? |

## How to run this session

1. **Frame** — this session owns two of F3's six task statements, and the exam tests
   diagnosis rather than technique recall. Say both plainly. Name the crux: "be
   conservative" is not a criterion.
2. **Teach explicit criteria** first. Give a weak prompt ("summarize this professionally")
   and have the learner rewrite the criteria until a stranger could grade the output.
   Iterate at least twice — the first attempt is almost always still vague.
3. **Teach precision tuning against the code-review case.** Give a flagging prompt with a
   vague criterion ("check that comments are accurate") producing findings developers
   dismiss. Ask for the fix. If the learner reaches for "tell it to be conservative" or a
   confidence threshold, *let them*, then ask what boundary that actually gives the model.
   The answer is none, and that realization is the lesson. Land the replacement: a
   categorical rule naming what qualifies and what doesn't ("flag only when the claimed
   behavior contradicts the code's actual behavior").
4. **Add the trust argument and the disable move.** A noisy category discredits the
   accurate ones. Then ask what to do *today*, before the prompt is fixed — drive to
   temporarily disabling the high-false-positive categories. Most learners resist this as
   giving up; make the point that trust is the asset being protected.
5. **Teach the severity ladder** with a concrete code example at each level, and have the
   learner predict what an abstract ladder does across three runs.
6. **Teach few-shot properly — give this equal weight to steps 2–5.** Open with the
   guide's ranking: the most effective technique for consistently formatted, actionable
   output when detailed instructions alone produce inconsistent results. Then build a set
   live. Have the learner pick 3 examples for an ambiguous tool-selection task, then ask
   what behavior their choice *excludes*.
7. **Teach reasoning-bearing examples.** Take one of their examples and rewrite it to show
   why the chosen action beat a plausible alternative. Ask what the rewritten version
   teaches that the original didn't. Then the generalization question: which version
   handles a pattern nobody put in the set? Land that examples both **generalize** and
   **constrain**, and that which one dominates depends on whether the examples demonstrate
   reasoning or enumerate cases.
8. **Teach format demonstration and extraction hardening.** Show an example carrying
   location, issue, severity, and suggested fix. Then switch domains to extraction: have
   the learner design an example set over varied document structures (inline citations vs.
   bibliographies, methodology sections vs. embedded details) and ask what happens to a
   required field that isn't in the source. Drive to an example that shows the field left
   empty — this is the anti-hallucination move, and session 11 will build the schema that
   makes it representable.
9. **Teach diagnosis as the integrating skill.** Present four failing prompts, each broken
   a different way: one vague criterion, one detailed-but-inconsistent-format, one
   conflicting-instructions, one genuinely needing a stronger model. For each: the cause,
   and the minimal fix. **Do not let the learner answer "add few-shot examples" to all
   four** — that is the exact bias the exam punishes. Having just taught few-shot at
   depth, the temptation will be high, which is what makes this exercise land.
10. **Teach the prompt-vs-validation boundary.** Prompting improves the distribution; it
    never guarantees. Anything requiring a guarantee needs enforcement — session 11.
11. **Decision table** — walk all ten rows. For each, give a scenario and have them apply
    it before you give the answer.
12. **Scenario drill — 6 questions.** Use two scenarios so both task statements are
    drilled at weight. (a) An automated code-review bot whose "comment accuracy" category
    over-flags, where the tempting answers are a confidence threshold and a "be strict"
    instruction, and where one item must ask what to do *while* the prompt is being fixed.
    (b) A support-ticket classifier at 92% accuracy against a 98% requirement, with errors
    clustered in ambiguous multi-issue tickets and inconsistent output formatting — ask for
    the diagnosis, how many examples and which ones, and what the examples must *show*.
    Include one multiple-response.
13. **Distractor autopsy** on all six. Expect: calibration language chosen over categorical
    criteria; technique-shotgunning; a confidence threshold offered as a precision fix;
    "add more examples" where the existing examples are the problem; reaching for a
    stronger model before the prompt states the task unambiguously.
14. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

Defer and say where it's covered:
- Escalation criteria and ambiguity resolution, which build directly on this session's
  few-shot material → session 9 (Escalation and Ambiguity Resolution)
- `tool_use`, JSON schemas, and schema enforcement → session 11 (Structured Output via
  Tool Use and JSON Schemas)
- Validation, retry loops, and confidence calibration → session 12 (Validation, Retry, and
  Confidence Calibration)
- Multi-pass and multi-instance review architecture → session 13 (Multi-Pass Review and
  Batch Processing)
- Batch processing → session 13
- Prompt caching mechanics — permitted depth is *that it exists* → session 6
- What belongs in a system prompt vs. a per-request message → session 6
- Tool descriptions as prompts → session 14 (Designing Tool Interfaces)
- Eval design to measure prompt changes → Tier 3 session 7
- Prompt portfolios across models → Tier 3 session 15
