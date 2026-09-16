# Conversation Context and What Summarization Destroys — F5 Context Management & Reliability

**Exam weight: 15%**

## What this session assumes

Sessions 1 (the agentic loop and `stop_reason`) and 3 (coordinator-subagent orchestration).
Session 1 established that tool results are appended to history and carried forward;
session 3 established that a subagent inherits only what the parent hands it. This session
supplies the mechanics behind both. It is the first of the three F5 sessions and owns
§ 6 task **5.1 — "Manage conversation context to preserve critical information across long
interactions."**

## Why this domain is worth 15% of your score

The F5 domain description names **preserving information across conversations** and
**token efficiency**. Context is the resource that constrains every agentic design, so this
material decides answers in F1 questions too — the fork-vs-subagent choice from session 3
is really a context-budget choice. It's the smallest Foundations domain but the one whose
concepts leak into the most other questions. Task 5.1 specifically is written around a
single failure mode: information that mattered was present in the conversation and is no
longer recoverable. Every item you draw on it is a variant of "what got destroyed, and what
should have protected it."

## Session focus

This session is about the conversation window as a budget you spend and a record you can silently corrupt. The crux is the **budget reality**: in a real agent, accumulated *tool results* usually dominate the window — not the system prompt — which relocates where optimization actually pays. Build to that surprise first, because it reframes everything after it: trimming a 40-field order lookup to the 5 fields that matter buys more than any amount of prompt tightening. Then spend the session's remaining weight on what progressive summarization destroys — numerical values, percentages, dates, and **customer-stated expectations** — and on the two structural defenses: the persistent **case facts** block, and a **separate context layer** of extracted structured issue data for multi-issue sessions. Treat position effects (**lost in the middle**) as a third, smaller beat. Do not teach caching mechanics; see `## Out of scope`.

## Authoritative sources

Verify current window sizes and limits from live docs before quoting any number.

**Windows and budgeting**
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://code.claude.com/docs/en/context-window>

**Conversation history and the API contract**
- <https://platform.claude.com/docs/en/api/messages>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>

**Reclaiming space and trimming tool output**
- <https://platform.claude.com/docs/en/build-with-claude/compaction>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>

**Persistence across sessions**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://code.claude.com/docs/en/memory>

## Teaching objectives

By the end, the learner can:

- Account for everything occupying the window: system prompt, tool definitions, CLAUDE.md
  and instruction files, conversation history, tool results, and the reserved output space
- Identify the dominant consumer in a real agent — usually accumulated **tool results**,
  not the prompt — and say what that implies about where to optimize
- State the API contract for multi-turn conversations: the Messages API is stateless, so
  **every subsequent request must carry the complete conversation history** — prior user
  turns, assistant turns, and the `tool_use` / `tool_result` pairs between them. Dropping
  or thinning earlier turns to save tokens is how conversational coherence breaks: the
  model stops referring to what the customer already said, re-asks answered questions, and
  contradicts its own earlier commitments. Name the distinction the exam turns on —
  *summarizing* history is a deliberate lossy trade you make and defend; *omitting* history
  is a defect
- Name what **progressive summarization** destroys, specifically. It condenses exactly the
  things that must stay exact: **numerical values** (a refund amount), **percentages** (a
  20% restocking fee becomes "a partial fee"), **dates** (a delivery commitment becomes
  "soon"), and **customer-stated expectations** — what the customer said they wanted or was
  promised, which is the one no later tool call can recover. Make the learner say why the
  last is worst: an order total can be re-looked-up, and a promise cannot
- Maintain a persistent **case facts** block — the guide's term, use it — carried in every
  prompt *outside* the summarized history: amounts, dates, order numbers, statuses, and what
  the customer was told. A lossy summary cannot blur what is not in the summary
- For **multi-issue sessions**, go one step further than a facts block: **extract and
  persist structured issue data** — order IDs, amounts, statuses — into a **separate
  context layer**, keyed per issue. Name why the facts block alone is insufficient here: a
  single flat block conflates three concurrent issues, so the agent applies issue two's
  order ID to issue three's refund. The separate layer keeps each issue's structured record
  addressable and survives summarization of the prose around it
- Explain **compaction** — summarizing history to reclaim space — and what it costs: the
  detail is gone, and the summary is a lossy artifact the model then trusts as if it were
  the original
- Explain **context editing** and pruning stale tool results, and when that's safer than
  compaction
- **Trim verbose tool results to the fields that matter, before they accumulate.** An order
  lookup returning 40 fields when 5 are relevant spends the window on noise, and because
  results accumulate, the waste compounds every call. The trimming belongs at the tool
  boundary, not in a later cleanup pass — by cleanup time the tokens are already spent
- Name the **lost in the middle** effect — content in the middle of a long context is
  attended to less reliably than content at either edge — and order inputs position-aware.
  State the remedy concretely: put a **key-findings summary at the beginning** of an
  aggregated input and give the detail **explicit section headers**, rather than trusting
  the model to find the middle
- Require upstream agents and subagents to include **metadata** with what they return —
  **dates**, **source locations**, and **methodological context** (how a figure was
  obtained, over what sample, under what assumptions) — so a downstream reader can judge a
  finding rather than only repeat it. Provenance through synthesis is session 7's material;
  here, teach only that the metadata must be attached at production time because no
  downstream step can reconstruct it
- Choose the right persistence mechanism across sessions: an instruction file, the memory
  tool, external storage the agent reads, or session resumption — and say what each
  guarantees
- Diagnose a context problem to a cause: too many tools, unsummarized tool output,
  over-long instruction files, or history that was thinned instead of summarized
- Explain why "the model forgot" is usually a context-architecture defect

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Send complete history vs. thin it to save tokens | Is coherence across turns load-bearing? (It is — thinning is a defect, summarizing is a trade) |
| Summarized history vs. a persistent case facts block | Would a blurred number, date, or promise change a decision? |
| One case facts block vs. a separate context layer per issue | Is this session handling one issue or several concurrently? |
| Compaction vs. context editing | Do you need a narrative summary, or just to drop stale results? |
| Trim tool output at the boundary vs. return full | Will the model need the raw detail again — and how many times will this call repeat? |
| Summary first with headers vs. raw concatenation | Is the aggregated input long enough for position effects to bite? |
| Memory tool vs. instruction file | Is it learned-and-changing, or authored-and-stable? |
| Bigger window vs. better architecture | Is the growth bounded, or unbounded by design? |

## How to run this session

1. **Frame** — F5 is 15%, this session owns task 5.1, and context is the binding constraint
   on agentic design, so this material decides F1 answers too. Say that plainly.
2. **Teach the budget** by having the learner enumerate what's in the window for a real
   agent, then guess the proportions. Correct them: accumulated tool results usually
   dominate, not the system prompt. That surprise is the teaching moment — make them
   restate where optimization pays before moving on.
3. **Teach the history contract.** Ask what the API receives on turn twelve of a support
   conversation. Drive to: the complete history, every turn, including the `tool_use` and
   `tool_result` pairs. Then ask what breaks if turns 3–7 are dropped to save tokens, and
   get a concrete answer — the agent re-asks a question the customer already answered, or
   contradicts a commitment it made in turn 5. Land the distinction: summarize deliberately,
   never silently omit.
4. **Teach what summarization destroys.** Give a support transcript containing a promised
   refund amount, a 20% restocking fee, an order number, a delivery date, and one sentence
   where the customer states what they expect ("I was told this would arrive before the
   15th, and I need it for a wedding"). Show a plausible compaction of it. Ask what a
   downstream agent can no longer do. Make them find all five losses, and push until they
   name the customer-stated expectation as the worst — the others are re-lookupable.
5. **Teach the case facts block** as the defense. Use the guide's exact term, **case facts**,
   and say so out loud; a near-miss phrase costs recognition on the exam. Have them write
   the block for the transcript above, then ask what rule decides what goes in it.
6. **Teach the separate context layer for multi-issue sessions.** Extend the same scenario:
   the customer now has three open issues — a refund, a delayed shipment, and a billing
   dispute. Ask them to use their single case facts block. Let the conflation happen, then
   introduce **extracting and persisting structured issue data** (order IDs, amounts,
   statuses) into a **separate context layer** keyed per issue. This is a distinct
   objective from step 5; do not let it collapse into "a bigger facts block."
7. **Teach trimming at the tool boundary.** The 40-fields-when-5-matter case. Ask where the
   trim belongs and why "we'll clean it up later" fails — then connect it to step 2: this is
   the dominant consumer, so this is where optimization actually pays.
8. **Teach lost in the middle.** Use the unhyphenated phrase in prose, as the guide does.
   Hand them a long aggregated input and ask how to order it. Drive to the two concrete
   remedies: key-findings summary at the beginning, explicit section headers on the detail.
9. **Teach metadata on returned findings** — dates, source locations, methodological
   context — and say why it must be attached at production time. State explicitly that full
   provenance handling is session 7, so they know how deep to go here.
10. **Teach compaction and context editing honestly** — compaction is lossy and the model
    subsequently trusts the summary; editing just drops stale results. Ask when each is
    right.
11. **Teach persistence options** and have them place four requirements across the
    mechanisms.
12. **Teach diagnosis** — four context failures, four different causes and fixes.
13. **Decision table** — walk all eight rows. For each, give a scenario and have them apply
    it before you give the answer.
14. **Scenario drill — 6 questions.** Use a multi-issue support agent: a customer with an
    open refund, a delayed shipment, and a billing dispute, across a conversation long
    enough to need compaction. Ask for the diagnosis of a blurred figure a later step
    depends on; the case facts block contents; the multi-issue context-layer design; where
    to trim a verbose tool result; the ordering fix for a long aggregated input; and one on
    what must be sent in the next API request. Include one multiple-response.
15. **Distractor autopsy** — expect "use a bigger window" offered for unbounded growth,
    thinning history offered as token efficiency, a single facts block offered for a
    multi-issue session, and cleanup-after-the-fact offered where boundary trimming was
    needed.
16. Record per `.agents/TUTORIAL.md` Step 5. Glossary every verified limit, plus **case
    facts**, **lost in the middle**, and **separate context layer**.

## Out of scope

Defer and say where it's covered:
- **Prompt caching mechanics** — out of scope for the exam entirely. CCAR-F § 17 permits
  only *that prompt caching exists*. Say that one sentence if the learner asks, and stop.
  Do **not** teach the cacheable prefix, cache breaks, write premiums, read discounts, TTL
  selection, or break-even arithmetic. Correct arithmetic on an excluded topic is still
  wasted study
- Scratchpad files, `/compact` as a command, subagent-as-context-firewall, and the built-in
  Explore subagent → session 7 (Reliability Across Agents), which owns task 5.4
- Error propagation and structured error context → session 7 (task 5.3)
- Provenance through synthesis, claim-source mappings, conflicting sources → session 7
  (task 5.6)
- Escalation and ambiguity resolution → session 9 (task 5.2)
- Session resumption, `--resume`, and `fork_session` mechanics → session 4 (task 1.7),
  already taught; reference it, don't re-teach it
- Context engineering at enterprise scale → Tier 3 session 14
- Cost optimization broadly → Tier 3 session 9
