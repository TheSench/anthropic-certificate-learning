# Skills, Slash Commands, and Plan Mode — F2 Claude Code Configuration & Workflows

**Exam weight: 20%**

*Owns § 6 task statements 3.2 — Create and configure custom slash commands and skills — and
3.4 — Determine when to use plan mode vs direct execution.*

## What this session assumes

Sessions 2, 3, 14, and 19. From session 2: task decomposition, which is what plan mode
produces — a plan is a decomposition the developer gets to inspect before anything runs.
From session 3: subagent context isolation, which is the mechanism behind both `context:
fork` and the Explore subagent; if the learner cannot say why an isolated child context
protects the parent's window, teach that back before touching either. From session 14: tool
interfaces, since `allowed-tools` restricts a tool surface. From session 19: the CLAUDE.md
hierarchy, because the whole first half of this session is a contrast with it — skills are
the on-demand counterpart to the always-loaded file taught there.

## Why this domain is worth 20% of your score

Two of the twelve official sample items sit in this session's material — one keyed on
project-scoped `.claude/commands/` for team-wide availability, one keyed on plan mode for a
monolith-to-microservices migration — which is a high density for a single session. Both are
placement judgments rather than recall: *which* directory, and *whether to plan first*. The
distractors in both are things that would technically work and are simply the wrong call
under the stated constraints, which is the F2 house style.

## Session focus

This session covers the two developer-facing extension mechanisms — `.claude/skills/` and `.claude/commands/` — and the decision to plan before executing. The crux is that **skills are on-demand where CLAUDE.md is always-loaded, and `context: fork` runs a skill in an isolated sub-agent context so its output never pollutes the main conversation**. That second clause is the part everyone under-teaches: it is the same isolation idea session 3 established for subagents, arriving on a different surface, and connecting the two is what makes it stick rather than becoming a frontmatter flashcard. Spend disproportionate time there and on the 3.4 judgment — plan mode for large-scale, multi-approach, architectural, multi-file work; direct execution for a single well-scoped change — because the sample item's rationale rejects "start with direct execution" on the grounds of **costly rework**, and that phrase is the whole tell. Verify every frontmatter field and directory path against live docs before teaching it.

## Authoritative sources

Verify frontmatter fields, directory paths, and the current plan-mode and Explore behavior
against live docs. These change more than the concepts do.

**Skills**
- <https://code.claude.com/docs/en/skills>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>

**Slash commands**
- <https://code.claude.com/docs/en/commands>

**Plan mode, exploration, and the subagents behind them**
- <https://code.claude.com/docs/en/common-workflows>
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/best-practices>

**The tool surface `allowed-tools` restricts**
- <https://code.claude.com/docs/en/tools-reference>

## Teaching objectives

By the end, the learner can:

### Skills and slash commands (3.2)

- Place a slash command by scope and say what the scope buys: **`.claude/commands/`** is
  **project-scoped and shared via version control**, so every teammate who clones the repo
  gets the command; **`~/.claude/commands/`** is **user-scoped and personal**, living in the
  developer's home directory and reaching nobody else. This is the same
  committed-vs-not distinction session 19 drew for CLAUDE.md, and the sample item turns on
  choosing project scope for team-wide availability
- Author a skill in **`.claude/skills/`** with **`SKILL.md`** frontmatter, and name the three
  fields the appendix lists: **`context: fork`**, **`allowed-tools`**, **`argument-hint`**
- Explain **`context: fork`** properly, not as a flag but as an architecture: it runs the
  skill in an **isolated sub-agent context**, so the skill's intermediate output —
  everything it read, searched, and discarded — **never pollutes the main conversation**.
  Connect it explicitly to session 3: this is subagent context isolation, same mechanism,
  reached through a skill rather than through the Task tool
- Use **`argument-hint`** to **prompt the developer for the parameters the skill requires**,
  so an invocation that needs arguments advertises what it needs instead of failing or
  guessing
- Use **`allowed-tools`** to **restrict tool access during skill execution** — a
  least-privilege grant for the duration of the skill. Be precise about what it restricts:
  the guide scopes it to **tools only**. Do not describe it as restricting "tools or files";
  that overstates the mechanism and an exam item may key on the difference
- Keep a **personal variant of a team skill in `~/.claude/skills/` under a different name**,
  so experimenting with a modified version does not affect teammates who rely on the shared
  one. The different name is the point — it prevents a silent shadowing of the team's skill
- Choose between a **skill** and **CLAUDE.md**: a skill is **on-demand and task-specific**,
  loading only when the work calls for it; CLAUDE.md is **always-loaded universal
  standards**, paid for on every turn. Anything that applies to all work belongs in
  CLAUDE.md; a procedure needed occasionally belongs in a skill
- Choose between a **skill** (model-invoked, discretionary — the description decides when it
  fires) and a **slash command** (user-invoked, explicit — the developer decides)

### Plan mode vs. direct execution (3.4)

- Choose **plan mode** when the task is **large-scale**, has **multiple valid approaches**,
  involves an **architectural decision**, or requires **multi-file modifications** — and name
  each of those four triggers, because they are the criteria the task statement lists
- Choose **direct execution** for a **simple, well-scoped change** — the guide's own example
  is adding a single validation check to one function. Planning that is overhead, and a
  learner who answers "plan mode" to everything has not learned the discrimination
- Say what plan mode actually buys: it enables **safe codebase exploration and design before
  committing to changes**, so the approach is settled while nothing has been written —
  **preventing costly rework**. Give that phrase weight; it is the reason the sample item's
  "start with direct execution and refactor later" distractor is wrong
- Use the **Explore subagent** to **isolate verbose discovery output and return summaries**,
  so the search results, file listings, and dead ends stay in the child context and only the
  conclusion reaches the main conversation — **preserving main-conversation context** and
  **preventing context window exhaustion during multi-phase tasks**. Same isolation argument
  as `context: fork` and as session 3's subagents, third surface
- **Combine** the two modes rather than treating them as exclusive: plan mode for the
  investigation and design phase, then direct execution for the implementation once the
  approach is settled. The exam's framing is a sequence, not a fork in the road

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| `.claude/commands/` vs. `~/.claude/commands/` | Must teammates get it? Project scope is in version control; user scope is not |
| Skill vs. slash command | Should the *model* decide when it runs, or the *user*? |
| Skill vs. CLAUDE.md | Is it needed on every turn, or only when the task calls for it? |
| `context: fork` vs. running in the main context | Will the skill generate output the main conversation must not carry? |
| Plan mode vs. direct execution | Is the scope large, multi-file, architectural, or genuinely multi-approach — or is it one contained change? |
| Explore subagent vs. searching in the main context | Is the discovery output large enough to crowd out the work it was gathered for? |

## How to run this session

1. **Frame** — two sample items live here, and both are placement judgments. Say that, and
   say the session has two halves: what you package (3.2) and when you plan (3.4).
2. **Verify first.** Fetch the skills, commands, and workflow docs and confirm the directory
   paths and frontmatter field names before naming any of them.
3. **Open on the contrast with session 19.** CLAUDE.md is always-loaded; a skill is
   on-demand. Ask what "always-loaded" costs, and let them arrive at per-turn context spend.
   That is the axis the rest of the skills half hangs on.
4. **Teach the two command scopes** and drill the sample item's shape directly: a team wants
   a release-checklist command available to all 40 engineers. Which directory, and why?
   Make them say "because `.claude/commands/` is committed to version control." Then the
   inverse: a personal scratch command nobody else should see.
5. **Teach `SKILL.md` frontmatter field by field**, but spend the time unevenly.
   `argument-hint` and `allowed-tools` are quick — for `allowed-tools`, state the precision
   point out loud: it restricts **tools**, not files.
6. **Teach `context: fork` as the session's crux.** Ask first, before naming the field:
   "a skill that greps 300 files to find one answer — what does that do to your
   conversation?" Draw the answer out, then name the field, then connect it back to session
   3 explicitly: this is the same isolation you already know, on a different surface. If the
   learner cannot restate why isolation protects the parent's window, go back to session 3's
   argument before continuing.
7. **Teach the personal-variant pattern** — a modified copy in `~/.claude/skills/` under a
   **different name** — and ask what breaks if you keep the same name.
8. **Teach the skill vs. CLAUDE.md placement** with four candidates: a universal style rule,
   a quarterly release procedure, a security convention that applies to all code, and a
   database-migration walkthrough. Two belong in each.
9. **Pivot to plan mode.** Give the sample item's shape cold: a monolith being split into
   microservices. Ask for the approach and let them reach plan mode. Then make the argument
   explicit — multiple valid approaches, architectural, multi-file, large-scale — and name
   **costly rework** as what direct-execution-first risks.
10. **Teach the inverse immediately**, or they will over-plan everything: adding one
    validation check to one function. Plan mode here is pure overhead. Have them state the
    line between the two cases in their own words.
11. **Teach the Explore subagent.** This is new material for the learner and it is in the
    § 17 appendix, so do not skip it for time. Give a multi-phase task on an unfamiliar
    200-file service and ask what happens to the main context if every search result lands
    in it. Then name Explore as the answer: verbose discovery isolated in the child,
    **summaries** returned to the parent. Connect it to `context: fork` and to session 3 —
    three surfaces, one idea.
12. **Teach the combination.** Plan mode to investigate and design, direct execution to
    implement. Ask them to describe the migration from step 9 as a sequence across both.
13. **Decision table** — walk all six rows, scenario-first.
14. **Scenario drill — 6 questions.** Use a 40-engineer team on a large service: a
    release-checklist command that must reach everyone, a skill that produces heavy
    intermediate output, a developer wanting a private variant of a shared skill, a
    monolith-decomposition task, a one-line validation fix, and a multi-phase refactor where
    discovery output is exhausting the window. Include one multiple-response.
15. **Distractor autopsy** — expect `~/.claude/commands/` chosen for a team-wide command
    (the tell: personal scope is not in version control), "start with direct execution and
    refactor if needed" chosen for the architectural task (the tell: costly rework), plan
    mode chosen for the one-line fix, and `allowed-tools` described as restricting files.
16. Record per `.agents/TUTORIAL.md` Step 5. Glossary every directory path and frontmatter
    field, plus Explore subagent.

## Out of scope

Defer and say where it's covered:
- Hooks and the guarantee axis → session 15, already taught. If a learner proposes a skill
  for something that must happen every time, point back at that axis rather than re-teaching
  it — a skill is model-invoked, so it is on the *requested* side
- CLAUDE.md hierarchy, `@import`, `.claude/rules/` → session 19, already taught
- Iterative refinement and CI/CD, including headless invocation → session 21
- Subagent economics and the coordinator pattern in full → session 3, already taught. Here
  you only need the isolation property
- Plugins and marketplace distribution — not in § 6 or the § 17 appendix. One line at most,
  and no drill item
