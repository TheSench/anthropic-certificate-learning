# Designing Tools Claude Uses Correctly — F4 Tool Design & MCP Integration

**Exam weight: 18%**

## What this session assumes

Sessions 1–10. The learner knows the agentic loop and can design a reliable call.

## Why this domain is worth 18% of your score

The F4 domain description names **building tool descriptions** first, and "debugging tool
selection issues" is a named exam skill. The scored insight is that a tool description is
a *prompt* — the only information the model has when choosing — so most tool-selection
bugs are description bugs, not model bugs. Exam wrong answers are typically "improve the
system prompt" or "use a stronger model" when the actual fix is in the tool definition.

## Session focus

This session covers designing tools the model selects and calls correctly. The crux is that **a tool description is a prompt** — it's the model's entire basis for choosing — so most tool-selection bugs are description bugs. Spend the most time on mutual disambiguation: rewriting two overlapping descriptions against each other so each says when to use it *and when not to*. The exam's tempting wrong answers here are "improve the system prompt" and "use a stronger model"; a learner who reaches for those on a description bug will miss "debugging tool selection issues" items, which are a named exam skill.

## Authoritative sources

**Tool definition and mechanics**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference>

**Selection problems and diagnosis**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use>

**Scaling the tool surface**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling>

**Custom tools in the SDK, and built-ins to reuse**
- <https://code.claude.com/docs/en/agent-sdk/custom-tools>
- <https://code.claude.com/docs/en/tools-reference>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools>

## Teaching objectives

By the end, the learner can:

- Treat the tool definition as a prompt: name, description, and parameter descriptions are
  the model's entire basis for choosing and calling it
- Write a description that states **what the tool does, when to use it, and when not to** —
  and explain why the "when not to" clause is what prevents mis-selection
- Diagnose tool-selection failures to a cause: overlapping descriptions, a missing tool
  for the real need, ambiguous parameters, too many tools, or a description that omits
  its boundaries
- Choose the right **granularity** — few broad tools vs. many narrow ones — and name the
  trade: broad tools need more parameter judgment, narrow tools crowd the selection space
- Design parameters the model fills correctly: enums over free text where the set is
  known, required vs. optional deliberately, and descriptions that say what a value means
  rather than restating the field name
- Explain what a large tool surface costs — token overhead in every request plus
  selection difficulty — and the mitigations (tool search, scoping the set per task)
- Decide when to reuse a **built-in or server tool** rather than writing a custom one
- Recognize when the model should call tools **in parallel**, and what precludes it
- Explain when a tool should return a *summary* rather than raw payload, and connect that
  to context management
- Explain why the answer to "the model picked the wrong tool" is almost never "use a
  stronger model"

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Few broad tools vs. many narrow | Does selection or parameterization carry the judgment? |
| Custom tool vs. built-in/server tool | Does the platform already do this well? |
| Add a tool vs. fix a description | Is the model missing a capability, or misreading one? |
| Full payload vs. summarized return | Will the parent need the detail, or just the answer? |
| Tool search vs. a curated tool set | Is the surface large *and* task-dependent? |
| Strict schema vs. permissive | Does a malformed argument break something downstream? |

## How to run this session

1. **Frame** — a tool description is a prompt. Say it plainly and return to it all session.
2. **Teach description anatomy.** Give a bad description ("Searches the database") and have
   the learner rewrite it with a when-to-use and a when-not-to. Then present a sibling tool
   with overlapping scope and ask them to disambiguate both descriptions against each other.
   That mutual disambiguation is the skill.
3. **Teach diagnosis.** Present four tool-selection failures, each with a different cause.
   For each: what's the cause, what's the minimal fix? Do not accept "better system prompt"
   as a universal answer — that's the bias the exam punishes.
4. **Teach granularity** with a concrete pair: one `manage_ticket(action=...)` tool vs. four
   separate tools. Ask which is better, then change the context (20 other tools present;
   only 3 present) and re-ask.
5. **Teach parameter design.** Have them critique a schema with free-text where an enum
   belongs and an ambiguous date field.
6. **Teach the cost of a large surface** and its mitigations. Ask what 60 tools does to
   every single request.
7. **Teach summarized returns** and connect forward to context management.
8. **Teach parallel tool use** and what blocks it.
9. **Decision table** — walk all six rows.
10. **Scenario drill — 5 questions.** Use an internal assistant with 25 tools across
    ticketing, docs, deploys, and metrics, where it keeps calling the docs search for
    questions the metrics tool should answer. Ask for the diagnosis, the description fix,
    a granularity judgment, the surface-size mitigation, and what to return vs. summarize.
    Include one multiple-response.
11. **Distractor autopsy** — expect stronger-model and system-prompt answers to
    description bugs.
12. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- MCP specifics → session 12
- Error responses and retries → session 13
- Context budgeting → session 14
- Enterprise tool governance → Tier 3 sessions 1 and 11
