# Headless Claude Code and CI/CD — F2 Claude Code Configuration & Workflows

**Exam weight: 20%**

## What this session assumes

Sessions 5–6 (configuration, hooks/skills/commands).

## Why this domain is worth 20% of your score

The F2 domain description names **CI/CD integration**, and one of the six scenario
archetypes is automated code review inside a pipeline. Non-interactive execution changes
the design constraints materially — no human to approve a permission prompt, no session
to resume, a hard time budget, and secrets handling that must survive audit. The exam
tests whether you know what breaks when you take the human out of the loop.

## Session focus

This session covers non-interactive Claude Code in a pipeline. The crux is that **removing the human removes the safety net every design decision was implicitly relying on** — no one approves a permission prompt, untrusted PR content lands in the context, and cost scales with PR volume. Spend the most time on the permission problem and the propose/act boundary, and let the learner reach least-privilege allowlisting themselves rather than being told. Ground the propose/act judgment in reversibility; that same rule returns in session 15 and in two scenario archetypes.

## Authoritative sources

**Non-interactive execution**
- <https://code.claude.com/docs/en/headless>
- <https://code.claude.com/docs/en/cli-reference>
- <https://platform.claude.com/docs/en/cli-sdks-libraries/cli/scripting>

**Pipeline integrations**
- <https://code.claude.com/docs/en/github-actions>
- <https://code.claude.com/docs/en/gitlab-ci-cd>
- <https://code.claude.com/docs/en/code-review>
- <https://code.claude.com/docs/en/github-actions-cloud-providers>

**Permissions and safety without a human present**
- <https://code.claude.com/docs/en/permission-modes>
- <https://code.claude.com/docs/en/permissions>
- <https://code.claude.com/docs/en/sandboxing>
- <https://code.claude.com/docs/en/devcontainer>

**Authentication in CI**
- <https://code.claude.com/docs/en/authentication>
- <https://platform.claude.com/docs/en/manage-claude/wif-providers/github-actions>

**Cost control**
- <https://code.claude.com/docs/en/costs>

## Teaching objectives

By the end, the learner can:

- Run Claude Code non-interactively and describe what changes: no interactive approval,
  output must be machine-consumable, and every permission decision is pre-declared
- Choose the right **permission mode** for CI and justify it — and explain why the
  convenient answer (allow everything) is the wrong one and what to do instead
- Design the **least-privilege allowlist** for a pipeline job: what the job actually needs
  and nothing more
- Explain why CI runs belong in a **sandbox** or container, and what escapes without one
- Handle authentication properly in CI — short-lived credentials and workload identity
  federation over long-lived API keys — and say why
- Structure output for a pipeline: exit codes, machine-readable results, and how to make
  a review comment or a failed check out of a run
- Set **cost and time bounds** so a runaway agent can't consume the budget, and explain
  what happens without them
- Decide what a pipeline agent may do autonomously vs. what it must only *propose*: post
  a review comment (safe, reversible) vs. push a commit or merge (not)
- Recognize why untrusted input in CI — a PR from a fork, an issue body — is a prompt
  injection surface, and what mitigations apply

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Interactive vs. headless | Is a human present to approve and steer? |
| Permission mode for CI | What's the blast radius if the model picks wrong? |
| Comment/propose vs. commit/merge | Is the action reversible without a human? |
| Long-lived key vs. federated identity | Does the credential outlive the job? |
| Sandbox vs. direct runner access | Could the job touch anything outside its workspace? |
| Run on every PR vs. on demand | What's the per-run cost times PR volume? |

## How to run this session

1. **Frame** — taking the human out of the loop removes the safety net that interactive use
   relies on. Every design decision in this session follows from that.
2. **Teach headless invocation.** Verify current flags against the CLI reference before
   naming any — do not recite flags from memory.
3. **Teach the permission problem** as the session's centerpiece. Ask: in interactive use,
   who catches a bad tool call? Then: who catches it in CI? Let the learner reach
   least-privilege allowlisting themselves before you name it.
4. **Teach sandboxing** — what a compromised or confused agent can reach on a bare runner.
5. **Teach CI authentication.** Ask them to argue against a long-lived API key in repo
   secrets; supply what they miss (rotation, blast radius, auditability, fork exposure).
6. **Teach the propose/act boundary.** Give six candidate pipeline actions and have them
   sort into "agent may do autonomously" vs. "agent may only propose", justifying on
   reversibility. This maps directly onto the code-review scenario archetype.
7. **Teach prompt injection in CI.** A PR body is untrusted input that lands in the
   context. Ask what a malicious PR description could attempt, and what limits the damage.
8. **Teach cost bounds** — per-run and aggregate, and the arithmetic of PR volume.
9. **Decision table** — walk all six rows.
10. **Scenario drill — 5 questions.** Use automated PR review on a repo taking outside
    contributions: ~200 PRs/week, a stated monthly ceiling, and one compliance requirement
    for audit trails. Ask about permission mode, the propose/act boundary, credential
    design, injection exposure, and cost control. Include one multiple-response.
11. **Distractor autopsy** — expect broad permissions chosen for convenience, and
    autonomous merge chosen because it's technically possible.
12. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Deep governance and compliance controls → Tier 3 sessions 10–11
- Cost optimization beyond bounding → Tier 3 session 9
- Org-wide rollout → Tier 4 capstone 1
- Enterprise gateways and self-hosted deployment → Tier 3 session 2
