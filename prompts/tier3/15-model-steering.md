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

This session treats prompts as a **portfolio asset managed like code** — versioned, owned, evaluated, migrated — rather than as configuration strings. The crux is the steering lever order: instruction clarity, examples, output structure, effort/thinking, then model change. Cheapest and most targeted first; reaching for a model change before the prompt is unambiguous is this domain's bias trap. The session also owns the domain's **technique vocabulary** — zero-shot, few-shot, chain-of-thought — and **Skills as a prompt-reuse mechanism**, both named directly in CCAR-P Domain 2. Teach the techniques as *failure-matched interventions*, never as a list to recall, and verify the chain-of-thought guidance against live docs: on current models manual step-by-step prompting is the fallback for when thinking is off, not the default. Close on the **surface-availability trap** — Skills do not sync across surfaces and claude.ai offers no central admin management of custom Skills — because it turns a plausible enterprise rollout plan into an undeliverable one, and the exam rewards noticing before the plan is written. Also teach A/B statistics honestly — in a probabilistic system, small samples mislead, and a difference must clear variance before it's real.

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

**Prompt technique vocabulary (Domain 2 names these explicitly)**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>

**Skills as a prompt-reuse mechanism**
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/skills-guide>

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
- Name the **technique vocabulary** CCAR-P uses, because items are written in it:
  **zero-shot** (instruction only, no examples — the correct default when the task is
  unambiguous and the output shape is stated), **few-shot / multishot** (examples supplied
  to fix format, tone, or edge-case handling), and **chain-of-thought** (the model reasons
  before answering). Know which failure each addresses: examples fix *target ambiguity*,
  not reasoning capacity, and adding them to a reasoning failure spends tokens without
  fixing it
- Explain **what good examples require** — relevant to the actual use case, diverse enough
  to cover edge cases without teaching an unintended pattern, and structurally delimited so
  the model can tell example from instruction — and why a few well-chosen examples beat
  many near-identical ones
- Place **chain-of-thought against extended thinking correctly**, which is where stale
  knowledge shows: on current models, manual "think step by step" prompting is the
  *fallback for when thinking is off*, not the default technique. Prefer thinking enabled
  at a lower effort level over hand-written reasoning scaffolds, and know that prescriptive
  step-by-step instructions often underperform a general instruction to reason thoroughly.
  Verify this against the current best-practices page before teaching it — the guidance is
  model-specific and moves
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
- Explain **Skills as the packaging answer to prompt reuse**, which is how CCAR-P frames
  them ("prompt reuse strategies: caching, modular prompts, Skills"): a Skill packages
  instructions and resources so guidance isn't repeated across conversations, and its
  metadata is matched against the request to decide whether it loads at all
- Explain **progressive disclosure** as what makes Skills cheap to install broadly: only
  name and description occupy context until a Skill triggers, the instruction body loads
  on trigger, and bundled resources load only when read — so many Skills can exist without
  a per-request context penalty. This is the same idea s14 teaches as progressive discovery
  vs. monolithic context, applied to instructions rather than tools
- Choose among the **three reuse mechanisms** on what each actually does: **caching** makes
  a repeated prefix cheap but doesn't reduce what's sent, **modular prompt composition**
  removes duplication at authoring time, and **Skills** defer loading until relevance is
  established. They compose, and the exam-relevant judgment is which one addresses the
  stated problem
- Recognize the **Skill description as the trigger mechanism** — it must say what the Skill
  does *and* when to use it, which is the same load-bearing-description principle as tool
  design in Tier 1 session 11, and the same failure mode when over-broad
- Recognize that **Skills behave differently per surface**, and that the differences decide
  whether a standardization plan is deliverable at all. Verify these against live docs
  before teaching — they move — but know the shape:
  - **Custom Skills do not sync across surfaces.** A Skill uploaded to claude.ai is not
    available via the API and vice versa; Claude Code Skills are filesystem-based and
    separate from both. Each surface is managed and uploaded separately
  - **Sharing scope differs.** API custom Skills are workspace-wide; Claude Code Skills are
    personal (`~/.claude/skills/`) or project (`.claude/skills/`) and can also ship through
    plugins; **claude.ai custom Skills are per-user, not shared org-wide, and cannot be
    centrally managed by admins**
  - **Runtime differs.** API Skills run sandboxed with no network access and no runtime
    package installation; Claude Code Skills have the same network access as any local
    program; claude.ai network access varies with user and admin settings
- Draw the consequence for **enterprise standardization**: "roll one Skill out to the whole
  org" is not uniformly achievable, and which surface the org standardizes on determines
  whether central distribution is possible. An org whose users work in claude.ai cannot
  centrally manage custom Skills for them today, so the answer is a different surface or a
  different distribution mechanism — not a policy document asking people to upload it
  themselves. This is the same surface-parity discipline as session 2, applied to Skills:
  **parity must be verified per surface, never assumed**
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
| Zero-shot vs. add examples | Is the failure target-ambiguity, or reasoning capacity? |
| Manual chain-of-thought vs. extended thinking | Is thinking available on this model, and at what effort? |
| Cache vs. modularize vs. package as a Skill | Is the cost in repetition, authoring duplication, or always-loaded context? |
| Which surface to standardize a Skill on | Does the rollout need central management, and does that surface support it? |

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
5. **Teach the technique vocabulary against failures, not as a list.** Name zero-shot,
   few-shot/multishot, and chain-of-thought, then immediately make the distinction that
   matters: give three failing prompts — one where the model doesn't know the target format,
   one where it reasons wrongly, one that's simply ambiguous — and have the learner pick the
   technique. Examples fix the first and nothing else. Reject "add examples" for the
   reasoning failure and make them say why it won't help. Then teach example *quality*:
   relevant, diverse, delimited. This connects straight back to Tier 1 session 8's
   technique-shotgunning trap, now with the guide's vocabulary attached.
6. **Teach chain-of-thought at current-model altitude.** Verify the best-practices page
   first. The point to land: manual "think step by step" scaffolding is the fallback for
   when thinking is unavailable, and prescriptive step-by-step instructions often
   underperform a general instruction to reason thoroughly. A candidate who reaches for
   hand-written CoT where raising effort was available is answering from an older
   generation's playbook.
7. **Teach Skills as prompt reuse**, which is the framing Domain 2 uses. Ask how they'd
   stop five teams from each maintaining their own copy of the same 800-word analysis
   procedure. Elicit the three mechanisms and make them distinguish what each solves:
   caching makes repetition cheap, modular composition removes authoring duplication,
   Skills defer loading until relevance is established. Then teach progressive disclosure
   with the three levels, and make the connection to session 14 — this is progressive
   discovery applied to instructions instead of tools.
8. **Teach the Skill description as trigger**, and have them critique an over-broad one.
   Same principle as tool descriptions in Tier 1 session 11, same failure mode.
9. **Teach the surface-availability trap.** Verify the current per-surface behavior first,
   then set the problem: an enterprise wants one reviewed, approved Skill used identically
   by 400 engineers. Ask how they'd distribute it. Most learners will assume a Skill is a
   Skill. Then reveal the asymmetries — no cross-surface sync, per-user-only on claude.ai
   with no central admin management, workspace-wide on the API, filesystem-and-plugins in
   Claude Code — and have them redo the plan. The point that transfers: the rollout
   mechanism is decided by the surface, so surface choice is upstream of the enablement
   plan, not a detail inside it. Connect explicitly to session 2's elimination exercise and
   forward to session 16's standardize-vs-delegate split.
10. **Teach the steering lever order.** Give four failures and have them pick the cheapest
   sufficient lever. Reject reaching for a model change first — that's the domain's bias trap.
11. **Teach model-specific differences** and the per-model validation requirement.
12. **Teach the change process** as a code-change analogue, and have them write it.
13. **Teach A/B statistics honestly.** Ask how many samples they'd need to detect a 3%
   difference. The answer being "more than you'd think" is the lesson; connect to session 7's
   eval sizing arithmetic.
14. **Teach system-prompt placement** and the secrets rule from session 8.
15. **Teach prompt sprawl** with an org that has 200 prompts and no inventory; connect to
    session 13's prompt inventory.
16. **Decision table** — walk all rows.
17. **Scenario drill — 6 questions**, standalone Professional format. Include a lever-order
    question, a technique-matching question (a failure where examples are the wrong fix), a
    reuse-mechanism choice (caching vs. modular vs. Skill), a Skill-distribution question
    where the stated surface makes central management impossible, an A/B validity question,
    and one multiple-response on prompt governance.
18. **Distractor autopsy** — expect model upgrades chosen before prompt clarity,
    production A/B results trusted at sample sizes that can't support them, few-shot
    examples offered for a reasoning failure, manual chain-of-thought scaffolding where
    extended thinking at a lower effort was the current-model answer, and Skill
    distribution plans that assume cross-surface sync or org-wide management the surface
    doesn't provide.
19. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Deployment surface choice itself → session 2 (this session covers only how surface
  choice constrains Skill distribution)
- Org rollout, adoption, and enablement mechanics → session 16
- Context architecture → session 14
- Eval construction → session 7
- Model migration → session 13
- Cost arithmetic → session 9
