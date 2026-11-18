# Developer Productivity and Enablement — P7 Developer Productivity and Operational Enablement

**Exam weight: 8% · part of the 31% (P5–P7) that appears ONLY on Professional**

*Owns CCAR-P v1.1 § 5 task statements:*

- P7.1 — Packaging and Distributing Claude Code Workflows: Evaluating how to package and
  distribute a Claude Code workflow proven on one team across an organization, including
  plugin contents (skills, hooks, subagents, commands, MCP configuration), marketplace, and
  managed settings, and deciding which controls are enforced centrally versus left to teams
  so the workflow stays safe when it runs unattended.
- P7.2 — Agent SDK and Claude Code Configuration: Configuring the Claude Agent SDK or Claude
  Code (permission modes such as default, acceptEdits, plan, auto, dontAsk, and
  bypassPermissions; hooks; subagent definitions; headless or CI operation) to support a
  team workflow within stated safety and automation guardrails.
- P7.3 — Accountability for AI-Generated Code: Analyzing the review and accountability
  process of a team adopting AI-assisted development, and identifying the control that
  preserves human ownership of AI-generated code.

## What this session assumes

Tier 1 sessions 15 and 19–21 (hooks, CLAUDE.md, skills and plan mode, CI) and Tier 3 sessions 35,
37, and 38.

## Why this domain is worth 8% of your score

A small domain — roughly five scored items — so keep this session tight. But it's part of
the 31% absent from Foundations, and v1.1 made it concrete: all three objectives are
configuration and control decisions you can read off an artifact — a plugin manifest, a
settings file, a CI job definition, a team's review process. Foundations taught where a
setting lives; Professional asks which setting, enforced where, makes a workflow safe when
nobody is watching it run.

## Session focus

The crux is **"safe when it runs unattended"**: every P7 item turns on which control actually holds when no human is at the prompt, and which merely asks politely. For P7.1 that is the split between what managed settings enforce centrally and what a plugin merely ships for teams to adopt; for P7.2 it is choosing the permission mode, allow/deny rules, and hooks that match a stated automation guardrail — `bypassPermissions` outside an isolated container is the signature wrong answer, and `acceptEdits` is wrong in an unattended job only when the stated guardrail forbids what it auto-approves (unreviewed file changes or filesystem commands) — the headless docs use it legitimately for, say, lint fixes; for P7.3 it is the control that keeps a named human accountable for merged AI-generated code. Spend the most time on P7.2's six permission modes, because they're named verbatim in the guide and easy to confuse; verify their current behaviour from live docs first. Cut adoption metrics, chargeback, and enablement-path planning to a sentence — no v1.1 objective scores them.

## Authoritative sources

**Packaging and distribution (P7.1)**
- <https://code.claude.com/docs/en/plugins> · <https://code.claude.com/docs/en/plugins/manifest-reference>
- <https://code.claude.com/docs/en/plugins/marketplace-reference>
- <https://code.claude.com/docs/en/plugins/create-marketplace> · <https://code.claude.com/docs/en/plugins/host-marketplace>
- <https://code.claude.com/docs/en/managed-settings> · <https://code.claude.com/docs/en/admin-setup>
- <https://code.claude.com/docs/en/settings> · <https://code.claude.com/docs/en/managed-mcp>

**Configuration (P7.2)**
- <https://code.claude.com/docs/en/permission-modes> — the six modes, what none auto-approves
- <https://code.claude.com/docs/en/permissions> · <https://code.claude.com/docs/en/auto-mode-config>
- <https://code.claude.com/docs/en/agent-sdk/permissions> — SDK evaluation order, `canUseTool`
- <https://code.claude.com/docs/en/hooks> · <https://code.claude.com/docs/en/agent-sdk/hooks>
- <https://code.claude.com/docs/en/sub-agents> · <https://code.claude.com/docs/en/agent-sdk/subagents>
- <https://code.claude.com/docs/en/headless> · <https://code.claude.com/docs/en/github-actions> · <https://code.claude.com/docs/en/gitlab-ci-cd>
- <https://code.claude.com/docs/en/sandboxing>

**Accountability (P7.3)**
- <https://code.claude.com/docs/en/code-review>
- <https://code.claude.com/docs/en/best-practices>
- <https://code.claude.com/docs/en/security>

## Teaching objectives

By the end, the learner can:

**P7.1 — packaging and distribution**
- Name what a **plugin** can carry — skills, hooks, subagents, commands, MCP server
  configuration — and package a workflow proven on one team so another team gets it
  identically, rather than via documentation asking people to copy config
- Explain the **marketplace** as the distribution channel (a catalogue teams install from)
  and how an org controls which marketplaces and plugins are permitted
- Split **central enforcement from team choice**: managed settings enforce what must hold
  everywhere — deny rules, which marketplaces are allowed, whether bypass or auto mode is
  available, restricting hooks, permission rules, or MCP servers to managed ones; teams keep
  conventions, optional skills, and project settings. Verify current managed-setting names
  and precedence from live docs rather than quoting keys
- Apply the **unattended test**: a control that depends on someone reading a prompt, a
  README, or a CLAUDE.md instruction does not hold in an unattended run; a managed deny
  rule, a hook, or a sandbox boundary does

**P7.2 — Agent SDK and Claude Code configuration**
- Distinguish the **six permission modes** named in the guide by what runs without asking
  and what each is for. Verify the current mode set and behaviour from live docs; the shape:
  - `default` (shown as Manual in the UI) — asks before most edits, commands, and network;
    for sensitive or unfamiliar work. Also the starting mode for headless and SDK runs with
    no mode set, where anything needing approval is denied unless pre-approved
  - `acceptEdits` — auto-approves file edits and common filesystem commands; for
    iterating on code a human is reviewing
  - `plan` — read and analyse, no edits until a plan is approved; for exploration
  - `auto` — a classifier model reviews actions instead of a human; for long tasks with
    less prompt fatigue. Check availability by model, provider, and org setting
  - `dontAsk` — only pre-approved tools run; anything that would prompt is denied; for
    locked-down CI and scripts
  - `bypassPermissions` — skips prompts and checks; for isolated containers and VMs only
- Know that **modes set a baseline and rules layer on top**: deny rules block in every mode,
  including bypass; hooks and allow rules can approve or deny specific calls; some actions
  are never auto-approved in any mode. Verify the current evaluation order in the SDK
  permissions page
- Configure **hooks** as deterministic enforcement (block a command, run a check, log a
  call) rather than a prompt instruction the model may not follow
- Define **subagents** with their own tool allowlists, so a reviewer subagent can read but
  not write — the least-privilege principle (P3.1, session 41) applied in configuration
- Configure **headless or CI operation** to a stated guardrail: an exact allowlist in a
  non-interactive mode for a CI job; bypass only inside an isolated, non-root container;
  credentials scoped to the job. Match the mode to the guardrail, not to convenience

**P7.3 — accountability for AI-generated code**
- Identify the control that keeps a **named human accountable**: required human review and
  approval before merge (branch protection, code owners), with the submitting engineer as
  owner of record who must be able to explain the change
- Place **AI review** correctly — an aid that raises findings for the human reviewer, never
  the sole approver of AI-authored code; attribution in commits supports traceability but
  does not by itself assign ownership
- Reject the near-misses: a usage policy without an enforcement point, AI reviewing AI as
  the only gate, acceptance-rate dashboards, or banning the tool

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Central enforcement vs. team choice | Must it hold for every team and in unattended runs, or is it a convention? |
| Plugin distribution vs. documentation | Must every team actually have it, identically? |
| Managed setting vs. CLAUDE.md instruction | Does it need to be enforced, or only suggested? |
| `dontAsk` + allowlist vs. `bypassPermissions` in CI | Is the runner an isolated container, and is the tool set known in advance? |
| `acceptEdits` vs. `plan` vs. `default` | Is a human reviewing as it runs, exploring first, or approving each action? |
| `auto` vs. explicit allow rules | Can the action set be listed beforehand, and is a classifier acceptable to the guardrail? |
| Hook vs. prompt instruction | Would a missed instruction be materially harmful? |
| Human approval gate vs. AI review alone | Who is accountable when it ships? |

## How to run this session

1. **Frame** — small domain, tight session, but every item is a configuration you can read.
   Name the unattended test up front.
2. **Teach P7.1 packaging.** Give a workflow one team built — two skills, a pre-commit hook,
   a reviewer subagent, an MCP server — and have the learner package it, choose how it's
   distributed, and mark every control central or team-chosen. Then ask which of their
   central controls would still hold in a nightly unattended run.
3. **Teach the six permission modes.** Verify the permission-modes page first (it is large —
   extract the modes table rather than reading it whole). Give six team situations and have
   them assign a mode to each, then layer the deny rule or hook the guardrail still needs.
4. **Teach headless/CI configuration.** Show a CI job definition running with
   `bypassPermissions` on a shared runner and have them find the problem and rewrite it.
5. **Teach P7.3 accountability.** Describe a team where AI-generated PRs are approved by an
   AI reviewer and merged by a bot. Ask which single control restores human ownership.
6. **Decision table** — walk all rows.
7. **Scenario drill — 5 questions** (fewer, matching the domain's weight), standalone
   Professional format, each built on an artifact (settings file, plugin manifest, CI job,
   review-process description). Include a central-vs-team item, two permission-mode items
   (one CI, one interactive), a hooks-vs-instruction item, and an accountability item.
8. **Distractor autopsy** — expect `bypassPermissions` chosen for CI convenience on a
   non-isolated runner, safety controls shipped only as CLAUDE.md or README guidance,
   everything centralised including team conventions, and AI review offered as the
   accountability control.
9. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — absent from Foundations.

**End of Tier 3.** Tell the learner Tier 4 is four capstone sessions working full
architecture problems end to end, then the Professional mock gate. Report readiness across
all seven P domains and name the weakest two.

## Out of scope

- Adoption metrics, chargeback, champion programmes — v1.0 material no v1.1 objective scores
- Governance and compliance enforcement → sessions 37–38
- Least-privilege tool review in general → session 41 (P3.1)
- Claude Code configuration mechanics → Tier 1 sessions 15 and 19–21
