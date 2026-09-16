# Reliability Across Agents: Errors, Crash Recovery, Provenance — F5 Context Management & Reliability

**Exam weight: 15%**

## What this session assumes

Sessions 1 (the agentic loop and `stop_reason`), 3 (coordinator-subagent orchestration and
the Task tool), 4 (enforcement, handoff, and session state), and 6 (conversation context).
Session 3 gave you a coordinator that spawns subagents; session 4 gave you session state and
handoff; session 6 gave you the window budget and what summarization destroys. This session
is what happens to all three when a subagent fails, when a session runs long enough to
degrade, and when findings from several agents have to be merged. It owns three § 6 task
statements: **5.3 — error propagation across multi-agent systems**, **5.4 — context
management in large codebase exploration**, and **5.6 — provenance and uncertainty in
multi-source synthesis.**

## Why this domain is worth 15% of your score

F5's domain description names **error handling in distributed setups** alongside context
management, and this session carries three of the domain's six task statements — the
largest single concentration of F5 scope anywhere in Tier 1. It also feeds the S3
Multi-Agent Research archetype directly: a research coordinator with failing subagents, a
long exploration that degrades, and a synthesis over conflicting sources is exactly the
scenario shape the exam builds S3 items from.

## Session focus

Three task statements, one idea. The crux: **a generic status hides the context needed to recover — structured error context, exported state manifests, and claim-source mappings are all the same move: preserve the structure a downstream agent or human needs.** Teach that sentence early and return to it at every transition, because the three halves of this session look unrelated until the learner sees that "search unavailable", a crashed run with no manifest, and a synthesized statistic with its source dissolved are the same defect wearing three costumes. Spend disproportionate time on 5.3 (error propagation) — it is the most item-dense of the three and contains the two anti-patterns the exam pairs as a multiple-response — then 5.6, then 5.4.

## Authoritative sources

**Multi-agent failure and subagent behavior**
- <https://code.claude.com/docs/en/agent-sdk/subagents>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>

**State, recovery, and checkpointing**
- <https://code.claude.com/docs/en/sessions>
- <https://code.claude.com/docs/en/agent-sdk/session-storage>
- <https://code.claude.com/docs/en/checkpointing>
- <https://code.claude.com/docs/en/agent-sdk/file-checkpointing>

**Context in long explorations**
- <https://code.claude.com/docs/en/context-window>
- <https://platform.claude.com/docs/en/build-with-claude/compaction>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>

**Observability**
- <https://code.claude.com/docs/en/agent-sdk/observability>

## Teaching objectives

By the end, the learner can:

### Error propagation across agents (5.3)

- Return **structured error context** from a failing subagent rather than a status string.
  The four fields the exam expects: the **failure type**, the **attempted query** (or
  operation), any **partial results** already obtained, and **alternative approaches** the
  coordinator might take. Each of the four exists because it changes what the coordinator
  can do next
- Explain why a **generic error status hides valuable context from the coordinator**.
  "Search unavailable" tells the coordinator that something failed and nothing else: it
  cannot tell whether to retry, reroute to a different source, use the partial results
  already gathered, or narrow the query — so it either gives up or retries blindly. The
  information needed to choose was present at the failure site and was discarded on the way
  out. This is the session's crux in its smallest form
- Distinguish an **access failure** from a **valid empty result**. A search that errored and
  a search that legitimately found nothing are different facts. Returning empty for both
  destroys the coordinator's ability to decide what to do next — it reads "no results" as
  evidence of absence and moves on, when the truth was "we never looked." Make the learner
  say what each should return
- Name the two anti-patterns and say why they are *both* wrong, in the same breath, because
  the exam pairs them:
  - **Silently suppressing errors** — returning empty results as success — which converts a
    failure into a false finding the coordinator then builds on
  - **Terminating the entire workflow on a single subagent failure** — which throws away
    every sibling's completed work because one worker couldn't reach one source

  The correct posture is between them: report the failure with structure, continue the work
  that can continue, and mark what is missing
- Apply **local recovery in the subagent** for transient failures: the subagent retries,
  backs off, or tries an alternative source itself, and **propagates only what it cannot
  resolve** — and when it propagates, it sends **the partial results it did obtain and what
  it attempted**, not a bare failure. Name why recovery belongs local: the coordinator has
  less context about the failure than the agent that hit it, and every round trip to the
  coordinator costs a turn and window space
- Produce **synthesis output with coverage annotations** — use the guide's term. The
  synthesis says which subtopics were covered and by what, which were attempted and failed,
  and which were never attempted. Without them a synthesis reads equally confident over a
  fully-sourced topic and a hole

### Context in large explorations and crash recovery (5.4)

- Recognize **context degradation in extended sessions** by its diagnostic symptom, not by
  token count: **the model starts giving inconsistent answers and referencing "typical
  patterns" rather than the specific classes it discovered earlier in the session**. That
  retreat to the generic is the tell — the specifics have fallen out of effective context
  and the model is answering from priors while still sounding confident
- Use **scratchpad files** to move working state out of the window and read it back on
  demand — findings, a file inventory, a running list of open questions. Say why that beats
  keeping it in conversation history: history is carried on every request and degrades with
  position, a file is read only when needed and read intact
- Use **subagent delegation to isolate verbose exploration**: the expensive reading happens
  in a child whose window absorbs the volume, and only the conclusion returns to the parent.
  The built-in **Explore** subagent is the canonical instance. This is the same
  fork-vs-subagent decision from session 3, restated in context-budget terms
- Use **`/compact`** by name — the Claude Code command that compacts the current
  conversation — and say what it costs, since session 6 established that compaction is
  lossy and the model then trusts the summary. Name when to reach for `/compact` versus
  when the right answer was delegation or a scratchpad instead
- **Summarize key findings from one exploration phase before spawning subagents for the
  next phase, and inject those summaries into the subagents' initial context.** This is the
  phase-boundary discipline: you do not hand phase two's workers phase one's raw transcript,
  and you do not hand them nothing either — you hand them the distilled findings. Name both
  failure modes it prevents: workers that re-derive what phase one already established, and
  workers that contradict it
- Design **crash recovery** for a multi-agent run: **each agent exports its state to a known
  location, and the coordinator loads a manifest on resume.** Use the guide's term,
  **manifest** — the record of what was dispatched, what returned, and what is outstanding.
  Session 4 introduced manifests for subtask state; the half that is new here is the
  per-agent export plus the coordinator's reload, which is what makes resumption possible
  without redoing completed work. Make the learner say what the manifest must contain for a
  resume to be correct rather than merely possible

### Provenance through synthesis (5.6)

- Name where attribution is usually lost: **during summarization**. Each summarization step
  is prose compression, and prose compression dissolves the link between a claim and where
  it came from. Once dissolved, no downstream agent can recover it — which is why the fix
  must be upstream
- Require upstream agents to return structured **claim-source mappings** — the guide's term.
  Each mapping carries the claim, the **source URL or document name**, and the **relevant
  excerpt** supporting it. Require that these are **preserved and merged through synthesis**
  rather than flattened into prose at the first merge step
- Handle **conflicting statistics** by **annotating both values with their source
  attribution** and letting the coordinator or the reader reconcile — never by arbitrarily
  selecting one because it sounds more credible or appeared first. Name the tell: if the
  synthesis reports a single number and the inputs disagreed, information was destroyed
- Carry **temporal data** — **publication or collection dates** — on every finding, so a
  downstream reader reads two different-year figures as a time series rather than a
  contradiction. A large share of apparent source conflicts are temporal differences being
  misread
- Write reports that **distinguish well-established findings from contested ones**, so a
  reader can tell a consensus figure from a single-source claim without re-reading the
  sources
- **Render different content types appropriately in the synthesis output** rather than
  converting everything to one uniform format: **financial data as tables**, **news as
  prose**, **technical findings as structured lists**. Name why this is a provenance
  concern and not a cosmetic one — flattening a financial table into prose loses the
  row-column relationships that made the numbers comparable, and flattening technical
  findings into prose buries the enumeration a reader needs to check coverage

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Structured error context vs. a generic status | Could the coordinator choose its next move from what you returned? |
| Access failure vs. valid empty result | Did we look and find nothing, or fail to look? |
| Recover locally vs. propagate | Is the failure transient and resolvable with the context the subagent already has? |
| Continue with partial results vs. terminate the workflow | Does one worker's failure invalidate the siblings' completed work? |
| Suppress an error vs. annotate the gap | Will a downstream reader mistake the hole for a finding? |
| `/compact` vs. delegate vs. scratchpad | Is the detail needed later, needed elsewhere, or only needed to reach a conclusion? |
| Inject phase summaries vs. hand over raw transcript | Do the next-phase workers need the findings or the derivation? |
| Manifest + per-agent export vs. restart | Is the completed work expensive to redo? |
| Annotate conflicting sources vs. pick one | Does whoever picks have the context to judge — and would the reader know a choice was made? |
| Uniform format vs. type-appropriate rendering | Does the content's structure carry meaning the prose would lose? |

## How to run this session

1. **Frame** — this session owns three of F5's six task statements, and it is the direct
   input to the S3 Multi-Agent Research drill. Say the crux out loud in its full form and
   tell the learner you will return to it three times.
2. **Open on the generic status.** Give a research coordinator that spawned four subagents;
   one returns `{"status": "search unavailable"}`. Ask what the coordinator should do.
   Let them struggle — the point is that the question is unanswerable — then extract the
   four fields of **structured error context**: failure type, attempted query, partial
   results, alternative approaches. For each field, ask what decision it unlocks.
3. **Teach access failure vs. valid empty result.** Two subagents both return zero findings;
   one's source was down, one's source genuinely had nothing. Ask what the coordinator does
   differently in each case, then ask what happens if both returned the same payload.
4. **Teach the two anti-patterns as a pair.** Present both — silent suppression returning
   empty as success, and whole-workflow termination on one failure — and ask which is
   correct. The intended realization is neither; make them articulate the middle posture
   before you state it. Flag explicitly that this pairing is multiple-response shaped.
5. **Teach local recovery.** Transient timeout in a subagent: who retries? Drive to the
   subagent, and to the rule that it propagates only what it cannot resolve, carrying
   partial results and what it attempted.
6. **Teach coverage annotations.** Hand them a confident three-paragraph synthesis where one
   of four subtopics was never sourced. Ask them to find the hole. They won't reliably.
   That is the argument for **coverage annotations** — use the term.
7. **Transition to 5.4 by restating the crux.** A crashed run is the same defect over time
   instead of across agents.
8. **Teach the degradation symptom first, not the fix.** Describe a codebase exploration at
   turn 60 where the agent now answers "typically, handler classes in a service like this
   would…" instead of naming the three handler classes it read at turn 12. Ask them to
   diagnose. Land it: the retreat to **typical patterns** and inconsistent answers *is* the
   diagnostic, and it appears while the model still sounds confident.
9. **Teach the three remedies against that symptom** — **scratchpad files**, **subagent
   delegation** for verbose exploration (the **Explore** subagent as the canonical case),
   and **`/compact`** by name. Have them assign each remedy to a situation where the other
   two would be wrong.
10. **Teach the phase boundary.** Exploration phase one finishes; phase two needs five
    subagents. Ask what goes into their initial context. Drive to summarized key findings
    injected at spawn — neither the raw transcript nor nothing — and name both failures it
    prevents.
11. **Teach crash recovery.** The run dies at 70%. Ask what has to have been true beforehand
    for resume to work. Drive to: each agent exported state to a known location, and the
    coordinator loads a **manifest** on resume. Then push harder — what must the manifest
    contain for the resume to be *correct*, not merely to start?
12. **Transition to 5.6 by restating the crux a third time.** Attribution is structure, and
    prose compression is where it dies.
13. **Teach provenance through synthesis.** Hand the learner three subagent findings — two
    with conflicting statistics from credible sources, one from a different year. Ask for
    the synthesis. The instinct is to pick the better number; make them defend it, then
    establish the alternative: annotate both with attribution, carry publication or
    collection dates so a temporal difference doesn't read as a contradiction, and mark
    which conclusions are contested versus well-established. Close on the structural rule —
    **claim-source mappings** must be produced upstream and merged through synthesis,
    because no downstream agent can recover attribution that was already dissolved.
14. **Teach type-appropriate rendering.** Give them a synthesis containing quarterly revenue
    figures, an industry news development, and a set of technical benchmark findings, all
    written as uniform prose. Ask what was lost. Drive to tables for financial data, prose
    for news, structured lists for technical findings — and make them say why it is a
    provenance loss rather than a formatting preference.
15. **Decision table** — walk all ten rows. For each, give a scenario and have them apply it
    before you give the answer.
16. **Scenario drill — 7 questions.** Use a research coordinator running five subagents over
    a long exploration: one source is down, one returns genuinely nothing, the run crashes
    at 70%, and two subagents report conflicting market-size figures from different years.
    Ask about the error payload's contents; the empty-vs-failure distinction; what the
    coordinator does with four healthy siblings when one dies; the resume design; the
    conflicting-statistics handling; the degradation diagnosis; and the synthesis rendering.
    Include one multiple-response — make it the two error anti-patterns.
17. **Distractor autopsy** — expect whole-workflow termination offered as "fail fast",
    empty-as-success offered as graceful degradation, the more-credible-sounding source
    silently chosen, "use a bigger window" offered for the degradation symptom, and
    `/compact` offered where delegation was right.
18. Record per `.agents/TUTORIAL.md` Step 5. Glossary **structured error context**,
    **coverage annotations**, **claim-source mappings**, **manifest**, **scratchpad files**,
    and **`/compact`**.

## Out of scope

Defer and say where it's covered:
- Tool-level error taxonomy — transient/validation/business/permission, the `isError` flag,
  retry ceilings, idempotency → session 16 (Tool Errors and Tool Distribution, task 2.2).
  Here you need only that a tool call can fail and what the *agent* does about it; the
  contract that shapes the error payload is authored there
- Escalating to a human, the escalation handoff, and ambiguity resolution → session 9
  (task 5.2). When a coordinator cannot resolve a failure, "escalate" is the answer; how to
  decide and how to hand off is session 9's material
- What summarization destroys in a *conversation*, the case facts block, the multi-issue
  context layer, lost in the middle → session 6 (task 5.1), already taught; reference it
- Session resumption mechanics, `--resume`, named sessions, `fork_session` → session 4
  (task 1.7), already taught
- Decomposition itself — how to split the work the coordinator is dispatching → session 2
  (task 1.6)
- **Prompt caching mechanics** — out of scope for the exam entirely per CCAR-F § 17; the
  permitted depth is that it exists
- Human review workflows and confidence calibration → session 12 (task 5.5)
- Production reliability at enterprise scale → Tier 3 session 6
- Full observability stack → Tier 3 session 16
