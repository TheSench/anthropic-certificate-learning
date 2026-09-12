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
- Use hooks for the **three distinct jobs** they do, not just the blocking one:
  - **Enforcement** — intercept an outgoing call and refuse it when it violates a rule
    (a refund above a stated threshold), redirecting to an alternative path such as human
    escalation rather than simply failing
  - **Prerequisite gating** — block a downstream tool until an upstream step has actually
    completed, so a required *ordering* is guaranteed rather than requested. The canonical
    case: block a refund until customer verification has returned a verified ID. When
    identity must precede a financial operation, a prompt instruction has a non-zero
    failure rate and a gate has none — that gap is the whole point
  - **Normalization** — a `PostToolUse` hook transforming results *before* the model reads
    them, so heterogeneous formats from different backends (Unix timestamps vs. ISO 8601,
    numeric status codes vs. strings) arrive consistent. The model never sees the mess,
    and no prompt has to explain it
- State the general rule these share: when a requirement is **deterministic compliance**,
  it belongs in code on the event path — prompt instructions are probabilistic, and
  "usually complies" is not a control
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
- Drive **iterative refinement** deliberately when a first attempt is close but wrong,
  choosing the technique that matches the failure:
  - **2–3 concrete input/output examples** when a prose description keeps being read
    differently than intended — showing the transformation beats describing it again
  - **Test-driven iteration** — write the suite first (expected behavior, edge cases,
    performance), then iterate by handing back the failures
  - **The interview pattern** — have Claude ask *you* questions before it implements, to
    surface considerations you hadn't thought to specify (cache invalidation, failure
    modes) in a domain you don't know well
- Decide how to deliver multiple problems: **all in one message** when the fixes interact
  (fixing one alone would be undone by the next), **one at a time** when they're
  independent — and name the cost of getting this backwards

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Hook vs. CLAUDE.md instruction | Must it happen *every* time, or is compliance advisory? |
| Hook vs. skill | Is the trigger a mechanical event, or a judgment about relevance? |
| Skill vs. slash command | Should the model decide when to run it, or the user? |
| Skill vs. subagent | Is it a procedure to follow, or work to delegate for context reasons? |
| Blocking hook vs. after-the-fact check | Is the action's damage reversible? |
| Prerequisite gate vs. prompt instruction | Must the ordering hold *every* time, or usually? |
| Normalize in a hook vs. explain in the prompt | Is the inconsistency mechanical, or a judgment? |
| Plugin vs. per-repo config | Do multiple repos or teams need the same thing? |
| More prose vs. input/output examples | Has the same description already been misread once? |
| Interview first vs. implement first | Do *you* know what the requirements actually are? |
| One message vs. sequential fixes | Do the fixes interact, or are they independent? |

## How to run this session

1. **Frame** — name that hook-vs-instruction is a known exam question type, and that the
   deciding axis is *guarantee*, not convenience.
2. **Verify the hook event list** against live docs before teaching it. Don't recite event
   names from memory.
3. **Teach the guarantee axis first**, before any mechanism detail. Ask: "you must never
   let a secret reach a commit — instruction or hook?" Then: "you'd like commit messages
   to follow a convention — instruction or hook?" Make the axis land before adding detail.
4. **Teach hooks** — events, blocking vs. observing, and what the hook receives. Ask them
   to predict which event fires for a given requirement. Then cover all three jobs, since
   most learners only have the blocking one: enforcement, **prerequisite gating**, and
   **normalization**. For gating, use the ordering case — an agent that sometimes calls
   the refund tool before verifying identity — and ask for the fix; if they reach for a
   firmer prompt or few-shot examples, ask what the failure rate of that is versus a gate.
   For normalization, give three backends returning timestamps three ways and ask where
   that gets reconciled: a `PostToolUse` hook, before the model ever sees it.
5. **Teach skills**, emphasizing the description as the trigger mechanism. Have the learner
   write a skill description, then critique it: would it fire when needed and stay quiet
   otherwise? Over-broad descriptions are the common defect.
6. **Teach context restrictions** and connect them to least-privilege.
7. **Teach slash commands** and the user-invoked vs. model-invoked distinction.
8. **Teach plugins** as the distribution answer.
9. **Teach iterative refinement** as the other half of working in Claude Code — the
   mechanisms above shape *what it knows*; this is what you do when a result is close but
   wrong. Run it as technique-matching, not a list: give four situations and have the
   learner pick the move. A transformation described twice and rendered differently both
   times (→ 2–3 input/output examples, not a third paragraph of prose). A function whose
   edge cases keep regressing (→ write the suite first, iterate on failures). A feature in
   a domain the learner doesn't know well (→ interview pattern: have Claude ask *them*
   questions first). Five review comments where two of the fixes interact (→ one message
   for those two, sequential for the rest). Make them justify each choice by naming the
   failure it addresses.
10. **Placement exercise** — give six requirements and have the learner place each mechanism
   and justify on the guarantee axis. Include one that seems like a hook but needs judgment
   (so it's a skill), and one that reads like guidance but must be enforced (so it's a hook).
11. **Decision table** — walk all eleven rows.
12. **Scenario drill — 7 questions.** Use a platform team standardizing 40 engineers:
    mandatory secret scanning, a preferred-but-optional review checklist, a repeated
    multi-step release procedure, and per-team variation. Add one refinement item — a
    developer who has re-explained the same transformation three times in prose, or a
    batch of interacting fixes sent one at a time. Add one where a required tool *ordering*
    is being enforced by prompt text. Include one multiple-response.
13. **Distractor autopsy** — expect "write it in CLAUDE.md" chosen for enforcement needs,
    "explain it again more clearly" where examples or a test suite is the fix, and
    few-shot examples offered where a prerequisite gate is the only real guarantee.
14. Record per `.agents/TUTORIAL.md` Step 5. Glossary every event name and frontmatter field.

## Out of scope

- CI/CD integration → Claude Code & CI/CD
- MCP servers as an extension mechanism → MCP Integration
- Team rollout and adoption → Tier 3 session 16, Tier 4 capstone 1
