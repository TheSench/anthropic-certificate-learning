# CLAUDE.md, Settings, and Precedence — F2 Claude Code Configuration & Workflows

**Exam weight: 20%**

## What this session assumes

Sessions 1–4 (F1). The learner has used Claude Code but may not have a precise model of
which configuration file wins when several disagree.

## Why this domain is worth 20% of your score

The F2 domain description names **CLAUDE.md hierarchy** and **path-scoped rules**
explicitly, and one of the six scenario archetypes is entirely about configuring Claude
Code for a team. Precedence questions are attractive to exam writers because there's
exactly one right answer and several plausible wrong ones. This is the most
memorization-heavy session in Tier 1 — and the one where stale knowledge hurts most, so
verify against live docs.

## Session focus

This session covers the CLAUDE.md hierarchy, settings precedence, and where a given rule belongs. It is the most memorization-dense session in Tier 1, and precedence questions have exactly one right answer — so verify the current hierarchy against live docs before teaching any of it. The crux is the **CLAUDE.md vs. settings distinction**: guidance the model may follow versus a constraint the harness enforces. Spend the most time on the placement exercise, because putting an enforceable requirement in CLAUDE.md is the signature wrong answer of this domain's scenario archetype.

## Authoritative sources

Fetch these and confirm exact file locations, key names, and precedence order before
teaching any of it.

**Memory and instruction files**
- <https://code.claude.com/docs/en/memory> — CLAUDE.md hierarchy, imports, auto memory

**Settings and precedence**
- <https://code.claude.com/docs/en/settings>
- <https://code.claude.com/docs/en/settings-reference>
- <https://code.claude.com/docs/en/settings-example>
- <https://code.claude.com/docs/en/env-vars>
- <https://code.claude.com/docs/en/model-config>

**Enterprise-managed configuration**
- <https://code.claude.com/docs/en/managed-settings>
- <https://code.claude.com/docs/en/server-managed-settings>
- <https://code.claude.com/docs/en/admin-setup>

**Permissions**
- <https://code.claude.com/docs/en/permissions>
- <https://code.claude.com/docs/en/permission-modes>

**Debugging configuration**
- <https://code.claude.com/docs/en/debug-your-config>

## Teaching objectives

By the end, the learner can:

- Lay out the full **CLAUDE.md hierarchy** — enterprise/managed, user-level, project root,
  and directory-scoped files — and state which applies where and how they combine
- Explain **path-scoped instructions**: a CLAUDE.md deeper in the tree governing work in
  that subtree, and why a monorepo needs this
- State the **settings precedence order** across managed, user, project, and local
  settings files, and predict the effective value when several set the same key
- Distinguish what belongs in CLAUDE.md (durable instructions the model should follow)
  from what belongs in settings (permissions, hooks, env, model config) — and why putting
  a hard constraint in CLAUDE.md is weaker than enforcing it in settings
- Explain **auto memory** and how it differs from an author-written CLAUDE.md
- Choose the right scope for a rule: personal preference, project convention, or
  org-wide mandate — and name what each choice implies about who can override it
- Explain why enterprise-managed settings exist and what they can enforce that a project
  file cannot
- Debug a config that isn't taking effect: which file is winning, and how to find out

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| CLAUDE.md vs. settings.json | Is it guidance for the model, or a constraint on the harness? |
| Project vs. user vs. managed scope | Who must be unable to override it? |
| Root CLAUDE.md vs. path-scoped | Does the rule apply to the whole repo or one subtree? |
| Committed settings vs. local settings | Should teammates inherit this, or is it personal? |
| Instruction vs. permission rule | Is compliance advisory, or must it be mechanically guaranteed? |

## How to run this session

1. **Frame** — this is the memorization-dense session, and precedence questions have exactly
   one right answer. Tell the learner you'll verify specifics against live docs as you go,
   and that they should do the same when studying.
2. **Verify first.** Fetch the memory and settings docs before teaching. State the
   hierarchy and precedence as the docs currently define them.
3. **Teach the CLAUDE.md hierarchy** by building it up one layer at a time, asking after
   each: if this layer and the one above disagree, who wins? Then give a monorepo with
   conflicting root and subtree files and have them predict the effective instruction set.
4. **Teach settings precedence** the same way. Then run a concrete exercise: three files
   set the same key to different values — what's effective, and how would you confirm it?
5. **Teach the CLAUDE.md vs. settings distinction** as the session's key judgment. Give
   five rules ("never commit to main", "always use pnpm", "block writes outside src/",
   "prefer functional style", "use Sonnet for this repo") and have the learner place each
   and justify it. At least one should belong in settings despite reading like guidance —
   that's the discrimination being taught.
6. **Teach managed settings** and the enforcement argument: guidance can be ignored by a
   model, permissions cannot.
7. **Decision table** — walk it, scenario-first.
8. **Scenario drill — 4 questions.** Use a 30-engineer monorepo with three teams, one
   compliance requirement that must not be overridable, and a per-team tooling difference.
   Ask which file gets which rule, predict an effective value under conflict, and identify
   why a rule isn't taking effect. Include one multiple-response.
9. **Distractor autopsy** — the classic temptation is putting an enforceable constraint in
   CLAUDE.md because it's easier to write. Name it.
10. Record per `.agents/TUTORIAL.md` Step 5. Glossary every file path and key name.

## Out of scope

- Hooks, skills, slash commands → session 6
- CI/CD and headless use → session 7
- MCP server configuration → session 12
- Org-wide rollout strategy and change management → Tier 4 capstone 1
