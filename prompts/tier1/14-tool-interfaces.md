# Designing Tool Interfaces — F4 Tool Design & MCP Integration

**Exam weight: 18%**

## What this session assumes

Sessions 1 (the agentic loop and `stop_reason`) and 8 (explicit criteria and few-shot
prompting). Session 1 established tool *use* — `stop_reason` returning `"tool_use"`,
results appended to history, `allowedTools` restricting what an agent may call. Session 8
established that precision in a prompt comes from explicit criteria and boundaries rather
than from asking more nicely. This is the first session in which the learner *authors* a
tool interface, and it is the first of the three F4 sessions. It owns § 6 task
**2.1 — "Design effective tool interfaces with clear descriptions and boundaries."**

## Why this domain is worth 18% of your score

The F4 domain description names **building tool descriptions** first, and "debugging tool
selection issues" is a named exam skill. The scored insight is that a tool description is
the *only* information the model has when it chooses — it is a prompt, read at selection
time — so most tool-selection bugs are description bugs, fixed in the tool definition.
Task 2.1 is where that lands, and it is also where the exam sets its sharpest trap: it
punishes "improve the system prompt" as a reflex answer while *also* testing one specific
case where the system prompt genuinely is the cause. A learner who has only learned the
reflex-suppression will eliminate the right answer. Teach both halves.

## Session focus

This session is about authoring the interface the model reads when it decides which tool to
call. Pitch it deliberately as arriving *late*: sessions 1–13 needed only tool use, and the
learner has already watched tool selection go wrong from the outside — misrouting in
orchestration, context bloat from oversized tool surfaces, failures that had to be
propagated — so authorship arrives as a specialised fix for problems they have already felt,
not as an abstract modelling exercise. Say that out loud in the framing. The crux is that
**the description IS the selection mechanism — and system prompt wording is keyword-sensitive
enough to create tool associations you never intended.** Spend disproportionate time on the
two-sided version of that: first, that a minimal description ("Analyzes content") makes
selection among similar tools unreliable and that the fix is *expansion* — input formats,
example queries, edge cases, boundaries; second, on the one system-prompt case that is real,
where a keyword in the system prompt pulls selection toward the wrong tool no matter how good
the description is. Session 8's vocabulary carries directly here — a description with
explicit criteria and worked examples is a better prompt for the same reason a classification
prompt with explicit criteria is — so build on it rather than re-deriving it. Treat parameter
design and granularity as the session's second half, and land the two structural remedies
the guide names one-directionally: **renaming** a tool to remove functional overlap, and
**splitting** a generic tool into purpose-specific ones.

## Authoritative sources

Verify the current tool-definition shape and built-in surface from live docs before quoting
field names.

**Tool definition and mechanics**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference>

**Selection failures and diagnosis**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use>

**Scaling the tool surface**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use>

**Custom tools in the SDK**
- <https://code.claude.com/docs/en/agent-sdk/custom-tools>

## Teaching objectives

By the end, the learner can:

- State the mechanism plainly: **tool descriptions are the primary mechanism the model uses
  to select a tool.** Not the tool name alone, not the schema alone, not the system prompt —
  the description is what is read at decision time. Name the direct consequence: **minimal
  descriptions lead to unreliable selection among similar tools**, and the more similar the
  tools, the more the shortfall shows
- Write a description that carries the four things the guide names as the expansion fix —
  **the input formats it handles, example queries it serves, edge cases, and an explicit
  boundary explanation** (when to use it *versus similar alternatives*, and when not to use
  it at all). Make them write all four; a description that only says what the tool does is
  the failing case, not the baseline
- Diagnose **misrouting** from ambiguous or overlapping descriptions. Use the guide's own
  example: `analyze_content` and `analyze_document` with near-identical descriptions, where
  the agent sends web search results to the document analyzer and PDFs to the content
  analyzer because nothing in either description distinguishes them. The learner must be able
  to say *why* the model has no basis to choose, not merely that it chose wrong
- Differentiate two overlapping tools against each other on four axes — **purpose, expected
  inputs, outputs, and when to use it versus the similar alternative.** This mutual
  disambiguation is the session's core authoring skill: rewriting one description in
  isolation does not fix an overlap
- Apply **renaming** as a first-class remedy when the overlap is functional rather than
  verbal. The guide's example: rename `analyze_content` to **`extract_web_results`**, so the
  name itself carries the boundary and no longer competes with `analyze_document`. State the
  tell — if two names are both plausible readings of the same request, description surgery
  alone leaves the ambiguity in the most-read field
- Apply **splitting** a generic tool into purpose-specific tools with defined input/output
  contracts. The guide's example: split `analyze_document` into **`extract_data_points`**,
  **`summarize_content`**, and **`verify_claim_against_source`**. Note the direction — the
  guide's remedy runs one way, from generic to specific; a tool whose description must
  enumerate three unrelated jobs is three tools
- Handle the **system prompt's role in selection** correctly, in both directions:
  - **The reflex that loses points:** "write a better system prompt" offered as a universal
    fix for a tool-selection bug. When the description is thin or two descriptions overlap,
    the fix is in the tool definition. A vague system-prompt instruction ("be more careful
    choosing tools", "think about which tool fits") is the trap — it does not give the model
    any new basis for choosing
  - **The case that is real and tested:** **system prompt wording is keyword-sensitive, and
    a keyword in it can create a tool association you never intended.** A system prompt that
    says "always begin by *searching the documentation*" will pull selection toward
    `docs_search` for questions a metrics tool should answer, because the instruction's
    keyword matches that tool's description — and it will keep doing so even after the
    metrics tool's description is rewritten well. **Reviewing the system prompt for
    keyword-sensitive instructions that override well-written tool descriptions is a named
    remediation step**, not a fallback
  - **The tell that separates them:** is the proposed system-prompt change *vague* (be more
    careful, choose wisely) or does it *name a specific keyword or instruction currently
    pulling selection toward the wrong tool*? Vague is the distractor; specific keyword
    interference is a real diagnosis. Equivalently: if the descriptions are already
    differentiated and selection is *still* consistently wrong in one direction, look up at
    the system prompt
- Choose **granularity** deliberately — and know that the guide's remedy is directional.
  Broad tools push the judgment into parameters; narrow tools push it into selection. But
  when the presenting symptom is a generic tool being used inconsistently, the answer is to
  split it, not to broaden something else
- Design parameters the model fills correctly: enums where the value set is known, required
  vs. optional chosen deliberately, and parameter descriptions that say what a value *means*
  rather than restating the field name
- Explain what a large tool surface costs and defer the full treatment: the token cost of
  every definition in every request, plus the selection-reliability cost. Session 16 owns
  tool distribution (task 2.3) and the numeric target — state here only that surface size is
  a selection problem, and send them there
- Say why "use a stronger model" is almost never the answer to a selection bug: the stronger
  model reads the same ambiguous description

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Expand the description vs. add few-shot examples to the prompt | Does the model lack *information about the tool*, or lack a pattern? Examples cost tokens on every request and leave the description ambiguous |
| Expand the description vs. build a routing layer | Is the ambiguity in the text, or is there genuinely a dispatch policy? A router in front of well-named tools is over-engineering |
| Rewrite both descriptions vs. rename one tool | Is the overlap verbal, or functional? If both names are plausible readings of the same request, rename |
| Rewrite the description vs. split the tool | Does one description have to enumerate several unrelated jobs? |
| Fix the tool definition vs. review the system prompt | Are the descriptions already differentiated *and* selection still fails in one consistent direction? |
| Specific keyword interference vs. "be more careful" | Can you point at the words in the system prompt doing the pulling? |
| Enum vs. free-text parameter | Is the value set known and closed? |
| Add a tool vs. fix a description | Is the model missing a capability, or misreading one it has? |

## How to run this session

1. **Frame the lateness deliberately.** F4 is 18%; this session owns task 2.1. Say why it
   arrives at 14: everything before it needed only tool *use*, and the learner has already
   watched selection go wrong from the outside — a subagent misrouting, a tool surface
   bloating context, a failure that had to propagate. Authorship is the specialised fix for
   problems they have already met. Do not present it as theory.
2. **Establish the mechanism.** Ask what information the model actually has at the moment it
   picks a tool. Drive to: the name, the description, and the parameter schema — nothing
   else about the tool. Then state the consequence directly: descriptions are the primary
   selection mechanism, and minimal descriptions make selection among similar tools
   unreliable. Connect to session 8 explicitly — this is the same explicit-criteria move,
   applied to a different prompt.
3. **Teach the expansion fix on the guide's own example.** Present `analyze_content` and
   `analyze_document` with near-identical one-line descriptions, and a transcript where web
   results go to the document analyzer and a PDF goes to the content analyzer. Ask for the
   diagnosis before the fix. Then have them rewrite *both*, and require all four elements in
   each: input formats handled, example queries, edge cases, boundary versus the sibling.
   Check the boundary clause specifically — it is the one learners omit.
4. **Then take the fix further, in both directions the guide names.** Ask: is the overlap
   verbal or functional? Introduce **renaming** — `analyze_content` becomes
   `extract_web_results` — and have them say what the rename bought that the rewrite did not.
   Then hand them `analyze_document` as a tool that must "extract data, summarize, or verify
   claims depending on the request", and drive to the **split**: `extract_data_points`,
   `summarize_content`, `verify_claim_against_source`, each with a defined input/output
   contract. Do not let them settle for "make the description longer" at this step.
5. **Teach the system-prompt case — carefully, and in this order.** First, present a thin
   description with a selection failure and offer "add an instruction to the system prompt
   telling it to be more careful" as a candidate fix. Let them reject it, and make them name
   why: it gives the model no new information about the tool. *Then* change the scenario —
   the descriptions are now well-differentiated, and the agent *still* routes metrics
   questions to the docs tool. Reveal the system prompt: it says "always start by searching
   the documentation." Land the lesson: system prompt wording is keyword-sensitive and can
   create tool associations you never intended, and reviewing the system prompt for such
   instructions is a named remediation step. Then make them state the tell that separates
   this from the trap — vague exhortation versus a specific keyword doing the pulling.
   **This ordering matters.** Teaching the de-biasing alone trains the learner to eliminate
   the correct answer on a keyword-interference item.
6. **Teach parameter design.** Have them critique a schema with free text where an enum
   belongs and a date field whose description restates its name. Ask what the model does with
   a parameter description that adds no information.
7. **Teach granularity as a judgment with a default direction.** Use a concrete pair: one
   `manage_ticket(action=...)` versus four separate tools. Get the trade named, then point
   out that the guide's remedy for a *presenting* problem is one-directional — a generic tool
   used inconsistently gets split.
8. **Name the surface-size cost and stop.** One paragraph: definitions cost tokens on every
   request and a large surface degrades selection. Say explicitly that session 16 owns tool
   distribution, `tool_choice`, and the numeric target, so they know how deep to go here.
9. **Decision table** — walk all eight rows. For each, give a scenario and have them apply it
   before you give the answer.
10. **Scenario drill — 6 questions.** Use a research assistant with `analyze_content` and
    `analyze_document`, plus a metrics tool and a docs-search tool, misrouting in two distinct
    ways. Ask for: the diagnosis of the near-identical-description misroute; the correct fix
    (expanded descriptions carrying input formats, example queries, edge cases, boundaries);
    a rename-vs-rewrite judgment; a split of a generic tool into purpose-specific ones; one
    item where the descriptions are clean and the *system prompt keyword* is the cause; and
    one where "improve the system prompt" is the trap. Include one multiple-response.
11. **Distractor autopsy.** Expect and name these:
    - **Few-shot examples in the system prompt** offered instead of expanding the
      description. Tell: it adds token overhead to every request and does not address the
      root cause, which is that the tool's own text is ambiguous
    - **A routing layer in front of the tools** — over-engineering; the ambiguity is in the
      descriptions and belongs there
    - **"Use a stronger model"** — it reads the same ambiguous description
    - **"Improve the system prompt" as a vague instruction** — the trap
    - And the inverse: an item where the *correct* answer is reviewing the system prompt for
      a keyword-sensitive instruction, which a learner over-trained on the previous bullet
      will eliminate. Run both in the same autopsy so the discrimination is explicit.
12. Record per `.agents/TUTORIAL.md` Step 5. Glossary **misrouting**, **mutual
    disambiguation**, and **keyword-sensitive instruction**.

## Out of scope

Defer and say where it's covered:
- Structured error responses, `isError`, `errorCategory`, `isRetryable` → session 16
  (task 2.2)
- Tool distribution across agents, scoped tool access, `tool_choice`, the 18-vs-4-5 surface
  numbers → session 16 (task 2.3)
- MCP servers, `.mcp.json`, `~/.claude.json`, MCP resources → session 17 (task 2.4)
- Built-in tool selection (Read, Write, Edit, Bash, Grep, Glob) → session 17 (task 2.5).
  Resist teaching it here even though it is tool-adjacent; it is a selection skill over a
  fixed surface, and session 17 owns it
- Hooks intercepting tool calls → session 15 (task 1.5), which builds directly on this
- Context budgeting and trimming tool results → session 6, already taught; reference it
- Enterprise tool governance → Tier 3 sessions 1 and 11
