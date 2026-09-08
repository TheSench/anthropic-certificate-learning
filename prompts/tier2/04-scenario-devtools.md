# Scenario: Developer Productivity Tooling — S4

**Foundations scenario archetype 4 of 6 · primary domains F2, F4**

## What this session is

An **exam-difficulty drill** on the developer-productivity-tooling archetype. Not a
teaching session — Tier 1 sessions 5–6 and 11–13 taught this. Teach only on a miss.

The archetype's signature theme is **reuse over reinvention**: the exam rewards knowing
which built-in tool, skill, or platform capability already does the job. Before drilling,
verify the current built-in tool surface (`code.claude.com/docs/en/tools-reference`,
`.../skills`, `platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools`) so no
question asserts a stale capability.

## Format

1. **Scenario brief** (250–400 words) with the deciding constraints.
2. **12–15 questions**, mixed multiple-choice and multiple-response ("Select all that apply").
3. Batches of 4–5; feedback only at batch end.
4. Full distractor autopsy on every question.
5. Domain mix: ~6 F2, ~5 F4, ~2 F1, ~2 F5.

## Building the scenario brief

Fresh each run. Must include:

- An **internal developer tool** serving a specific engineering workflow (onboarding,
  incident response, dependency upgrades, code search, release management)
- **A number of engineers** and adoption expectations
- **Several existing systems** to integrate — a mix where some should be MCP servers, some
  custom tools, and at least one where a **built-in already suffices**
- A **repeated procedure** that should be a skill
- A **mandatory** behavior and a **preferred** behavior
- A **credential or data-sensitivity** consideration
- A stated **current failure** — e.g. the assistant keeps choosing the wrong tool among
  several overlapping ones

That last item is the archetype's signature question: a tool-description bug, not a model
problem.

## Question coverage

At least once each:

- Diagnosing a tool-selection failure to its real cause
- Rewriting a tool description so it disambiguates against a sibling
- Tool granularity: few broad vs. many narrow, under a stated tool-count context
- Custom tool vs. MCP server vs. built-in
- MCP transport and configuration scope for a specific integration
- The trust analysis for a third-party MCP server
- Skill vs. slash command vs. hook for a stated requirement
- Context cost of a large tool surface, and the mitigation
- Tool error classification and where the retry belongs
- Whether a tool should return full payload or a summary
- One question where **two designs are defensible** and a stated constraint decides it

## Known traps to build distractors from

- Building a custom tool where a built-in or server tool already does it
- "Use a stronger model" or "improve the system prompt" for a tool-description bug
- Connecting every MCP server rather than scoping per task
- A third-party server accepted without a trust analysis
- Personal config scope where an org mandate is required
- Overlapping tool descriptions left mutually ambiguous
- Model-loop retries for transient tool failures
- Returning full payloads that bloat the parent's context

## Distractor autopsy requirements

Per question: correct answer plus deciding principle; per wrong option, the temptation and
the ruling tell; per miss, the named trap.

For tool-selection questions, make the learner state **what in the description** causes
the misfire. "The description is bad" is not an answer; the exam wants the mechanism.

## How to run this session

1. **Frame** — drill format, batch feedback, closed-book. Note the reuse theme.
2. Verify the built-in tool surface from live docs before writing questions.
3. Present the brief; scenario-clarifying questions only.
4. Run the batches with autopsies.
5. **Final scoring:**

   ```
   S4 Developer Productivity Tooling — [N]/[total] ([%])
   F2 [n]/[n] · F4 [n]/[n] · F1 [n]/[n] · F5 [n]/[n]
   ```

6. Name the two most transferable weaknesses.
7. Record per `.agents/TUTORIAL.md` Step 5. Misses become drill cards; update F2 and F4
   readiness. Log any doc discrepancy found while verifying.

## Out of scope

No new teaching. Genuine gaps get queued as review sessions.
