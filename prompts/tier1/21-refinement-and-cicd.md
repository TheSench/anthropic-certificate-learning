# Iterative Refinement and CI/CD Integration — F2 Claude Code Configuration & Workflows

**Exam weight: 20%**

*Owns § 6 task statements 3.5 — Apply iterative refinement techniques for progressive
improvement — and 3.6 — Integrate Claude Code into CI/CD pipelines.*

## What this session assumes

Sessions 8, 11, 13, 19, and 20. From session 8: explicit criteria and few-shot prompting —
the input/output-examples technique in 3.5 is few-shot applied to a refinement loop rather
than to a single call, so name the continuity. From session 11: structured output via
schemas, which is what `--output-format json` and `--json-schema` enforce at the CLI. From
session 13: the review architecture — independent instances, multi-pass review, confidence
self-reporting. That material is *taught there*; this session uses only its conclusion and
applies it to a pipeline. From session 19: CLAUDE.md, which is how a CI-invoked run gets
project context. From session 20: plan mode and the command/skill surfaces.

This is the last Tier 1 teaching session, and it is the one that makes the S5 code-review
archetype drillable.

## Why this domain is worth 20% of your score

One of the twelve official sample items is keyed on **`-p`**, and its distractors are
**features that do not exist** — an invented `CLAUDE_HEADLESS=true` environment variable and
a `--batch` flag. That is a recall item, and it is the clearest signal in the sample set that
the CLI surface must be memorized exactly rather than reasoned about. The refinement half is
the opposite: 3.5 is pure technique-matching, where the scored skill is picking the move
that fits the failure you actually have. Both halves reward precision over fluency.

## Session focus

This session covers refining a result that is close but wrong (3.5) and running Claude Code non-interactively inside a pipeline (3.6). The crux is **session context isolation** — an instance reviewing its own code is weaker than an independent one, because it retains the reasoning that produced the code and is therefore least likely to question the decisions it just made. Session 13 taught that as review architecture; here it becomes a pipeline design constraint, and it is also the thread that ties the halves together, since both are about what a second look can and cannot see. Spend disproportionate time on the exact CLI flags — `-p` / `--print`, `--output-format json`, `--json-schema`, verified against the current reference — because that sample item's distractors are invented flags and only exact recall defeats them. Deliberately do *not* spend time on credentials, sandboxing, cloud CI configuration, or cost arithmetic: § 17 puts all four out of scope, and they served no task statement even when this material taught them.

## Authoritative sources

Verify every flag against the current CLI reference before naming it. Do not recite flags
from memory — the sample item punishes exactly that.

**Non-interactive execution and the CLI surface**
- <https://code.claude.com/docs/en/headless>
- <https://code.claude.com/docs/en/cli-reference>
- <https://platform.claude.com/docs/en/cli-sdks-libraries/cli/scripting>

**Review inside a pipeline**
- <https://code.claude.com/docs/en/code-review>
- <https://code.claude.com/docs/en/github-actions> — read for the invocation shape only, not
  for provider-specific configuration

**Project context for an automated run**
- <https://code.claude.com/docs/en/memory>

**Refinement technique**
- <https://code.claude.com/docs/en/best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>

## Teaching objectives

By the end, the learner can:

### Iterative refinement (3.5)

- Reach for **2–3 concrete input/output examples** when a prose description keeps being read
  differently than intended. Showing the transformation is the most effective way to
  communicate an expected transformation; a third paragraph of prose is not. Name the
  connection to session 8 — this is few-shot prompting inside a refinement loop
- Drive **test-driven iteration**: write a test suite first covering **expected behavior,
  edge cases, and performance requirements**, then iterate by handing back the failures.
  Treat performance as a first-class member of that list, not an afterthought — a suite that
  covers correctness and ignores latency or throughput will iterate to a passing, unusable
  result
- Use the **interview pattern**: have Claude ask *you* questions before it implements, to
  **surface considerations you had not anticipated** — cache invalidation, failure modes,
  concurrency — which is most valuable in a **domain you do not know well**, where you cannot
  write a complete specification because you do not know what is missing from it
- Decide how to deliver multiple problems: **all issues in a single message** when the fixes
  **interact**, because fixing one alone gets undone by the next; **sequential iteration**
  when the problems are **independent**, because a single message dilutes attention across
  unrelated work. Name the cost of getting it backwards in each direction

### CI/CD integration (3.6)

- Invoke Claude Code non-interactively with **`-p`** (equivalently **`--print`**) — the flag
  that makes a pipeline invocation possible at all. Know it by name and by both spellings,
  and know that there is no environment-variable or `--batch` equivalent
- Enforce machine-consumable results with **`--output-format json`** and **`--json-schema`**,
  so a downstream pipeline step parses a structure rather than scraping prose. Connect to
  session 11: this is the same schema-enforcement argument at the CLI boundary
- Give a CI-invoked run its project context through **CLAUDE.md** — the mechanism, since
  there is no human in the loop to explain the repo. Specifically, **document testing
  standards, what makes a test valuable, and the available fixtures in CLAUDE.md**, so
  generated tests match the project's conventions instead of inventing their own
- Name **session context isolation** as the reason the session that generated code is a weak
  reviewer of it: it retains the reasoning that produced the code, so it is least likely to
  question the decisions it just made. An **independent review instance**, without that
  context, catches more than a "review your work carefully" instruction does. Session 13
  teaches the review architecture; this session teaches the pipeline consequence — spawn a
  separate invocation for review
- Re-run a review after new commits without re-reporting what was already handled: **include
  the prior review findings in context** and **instruct Claude to report only new or
  still-unaddressed issues**. Without this, every re-run floods the PR with duplicate
  comments and the signal is lost
- Generate tests without duplicating what exists: **provide the existing test files in
  context** so test generation **avoids suggesting scenarios already covered**
- Decide what a pipeline run may do autonomously versus only propose, on reversibility:
  posting a review comment is reversible, pushing a commit or merging is not

**One-line aside, not drilled:** bounding a pipeline run's cost and wall-clock time is
sensible engineering, but § 17 excludes rate limiting, quotas, and pricing arithmetic. Say
"bound it" and do no arithmetic.

## Decisions the exam actually tests

Rebuilt around 3.5 and 3.6 only. Surface each as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| More prose vs. 2–3 input/output examples | Has the same description already been misread once? |
| Interview first vs. implement first | Do *you* actually know the requirements, or is this an unfamiliar domain? |
| Test-driven iteration vs. describe-and-retry | Are the failures repeatable and checkable by a suite? |
| One message vs. sequential fixes | Do the fixes interact, or are they independent? |
| Interactive vs. `-p` headless | Is a human present to approve and steer? |
| Prose output vs. `--output-format json` / `--json-schema` | Does a downstream step have to parse the result? |
| Same session vs. an independent review instance | Did this session write the code under review? |
| Full re-review vs. prior findings in context | Is this the first review of the PR, or a re-run after new commits? |

## How to run this session

1. **Frame** — two halves, one thread: what a second look can see. Name the sample item up
   front: one of the twelve is keyed on `-p`, with invented flags as distractors, so exact
   recall is the whole job on that half.
2. **Teach refinement as technique-matching, not a list.** Give four situations and have the
   learner pick the move before you name any technique:
   - a transformation described twice in prose and rendered differently both times
     (→ 2–3 input/output examples)
   - a function whose edge cases keep regressing (→ write the suite first, iterate on
     failures — and ask what belongs in the suite until they say performance)
   - a feature in a domain the learner does not know well (→ interview pattern; have Claude
     ask *them* the questions)
   - five review comments where two of the fixes interact (→ one message for those two,
     sequential for the rest)
   Make them justify each by naming the failure it addresses.
3. **Press on the interview pattern**, which learners skip as soft. Ask what question they
   would not have known to ask about a caching layer they have never built. That is the
   whole value.
4. **Pivot to CI. Verify the flags against the CLI reference live**, in front of the learner,
   before naming any. Then drill the flags cold: `-p` / `--print`, `--output-format json`,
   `--json-schema`. Then show the sample item's distractor shape — an invented
   `CLAUDE_HEADLESS=true` and a `--batch` flag — and ask how they would know those are not
   real. The answer is that they checked the reference, which is the habit being taught.
5. **Teach CLAUDE.md as the CI context mechanism.** Ask: the pipeline invokes Claude on a PR
   with no human to explain anything — how does it know this repo's testing standards? Then
   go concrete: testing standards, what makes a test valuable here, and which fixtures
   exist, all documented in CLAUDE.md. Connect back to session 19.
6. **Teach session context isolation.** Ask first: "the same session wrote the code — is it
   a good reviewer of it?" Draw out *why not* — it kept the reasoning that produced the code
   — then name the concept. Say plainly that session 13 taught the review architecture and
   that the pipeline consequence is what is new here: spawn an independent invocation.
   Do not re-teach multi-pass review or confidence self-reporting; if the learner is shaky
   on them, send them back to session 13 rather than covering it again.
7. **Teach the re-run problem**, which is the piece nobody has met. A PR gets three new
   commits and the review re-runs. What does the author see? Duplicate comments, unless the
   prior findings are in context with an instruction to report **only new or
   still-unaddressed** issues. Then the same move for test generation: existing test files
   in context so it does not propose scenarios already covered.
8. **Teach the propose/act boundary** briefly, on reversibility: comment vs. commit vs.
   merge. One exercise, not a segment.
9. **Decision table** — walk all eight rows, scenario-first.
10. **Scenario drill — 6 questions.** Use automated PR review on an active repo: a developer
    who has re-explained the same transformation three times, a batch of interacting fixes
    sent one at a time, a pipeline that must hand a structured result to the next job, a
    review re-running after new commits, and a proposal to have the generating session
    review its own output. Include one multiple-response. Write at least one item where the
    answer is a literal flag, since that is the sample item's shape.
11. **Distractor autopsy** — expect invented CLI flags accepted as real, "explain it again
    more clearly" chosen where examples or a test suite is the fix, "tell it to review its
    own work carefully" chosen over an independent instance, and sequential delivery chosen
    for interacting fixes.
12. Record per `.agents/TUTORIAL.md` Step 5. Glossary every flag, exactly as spelled.

## Out of scope

Defer and say where it's covered, and be firm about the § 17 exclusions — teaching them
costs twice, in time spent and in confidence that the time was well spent:

- **Credentials in CI** — short-lived credentials, workload identity federation, key
  rotation. § 17 excludes OAuth, API key rotation, and authentication protocol details. Not
  taught, not drilled, not mentioned as a "you should know."
- **Sandboxing and containers for CI runs** — § 17 excludes MCP deployment infrastructure,
  networking, and container orchestration, and cloud infrastructure generally. Cut.
- **Cloud-provider-specific CI configuration** (AWS, GCP, Azure) — explicitly out of scope
  in § 17. Read the GitHub Actions doc for the invocation shape only.
- **Cost and time arithmetic** — § 17 excludes rate limiting, quotas, and pricing
  calculations. One line: bound it. No arithmetic, no drill item.
- **Permission modes and prompt injection in CI** — named in neither § 6 nor § 17, and they
  serve no task statement this session owns. At most a sentence each if the learner raises
  them; no segment, no drill item.
- Multi-pass review, self-review limitations at the architecture level, independent
  instances, and confidence self-reporting → session 13, which owns task 4.6. Use only the
  conclusion here.
- Structured output schema design → session 11, already taught.
- CLAUDE.md hierarchy and scoping → session 19, already taught.
- Governance and compliance controls → Tier 3 sessions 10–11.
- Org-wide rollout → Tier 4 capstone 1.
