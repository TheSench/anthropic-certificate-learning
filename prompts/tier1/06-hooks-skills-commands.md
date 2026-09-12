# Hooks, Skills, and Slash Commands — F2 Claude Code Configuration & Workflows

**Exam weight: 20%**

## What this session assumes

CLAUDE.md & Settings (configuration hierarchy and precedence).

## Why this domain is worth 20% of your score

"When a hook beats a system-prompt instruction" is a documented exam question type, and
the F2 domain description names **custom skills with context restrictions**. These three
extension mechanisms overlap enough to be confusable and differ in one decisive way:
whether the behavior is *guaranteed* or *requested*. That's the axis the exam tests.

## Session focus

This session covers the three extension mechanisms — hooks, skills, slash commands — plus plugins for distribution. They overlap enough to be confusable and differ in one decisive way. The crux is the **guarantee axis**: a hook is harness-enforced code that runs deterministically; a skill or instruction is context the model may or may not act on. Teach that axis before any mechanism detail, and land it hard — "when a hook beats a system-prompt instruction" is a documented exam question type. Verify event names and frontmatter fields against live docs; don't recite them from memory.

## Authoritative sources

Verify event names, frontmatter fields, and file locations against live docs — these
change more than most.

**Hooks**
- <https://code.claude.com/docs/en/hooks> — event reference
- <https://code.claude.com/docs/en/hooks-guide> — patterns

**Skills**
- <https://code.claude.com/docs/en/skills>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>

**Slash commands and output shaping**
- <https://code.claude.com/docs/en/commands>
- <https://code.claude.com/docs/en/output-styles>

**Packaging and distribution**
- <https://code.claude.com/docs/en/plugins>
- <https://code.claude.com/docs/en/plugins-reference>
- <https://code.claude.com/docs/en/plugin-marketplaces>

**Tools the mechanisms act on**
- <https://code.claude.com/docs/en/tools-reference>

## Teaching objectives

By the end, the learner can:

- State the decisive difference: a **hook** is harness-enforced code that runs
  deterministically on an event; a **skill** or **instruction** is context the model may
  or may not act on
- Name the practical consequence: anything that must happen every time — formatting,
  secret scanning, blocking a path, audit logging — belongs in a hook, not a prompt
- Describe the hook event surface by its event names — **`PostToolUse`** and its
  siblings firing before/after tool use, on session lifecycle, and on stop — and how a
  hook can *block* or intercept a tool call rather than just react to it
- Explain what a **skill** is: a packaged, model-invoked procedure with a description
  that governs when it triggers — and why the description is the load-bearing part
- Explain **skill context restrictions** — limiting which tools or files a skill may touch
  — and why that matters for least-privilege
- Read and write `SKILL.md` frontmatter by field: **`context: fork`** (run in an isolated
  child context), **`allowed-tools`** (least-privilege tool grant), and
  **`argument-hint`** (how the skill advertises its arguments)
- Distinguish a **slash command** (user-invoked, explicit, `.claude/commands/`) from a
  **skill** (model-invoked, discretionary, `.claude/skills/`) and choose between them,
  including the project-vs-user scope decision for each
- Choose among hook / skill / slash command / CLAUDE.md instruction for a given
  requirement, and justify it on the guarantee axis
- Explain how **plugins** package these for distribution across a team, and why that
  beats copy-pasting configuration
- Recognize the anti-pattern of a hook doing model-judgment work, and of an instruction
  doing enforcement work

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Hook vs. CLAUDE.md instruction | Must it happen *every* time, or is compliance advisory? |
| Hook vs. skill | Is the trigger a mechanical event, or a judgment about relevance? |
| Skill vs. slash command | Should the model decide when to run it, or the user? |
| Skill vs. subagent | Is it a procedure to follow, or work to delegate for context reasons? |
| Blocking hook vs. after-the-fact check | Is the action's damage reversible? |
| Plugin vs. per-repo config | Do multiple repos or teams need the same thing? |

## How to run this session

1. **Frame** — name that hook-vs-instruction is a known exam question type, and that the
   deciding axis is *guarantee*, not convenience.
2. **Verify the hook event list** against live docs before teaching it. Don't recite event
   names from memory.
3. **Teach the guarantee axis first**, before any mechanism detail. Ask: "you must never
   let a secret reach a commit — instruction or hook?" Then: "you'd like commit messages
   to follow a convention — instruction or hook?" Make the axis land before adding detail.
4. **Teach hooks** — events, blocking vs. observing, and what the hook receives. Ask them
   to predict which event fires for a given requirement.
5. **Teach skills**, emphasizing the description as the trigger mechanism. Have the learner
   write a skill description, then critique it: would it fire when needed and stay quiet
   otherwise? Over-broad descriptions are the common defect.
6. **Teach context restrictions** and connect them to least-privilege.
7. **Teach slash commands** and the user-invoked vs. model-invoked distinction.
8. **Teach plugins** as the distribution answer.
9. **Placement exercise** — give six requirements and have the learner place each mechanism
   and justify on the guarantee axis. Include one that seems like a hook but needs judgment
   (so it's a skill), and one that reads like guidance but must be enforced (so it's a hook).
10. **Decision table** — walk all six rows.
11. **Scenario drill — 5 questions.** Use a platform team standardizing 40 engineers:
    mandatory secret scanning, a preferred-but-optional review checklist, a repeated
    multi-step release procedure, and per-team variation. Include one multiple-response.
12. **Distractor autopsy** — expect "write it in CLAUDE.md" chosen for enforcement needs.
13. Record per `.agents/TUTORIAL.md` Step 5. Glossary every event name and frontmatter field.

## Out of scope

- CI/CD integration → Claude Code & CI/CD
- MCP servers as an extension mechanism → MCP Integration
- Team rollout and adoption → Tier 3 session 16, Tier 4 capstone 1
