# What Makes a System Agentic — F1 Agentic Architecture & Orchestration

**Exam weight: 27% (highest of any Foundations domain)**

## What this session assumes

First session of the curriculum. Assume a strong software engineering and architecture
background, but no formal grounding in agentic system design. The learner may have used
Claude Code or the API without having a precise vocabulary for what distinguishes an
agent from a scripted LLM call.

## Why this domain is worth 27% of your score

F1 is the largest domain on Foundations, and it's where the exam's scenario format bites
hardest: the questions rarely ask "what is an agent" — they hand you a system description
and ask whether the design is right, and if not, what to change. That requires a precise
model of the agentic loop, because most wrong answers on this exam are architectures that
would technically run but burn context, lose state, or escalate incorrectly.

## Session focus

This session builds the vocabulary the other three F1 sessions assume: the agentic loop, the three properties that make a system agentic, and the split between harness and model. The crux is **harness vs. model** — spend disproportionate time there. Nearly every "this agent is misbehaving" question on the exam has a harness answer (a tool description, a missing stop condition, context not carried forward), and candidates who reach for "better prompting" or "a stronger model" lose points across every scenario. Get the learner diagnosing faults to the harness by default, and the rest of F1 follows.

## Authoritative sources

Fetch these to verify current behavior before teaching specifics.

**The agent loop and what drives it**
- <https://code.claude.com/docs/en/agent-sdk/agent-loop>
- <https://code.claude.com/docs/en/how-claude-code-works>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>

**Building one end to end**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent>
- <https://code.claude.com/docs/en/agent-sdk/overview>

**Vocabulary**
- <https://code.claude.com/docs/en/glossary>
- <https://platform.claude.com/docs/en/about-claude/glossary>

## Teaching objectives

By the end, the learner can:

- Define the **agentic loop** precisely — model receives context, chooses a tool call,
  observes the result, updates its view, repeats until a stop condition — and identify
  each stage in a system description. Use the guide's term: § 6 calls this "the agentic
  loop lifecycle" and later sessions assume the phrase
- Name the three properties that make a system agentic — **autonomy over control flow**,
  **tool use that affects state**, and **iteration on observed results** — and say which
  are missing from a given design
- Explain what "the model decides the next step" costs you: nondeterminism, variable token
  spend, and the need for explicit stop conditions and budgets
- Distinguish the **harness** (tools, permissions, context assembly, stop conditions) from
  the **model**, and explain why most production failures are harness failures
- Identify stop conditions and why an agent without one is a defect, not a feature
- Drive loop control flow from the API's **`stop_reason`** — branch on `"tool_use"`
  (execute the call, append the result, continue) vs. `"end_turn"` (the turn is complete)
  — and state why reading `stop_reason` beats inferring intent from the text
- Separate the **primary stop condition** from the **backstop**, because the exam scores
  the distinction: `stop_reason == "end_turn"` is how a loop is *supposed* to end, and a
  turn or budget ceiling is a circuit breaker for when it doesn't. Ceilings are good
  design — they genuinely bound the system — but an *arbitrary* cap standing in as the
  *primary* stopping mechanism is a named anti-pattern, as is parsing natural language for
  "done" or treating any assistant text as a completion signal. The tell: if hitting the
  ceiling is a routine outcome rather than evidence something went wrong, it is being used
  as the plan instead of the backstop
- Describe **tool use** as the loop's other half: the model emits a `tool_use` block, the
  harness executes the call, and the **result is appended to the conversation history** so
  the next iteration can reason about it. Name **`allowedTools`** as the harness-side
  restriction on what an agent may call at all — the mechanism later sessions use to scope
  a subagent to its role
- Read a system description and state whether it is agentic, and what would have to change
  to make it so (or to make it not need to be)

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Agentic loop vs. single call | Is the number of steps knowable in advance? |
| Model chooses tools vs. code chooses | Does the *selection* need judgment, or just the execution? |
| Bounded iteration vs. open-ended | What's the cost ceiling, and who notices if it runs away? |
| Primary stop vs. backstop | Is the loop designed to end on `stop_reason`, with the ceiling as a circuit breaker — or is the ceiling doing the stopping? |
| Autonomy vs. human checkpoint | What's the cost of a wrong action vs. the cost of waiting? |

## How to run this session

1. **Frame** — F1 is 27%; this session builds the vocabulary the other three F1 sessions
   assume. Say that plainly.
2. **Start from what they know.** Ask the learner to describe a system they've built that
   called an LLM. Use it as the running example throughout — classify it, then ask what
   would change if it had to handle a case it currently can't.
3. **Teach the agentic loop** first, concretely. Walk one full iteration of a real task
   (e.g. "fix the failing test") naming each stage. Then ask them to predict: what happens
   on iteration two if the tool result is an error? Check before moving on.
4. **Teach the three properties** one at a time. After each, give a one-line system
   description and ask: agentic or not, and which property is missing? Do at least three.
5. **Teach harness vs. model.** This is the session's most exam-relevant idea. Give a
   failing agent and ask them to locate the fault — the answer should be a harness fault
   (wrong tool description, missing stop condition, context not carried forward) far more
   often than a model fault.
6. **Teach loop termination from `stop_reason`, then the backstop.** Walk the branch on
   `"tool_use"` vs `"end_turn"` concretely. Then give them a loop whose only stop is
   `max_turns=40` and ask what is wrong with it — the answer is not "the cap is too low"
   but that a ceiling is standing in for a stop condition. Land the tell: routinely
   reaching the ceiling means it is the plan, not the circuit breaker. Then ask what the
   other two anti-patterns look like in code (grepping the text for "done"; treating any
   assistant text as completion).
7. **Decision table** — walk the table above. For each row, give a scenario and have them
   apply it before you give the answer.
8. **Scenario drill — 4 questions.** Use a realistic system: a ticket-triage service that
   reads incoming issues, looks up account history, and either replies or routes to a
   human. Ask about loop structure, missing stop conditions, where autonomy is
   inappropriate, and which failure is a harness fault. Include one multiple-response.
9. **Distractor autopsy** on all four. Expect the tempting wrong answers to be "add more
   autonomy" and "the model needs better prompting" where the real answer is a harness fix.
10. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

Defer and say where it's covered:
- How to decompose a task, and prompt chaining vs. adaptive plans → session 2
- Subagents, the Task tool, `AgentDefinition`, `fork_session` → session 3
- Enforcement gates, structured handoff, session resumption → session 4
- Context window mechanics and what summarization destroys → session 6
- Authoring a tool interface — descriptions, naming, splitting → session 14
- The hook mechanism (`PostToolUse`, interception) → session 15

Tool *use* is in scope here and taught above: the loop returns `stop_reason: "tool_use"`,
results are appended to history, and `allowedTools` restricts what an agent may call. Tool
*design* is a different skill and waits for session 14 — say so if the learner reaches for
it, because the distinction is what lets sessions 2–13 proceed without it.
