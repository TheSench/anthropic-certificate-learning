# Model Steering and Prompt Portfolios — P6 Claude Models, Prompting & Context Engineering

**Exam weight: 13%**

## What this session assumes

Tier 1 session 8 (prompt diagnosis) and Tier 3 sessions 4, 7, 13, 14.

## Why this domain is worth 13% of your score

The P6 domain description names **model steering**. Foundations tested prompt technique on
a single prompt; Professional tests managing prompts as a **portfolio asset** across
models, teams, and time — versioned, owned, evaluated, and migrated. Items here often turn
on treating prompts as code rather than as configuration strings.

## Session focus

This session treats prompts as a **portfolio asset managed like code** — versioned, owned, evaluated, migrated — rather than as configuration strings. The crux is the steering lever order: instruction clarity, examples, output structure, effort/thinking, then model change. Cheapest and most targeted first; reaching for a model change before the prompt is unambiguous is this domain's bias trap. Also teach A/B statistics honestly — in a probabilistic system, small samples mislead, and a difference must clear variance before it's real.

## Authoritative sources

**Steering and model-specific behavior**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5>

**Reasoning and effort controls**
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/mid-conversation-effort-example>

**System prompt architecture**
- <https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts>
- <https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages>
- <https://platform.claude.com/docs/en/release-notes/system-prompts/overview>

**Consistency and output shaping**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>

## Teaching objectives

By the end, the learner can:

- Treat prompts as **versioned, owned, tested artifacts**: in source control, with an owner,
  an eval suite, a target model recorded, and a change process — not as strings in a config
  table
- Design a **prompt architecture** for an org: shared components (tone, safety boilerplate,
  output format) composed with task-specific instructions, so a global change is made once
- Explain the trade-off in shared prompt components: a single edit propagates everywhere,
  which is the benefit and the blast radius — and connect it to session 14's cache
  invalidation cost
- Use the **steering levers** in the right order for a given failure: instruction clarity,
  examples, output structure, effort/thinking level, then model change — cheapest and most
  targeted first
- Explain **model-specific steering differences** and that prompting guidance is published
  per model, so a portfolio spanning models needs per-model validation
- Design the **prompt change process**: propose, evaluate against the suite, review, canary,
  roll out, with rollback — the same discipline as a code change
- Explain why **A/B testing prompts in production** requires care in a probabilistic system:
  variance means small samples mislead, so a difference must clear noise before it's real
- Decide what goes in the **system prompt** versus per-request content, on caching,
  stability, and security grounds — and never put secrets in either
- Manage **prompt sprawl**: duplicated near-identical prompts across teams, and the
  consolidation and ownership answer
- Explain the interaction between steering choices and cost: raising effort, adding
  examples, and adding thinking all consume tokens on every call

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Shared prompt component vs. per-team copy | Must a change propagate, or must teams diverge? |
| Raise effort vs. add examples vs. change model | Which is the actual failure — reasoning, target-clarity, or capability? |
| System prompt vs. per-request | Is it stable and cacheable, or per-call? |
| A/B in production vs. offline eval | Is the difference large enough to clear variance at your volume? |
| Per-model prompt variants vs. one portable prompt | Does the portfolio span models with different guidance? |
| Consolidate prompts vs. leave them | Is the duplication causing divergent behavior or unowned drift? |

## How to run this session

1. **Frame** — prompts as a portfolio asset, managed like code. Name that this altitude
   shift is what separates P6 items from Foundations prompt questions.
2. **Verify** the model-specific prompting guidance for the current models before teaching
   any steering specifics.
3. **Teach prompts-as-artifacts.** Ask what's wrong with prompts stored in a database and
   edited through an admin UI. Elicit: no review, no eval gate, no version history, no owner,
   no rollback.
4. **Teach prompt architecture.** Have them design a composition scheme for five related
   tasks sharing tone and format requirements, then ask what a change to the shared
   component costs — behaviorally and in cache terms.
5. **Teach the steering lever order.** Give four failures and have them pick the cheapest
   sufficient lever. Reject reaching for a model change first — that's the domain's bias trap.
6. **Teach model-specific differences** and the per-model validation requirement.
7. **Teach the change process** as a code-change analogue, and have them write it.
8. **Teach A/B statistics honestly.** Ask how many samples they'd need to detect a 3%
   difference. The answer being "more than you'd think" is the lesson; connect to session 7's
   eval sizing arithmetic.
9. **Teach system-prompt placement** and the secrets rule from session 8.
10. **Teach prompt sprawl** with an org that has 200 prompts and no inventory; connect to
    session 13's prompt inventory.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 5 questions**, standalone Professional format. Include a lever-order
    question, a shared-component blast-radius question, an A/B validity question, a
    per-model portability question, and one multiple-response on prompt governance.
13. **Distractor autopsy** — expect model upgrades chosen before prompt clarity, and
    production A/B results trusted at sample sizes that can't support them.
14. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Context architecture → session 14
- Eval construction → session 7
- Model migration → session 13
- Cost arithmetic → session 9
