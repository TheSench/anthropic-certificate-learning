# Developer Productivity and Enablement — P7 Developer Productivity & Operational Enablement

**Exam weight: 7% (smallest Professional domain) · part of the 35% that appears ONLY on Professional**

## What this session assumes

Tier 1 sessions 5–7 (Claude Code configuration, hooks/skills, CI) and Tier 3 sessions
10–13.

## Why this domain is worth 7% of your score

The smallest Professional domain, so keep this session tight — the exam weight says four
questions or so. But it's still part of the 35% missing from Foundations, and it's cheap to
learn: the material is organizational rather than technical. It covers rolling Claude out
to a team and operating it — enablement, standardization, measurement, and support.

## Authoritative sources

**Rollout and adoption**
- <https://code.claude.com/docs/en/admin-setup>
- <https://code.claude.com/docs/en/champion-kit>
- <https://code.claude.com/docs/en/communications-kit>
- <https://code.claude.com/docs/en/best-practices>
- <https://code.claude.com/docs/en/setup>

**Standardization and distribution**
- <https://code.claude.com/docs/en/managed-settings>
- <https://code.claude.com/docs/en/plugins>
- <https://code.claude.com/docs/en/plugin-marketplaces>
- <https://code.claude.com/docs/en/skills>
- <https://code.claude.com/docs/en/memory>

**Measurement**
- <https://code.claude.com/docs/en/analytics>
- <https://code.claude.com/docs/en/monitoring-usage>
- <https://code.claude.com/docs/en/costs>
- <https://platform.claude.com/docs/en/manage-claude/claude-code-analytics-api>
- <https://platform.claude.com/docs/en/manage-claude/analytics-api>

**Support and troubleshooting**
- <https://code.claude.com/docs/en/troubleshooting>
- <https://code.claude.com/docs/en/debug-your-config>
- <https://code.claude.com/docs/en/feature-availability>

## Teaching objectives

By the end, the learner can:

- Plan a **staged rollout**: pilot team, measured results, champions, expansion — and say
  why a big-bang rollout to an untrained org produces low adoption and bad habits
- Choose what to **standardize versus leave to teams**: mandatory security and compliance
  configuration centrally, conventions per team — and connect this to the managed-settings
  vs. project-settings decision from Tier 1 session 5
- Distribute organizational capability with **plugins, shared skills, and settings**, rather
  than documentation asking people to copy config
- Choose **adoption and productivity metrics** that resist gaming, and explain why volume
  metrics (messages sent, lines accepted) measure activity rather than value — while
  outcome metrics (cycle time, review turnaround, incident resolution) are harder but real
- Design **cost attribution and chargeback** so teams see their own spend, and explain why
  visibility changes behavior more than caps alone
- Build the **enablement path**: onboarding material, worked examples in the org's own
  codebase, an internal support channel, and a named owner
- Anticipate the **failure modes of adoption**: developers who don't trust it, developers
  who over-trust it, unreviewed AI-authored code, and habits that bypass the guardrails
- Set **usage policy** that's practical: what Claude may be used for, what requires review,
  and what's prohibited — and connect it to sessions 10–11's enforcement points
- Support the deployment operationally: triaging user reports, diagnosing configuration
  problems, and knowing what's a feature-availability difference rather than a bug
- Report enablement results to leadership honestly, including what didn't work — connecting
  to session 12

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Central standard vs. team autonomy | Is it a compliance requirement or a convention? |
| Plugin/skill distribution vs. documentation | Must every team actually have it, identically? |
| Activity metric vs. outcome metric | Are you measuring value or motion? |
| Spend visibility vs. hard caps | Do you need behavior change or a hard stop? |
| Staged pilot vs. org-wide launch | Is the configuration and enablement path proven yet? |
| Policy plus enforcement vs. policy alone | Would non-compliance be materially harmful? |

## How to run this session

1. **Frame** — the smallest domain, so this session stays tight. Note it's still part of the
   35% absent from Foundations, and it's inexpensive to learn.
2. **Teach staged rollout** and have the learner sequence one for a 200-engineer org, naming
   what must be true before each stage.
3. **Teach the standardize/delegate split** with six candidate rules, connecting to Tier 1
   session 5's placement exercise.
4. **Teach distribution via plugins and shared skills** rather than instructions to copy config.
5. **Teach metrics** as the session's most exam-relevant judgment. Ask which metrics they'd
   report to a CTO, then attack their list: which could be gamed, which measures activity
   rather than value? Push until the list includes at least one genuine outcome metric.
6. **Teach cost attribution** and the behavioral argument for visibility.
7. **Teach the enablement path** and the named-owner requirement.
8. **Teach adoption failure modes** — including over-trust and unreviewed AI-authored code,
   and what control addresses each.
9. **Teach usage policy** with enforcement, connecting to sessions 10–11.
10. **Teach operational support** and the feature-availability-vs-bug discrimination.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 4 questions** (fewer, matching the domain's weight), standalone
    Professional format. Include a metrics question, a standardize/delegate question, a
    rollout sequencing question, and one multiple-response on adoption failure modes.
13. **Distractor autopsy** — expect activity metrics reported as productivity, and org-wide
    launches before the enablement path exists.
14. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — absent from Foundations.

**End of Tier 3.** Tell the learner Tier 4 is four capstone sessions working full
architecture problems end to end, then the Professional mock gate. Report readiness across
all seven P domains and name the weakest two.

## Out of scope

- Governance enforcement mechanics → sessions 10–11
- Stakeholder communication depth → session 12
- Claude Code configuration mechanics → Tier 1 sessions 5–7
