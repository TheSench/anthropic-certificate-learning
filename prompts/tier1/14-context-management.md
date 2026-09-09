# Context Windows, Caching, and Compaction — F5 Context Management & Reliability

**Exam weight: 15%**

## What this session assumes

The four F1 sessions. Orchestration Patterns already introduced context inheritance; this
session supplies the mechanics behind it. First of the two F5 sessions.

## Why this domain is worth 15% of your score

The F5 domain description names **preserving information across conversations** and
**token efficiency**. Context is the resource that constrains every agentic design, so
this material decides answers in the F1 questions too — the fork-vs-subagent choice is
really a context-budget choice. It's the smallest Foundations domain but the one whose
concepts leak into the most other questions.

## Session focus

This session supplies the mechanics behind the context choices Orchestration Patterns introduced. Verify window sizes, cache TTLs, and pricing multipliers from live docs before quoting them. The crux is the **budget reality**: in a real agent, accumulated *tool results* usually dominate the window — not the system prompt — which relocates where optimization actually pays. Build to that surprise, then use it to reframe the fork-vs-subagent decision in context-budget terms. This is the smallest Foundations domain but its concepts decide answers in F1 questions too, so treat it as load-bearing.

## Authoritative sources

Verify current window sizes, cache TTLs, minimum cacheable lengths, and pricing
multipliers — all of these change.

**Windows and budgeting**
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://code.claude.com/docs/en/context-window>

**Caching**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching>

**Reclaiming space**
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
- Explain **prompt caching**: the cacheable prefix, why cache breaks are caused by
  *changing something early* in the prompt, and how ordering must be designed for it
  (stable content first, volatile content last)
- Compute whether caching pays: verify the current write premium, read discount, and TTL,
  then reason about reuse frequency within the window
- Explain **compaction** — summarizing history to reclaim space — and what it costs: the
  detail is gone, and the summary is a lossy artifact the model then trusts
- Explain **context editing** and pruning stale tool results, and when that's safer than
  compaction
- Choose the right persistence mechanism across sessions: an instruction file, the memory
  tool, external storage the agent reads, or session resumption — and say what each
  guarantees
- Use the **subagent-as-context-firewall** pattern deliberately: expensive exploration
  happens in a child, only the conclusion returns
- Diagnose a context problem to a cause: too many tools, unsummarized tool output,
  over-long instruction files, or work that should have been delegated
- Explain why "the model forgot" is usually a context-architecture defect

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Compact vs. delegate to a subagent | Is the detail needed later, or was it only needed to reach a conclusion? |
| Cache vs. don't | Is the prefix stable and reused often enough within the TTL? |
| Compaction vs. context editing | Do you need a narrative summary, or just to drop stale results? |
| Memory tool vs. instruction file | Is it learned-and-changing, or authored-and-stable? |
| Summarize tool output vs. return full | Will the model need the raw detail again? |
| Bigger window vs. better architecture | Is the growth bounded, or unbounded by design? |

## How to run this session

1. **Frame** — context is the binding constraint on agentic design, so this material
   decides F1 answers too.
2. **Verify** window sizes, cache TTLs, and multipliers from live docs before quoting any.
3. **Teach the budget** by having the learner enumerate what's in the window for a real
   agent, then guess the proportions. Correct them: tool results usually dominate. That
   surprise is the teaching moment.
4. **Teach caching mechanics.** Ask what happens to the cache if a timestamp is injected at
   the top of the system prompt. Then have them reorder a prompt for cacheability and
   explain the rule they applied.
5. **Do the cache arithmetic** once together, using the verified numbers.
6. **Teach compaction honestly** — it's lossy, and the model subsequently trusts the
   summary. Ask when that's dangerous.
7. **Teach context editing** and the choice against compaction.
8. **Teach persistence options** and have them place four requirements across the
   mechanisms.
9. **Teach the context-firewall pattern** and connect it explicitly back to the Orchestration Patterns
   fork-vs-subagent decision. Ask them to restate that decision in context-budget terms.
10. **Teach diagnosis** — four context failures, four different causes and fixes.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 4 questions.** Use a long-running research agent that degrades after
    ~40 tool calls and starts repeating searches. Ask for the diagnosis, the caching fix,
    compaction vs. delegation, and the persistence choice for findings across sessions.
    Include one multiple-response.
13. **Distractor autopsy** — expect compaction chosen where delegation was right, and
    "use a bigger window" for unbounded growth.
14. Record per `.agents/TUTORIAL.md` Step 5. Glossary every verified limit.

## Out of scope

- Escalation and state recovery → Reliability & Escalation
- Context engineering at enterprise scale → Tier 3 session 14
- Cost optimization broadly → Tier 3 session 9
