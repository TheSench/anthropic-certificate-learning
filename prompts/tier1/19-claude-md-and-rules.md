# CLAUDE.md Hierarchy and Path-Specific Rules — F2 Claude Code Configuration & Workflows

**Exam weight: 20%**

*Owns § 6 task statements 3.1 — Configure CLAUDE.md files with appropriate hierarchy,
scoping, and modular organization — and 3.3 — Apply path-specific rules for conditional
convention loading.*

## What this session assumes

Sessions 1 and 14. From session 1: harness vs. model, and that instructions are context the
model may or may not act on — CLAUDE.md is exactly that, which is why its *scope* rather
than its wording is what the exam tests. From session 14: that a description the model reads
is a prompt, which is the same claim applied to a different surface. Nothing in F2 before
this session is required; this is the first F2 session in the sequence.

## Why this domain is worth 20% of your score

The F2 domain description names **CLAUDE.md hierarchy** and **path-scoped rules**
explicitly, and one of the six scenario archetypes — Claude Code team configuration — is
built on them. These questions are attractive to exam writers because there is exactly one
right answer and several plausible wrong ones, and because the interesting failures are
*organizational*: a teammate who does not get an instruction, a convention that loads in the
wrong directory, a monolithic file nobody maintains. The scored skill is diagnosis by scope,
not recall of file paths.

## Session focus

This session covers where an instruction lives and when it loads: the three-level CLAUDE.md hierarchy, `@import` for modular composition, and `.claude/rules/` with glob-pattern `paths` frontmatter for conditional loading. The crux is that **configuration scope is the diagnosis** — user-level `~/.claude/CLAUDE.md` is not shared via version control, so a teammate silently misses it, and that single fact is the named diagnostic the guide reaches for. Spend disproportionate time there and on the path-scoping choice in 3.3, where the deciding question is whether a convention is *directory-bound* or *spread across the codebase*. Do not turn this into a precedence-memorization session: settings files and their precedence order are real Claude Code knowledge but appear nowhere in the § 6 task statements or the § 17 appendix, so they get one labelled aside and no drill items. Verify the current hierarchy and frontmatter fields against live docs before teaching either.

## Authoritative sources

Fetch these and confirm exact file locations and frontmatter field names before teaching
any of it.

**The hierarchy, imports, in-session memory, and path-scoped rules** — one page settles
all of task 3.1 and most of 3.3: the CLAUDE.md hierarchy, `@import`, `/memory`, and
`.claude/rules/` with its frontmatter
- <https://code.claude.com/docs/en/memory>

**Confirming file locations**
- <https://code.claude.com/docs/en/settings> — only to confirm paths for the aside

**Diagnosing what actually loaded**
- <https://code.claude.com/docs/en/debug-your-config>

## Teaching objectives

By the end, the learner can:

- Lay out the **three-level CLAUDE.md hierarchy** by path and say what each level is for:
  **user** — `~/.claude/CLAUDE.md`, personal, applies across all the developer's projects;
  **project** — `.claude/CLAUDE.md` or a root `CLAUDE.md`, committed and team-wide;
  **directory-level** — a CLAUDE.md in a subdirectory, governing work in that subtree
- State the fact the exam's named diagnostic turns on: **user-level instructions are not
  shared with teammates via version control**. `~/.claude/CLAUDE.md` lives in the
  developer's home directory, so it is never committed and never reaches anyone else
- Run that diagnostic from the symptom: **a new team member is not receiving instructions
  because they are in user-level rather than project-level configuration**. Recognize the
  scenario shape — "it works for me but not for the new hire" — and name the fix as moving
  the instruction to project scope, not as rewording it
- Use **`@import`** to reference external files so CLAUDE.md stays modular instead of
  monolithic — and give the guide's specific use: in a monorepo, **selectively including the
  relevant standards files in each package's CLAUDE.md**, chosen on the maintainer's domain
  knowledge of what that package actually needs, rather than importing everything everywhere
- Use **`/memory`** diagnostically, which is the framing the guide gives it: verify **which
  memory files are actually loaded**, and **diagnose inconsistent behavior across sessions**
  by finding what was or was not picked up. It is an inspection tool before it is an editor
- Use **`.claude/rules/`** as an **alternative to a monolithic CLAUDE.md**: split
  conventions into separate rule files rather than growing one file nobody reads
- Write a rule file with **YAML frontmatter** whose **`paths`** field carries glob patterns —
  name the field, since "YAML frontmatter" alone is not an answer an exam item can key on —
  e.g. `paths: ["terraform/**/*"]` for infrastructure conventions, or `**/*.test.tsx` for
  test-file conventions
- Explain **why** path-scoped rules matter beyond tidiness: they **load only when files
  matching the glob are being edited**, so irrelevant conventions never enter the context.
  That **reduces irrelevant context and token usage** on every unrelated turn — a monolithic
  CLAUDE.md pays for all its conventions all the time
- Choose **path-specific rules over subdirectory CLAUDE.md files** when a convention must
  apply to files **spread across multiple directories**. Name the deciding property: a
  subdirectory CLAUDE.md is **directory-bound** — it governs a subtree and nothing else — so
  it cannot express "every `*.test.tsx` anywhere in the repo" or "every Terraform file
  wherever it lives". A glob can
- Place a given convention correctly across all four surfaces — user CLAUDE.md, project
  CLAUDE.md, directory CLAUDE.md, `.claude/rules/` — and justify it on who needs it, where
  the files live, and whether teammates must inherit it

**Labelled aside, not drilled:** `settings.json` and its precedence across managed, user,
project, and local files is real Claude Code knowledge and worth one minute — but it appears
in neither § 6 Domain 3 nor the § 17 appendix, so it is not scored. Mention that settings
constrain the harness while CLAUDE.md instructs the model, note that an enterprise/managed
layer exists above the three CLAUDE.md levels the appendix names, and move on. Write no
drill item on precedence order.

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| User vs. project CLAUDE.md | Must teammates inherit it? If yes it cannot be user-level — it is not in version control |
| Root CLAUDE.md vs. directory-level | Does the rule govern the whole repo, or one subtree? |
| `.claude/rules/` glob vs. directory CLAUDE.md | Are the affected files in one directory, or spread across the codebase? |
| `.claude/rules/` vs. one growing CLAUDE.md | Would every turn pay for conventions most turns don't need? |
| `@import` vs. duplicating text | Is the same standard needed by several packages that each need a *different* subset? |

## How to run this session

1. **Frame** — F2's archetype is team configuration, and the interesting failures are
   organizational. Say up front that this session is about *scope*, not about writing better
   instructions, and that precedence tables are deliberately not the focus.
2. **Verify first.** Fetch the memory doc and confirm the hierarchy levels and the rule
   frontmatter field names as the docs currently define them. Say you are doing this.
3. **Teach the three levels** by building them up one at a time — user, project,
   directory — asking after each: who else gets this, and how? The answer for user-level is
   the one that matters: nobody, because it is not in version control.
4. **Run the diagnostic cold, before teaching it as a rule.** Hand them the symptom with no
   framing: "your team's conventions are being followed in your sessions; a developer who
   joined last week is not getting them, and her setup is otherwise identical." Let them
   work to it. Then name it as the guide's own diagnostic and make them repeat the causal
   chain: user-level → home directory → not committed → teammate never sees it.
5. **Teach `@import`** with the monorepo case specifically. Give four packages and five
   standards files, and have the learner decide which package imports which — the point is
   *selective* inclusion driven by what the maintainer knows that package needs, not
   importing the whole set into each.
6. **Teach `/memory` as a diagnostic.** Give the symptom "Claude behaves differently in two
   sessions on the same repo" and ask how they would find out what differed. `/memory` is
   how you see which files actually loaded.
7. **Teach `.claude/rules/` in two moves.** First as an *alternative to a monolithic
   CLAUDE.md* — splitting rather than growing. Then the `paths` frontmatter field with real
   globs: write out `paths: ["terraform/**/*"]` and `**/*.test.tsx` and have them read each
   aloud as "loads only when…". Make them state the payoff themselves: conventions that
   don't match never enter the context, so irrelevant tokens aren't spent.
8. **Teach the 3.3 judgment call**, which is the highest-value five minutes of the session.
   Give a convention that must apply to every `*.test.tsx` in a repo where tests live beside
   their components in a dozen directories. Offer a subdirectory CLAUDE.md as the tempting
   answer and make them say why it fails: it is **directory-bound**, and the files are
   spread. Then give the inverse — a convention genuinely confined to one service directory
   — so the rule does not collapse into "always use globs."
9. **Placement exercise.** Six conventions, four surfaces. Include one personal preference
   that correctly belongs at user level, one team standard that is wrongly at user level
   (the diagnostic again), one directory-bound rule, and one cross-cutting rule needing a
   glob.
10. **Decision table** — walk all five rows, scenario-first.
11. **Scenario drill — 5 questions.** Use a 30-engineer monorepo with four packages: a new
    hire not receiving team conventions, Terraform files under several service directories,
    test conventions for files spread beside their components, and a CLAUDE.md that has
    grown past what anyone reads. Ask which file gets which rule, name the field that scopes
    a rule file, and diagnose one instruction that is not taking effect. Include one
    multiple-response. Write no item on settings precedence.
12. **Distractor autopsy** — expect a subdirectory CLAUDE.md offered for a cross-cutting
    convention (the tell: the files are spread, and a directory file is directory-bound),
    and "reword the instruction so it's clearer" offered for the new-hire symptom, where the
    instruction is fine and the scope is wrong.
13. Record per `.agents/TUTORIAL.md` Step 5. Glossary every file path and frontmatter field.

## Out of scope

Defer and say where it's covered:
- Skills, slash commands, and plan mode → session 20
- Iterative refinement and CI/CD, including CLAUDE.md's role in CI → session 21
- Hooks as the enforcement mechanism → session 15, already taught. If a learner proposes
  CLAUDE.md for something that must hold every time, point back at the guarantee axis rather
  than re-teaching it
- MCP server configuration → session 17, already taught
- `settings.json` precedence, enterprise-managed settings, permission modes → one labelled
  aside as described above; deeper governance is Tier 3 sessions 10–11
- Org-wide rollout and change management → Tier 4 capstone 1
