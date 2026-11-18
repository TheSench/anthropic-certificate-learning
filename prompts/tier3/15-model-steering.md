# Model Steering and Prompt Portfolios — P2 Claude Models, Prompting, and Context Engineering

**Exam weight: 13%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P2.2 — System Prompt Diagnosis and Revision: Diagnosing the underspecification in a system
  prompt that produces degraded or inconsistent output, and selecting the revision that
  constrains scope, format, and behavior without over-constraining legitimate variation.
- P2.3 — Prompting Technique Selection: Applying the prompting technique (zero-shot,
  few-shot, prompted reasoning versus native thinking, structured output) that addresses an
  observed failure pattern for a task of stated complexity without unnecessary token cost.
- P2.5 — Cache Breakpoints and Reusable Packaging: Applying cache breakpoints and modular or
  Skill-based packaging to a repeated prompt sequence so that stable content precedes
  dynamic content and reuse is maximized across the stated call pattern.

## What this session assumes

Tier 1 session 8 (prompt diagnosis) and Tier 3 sessions 31, 34, and 41.

## Why this domain is worth 13% of your score

Half of P2's six objectives live here. Foundations tested prompt technique on a single
prompt; Professional hands you a system prompt, a sample of degraded outputs, or a request
log with cache metrics, and asks which revision, technique, or packaging change fixes the
observed pattern at least cost. Every item is diagnose-and-select: the failure pattern names
the fix, and the distractors are fixes for a different failure — or the right fix pushed so
far it breaks legitimate behaviour.

## Session focus

The crux is **matching the intervention to the observed failure, and stopping there**. For P2.2 that means naming *which* dimension a system prompt leaves underspecified — scope, format, or behavior — from the outputs it produces, then choosing the revision that closes that gap without over-constraining: the rigid template, the exhaustive rule list, or the shouted MUST that suppresses legitimate variation is the signature wrong answer. For P2.3 it means picking the technique the failure calls for — examples fix target ambiguity, structured output fixes parse failures, native thinking at a calibrated effort fixes reasoning depth — and rejecting techniques that spend tokens without addressing the pattern. Spend the most time here. Verify the prompted-reasoning guidance against live docs: on current models manual step-by-step prompting is a fallback for when thinking is off, and on some models a prompt asking for written-out reasoning may be declined. P2.5 is the second block: cache breakpoints and modular or Skill packaging so stable content precedes dynamic content for the stated call pattern — teach it as layout arithmetic, not as a feature list.

## Authoritative sources

**System prompts and steering (P2.2)**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5>
- <https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

**Technique selection (P2.3)**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
  — examples, thinking, and the manual chain-of-thought fallback
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>

**Cache breakpoints and packaging (P2.5)**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching> — automatic vs.
  explicit breakpoints, cache hierarchy, what invalidates
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/skills-guide>

## Teaching objectives

By the end, the learner can:

**P2.2 — system prompt diagnosis and revision**
- Read a **sample of degraded or inconsistent outputs** and name the underspecified
  dimension:
  - **Scope** — answers drift outside the intended domain, or refuse requests that belong
    inside it; the prompt never says what the assistant is *for* and where it stops
  - **Format** — structure, length, or field names vary run to run; the prompt describes the
    output loosely or not at all
  - **Behavior** — tone, escalation, handling of uncertainty or missing data, or what to do
    on an out-of-policy request varies; the prompt is silent on the case
- Choose the revision that **constrains the gap and nothing else**: state purpose and
  boundary, the output contract, and the behaviour for the named case, with the *reason*
  behind each constraint so the model can generalise to cases the prompt didn't list
- Recognize **over-constraint** as its own failure: a single rigid template forced on request
  types that legitimately differ, an exhaustive rule list where unlisted cases now fail, or
  emphatic MUST/NEVER language that current models over-apply. Verify the current
  best-practices guidance on instruction literalness and emphasis before teaching it
- Decide what belongs in the **system prompt** versus per-request content — stable role,
  boundaries, and output contract in the system prompt; per-call data after it — which is
  also the P2.5 layout rule. Secrets go in neither (session 28)

**P2.3 — technique selection against an observed failure**
- Match each of v1.1's four techniques to the failure it fixes, and reject it for the others:
  - **Zero-shot** — the default when the task is unambiguous and the output contract is
    stated; adding anything else spends tokens on every call
  - **Few-shot** — fixes *target ambiguity* (format, tone, edge-case handling the model
    can't infer); does not fix reasoning capacity. Good examples are relevant, diverse
    enough not to teach an accidental pattern, and delimited from instructions
  - **Prompted reasoning versus native thinking** — for a reasoning-depth failure, prefer
    native thinking at a calibrated effort over hand-written step-by-step scaffolds; a
    general "reason thoroughly" often beats a prescriptive plan. Prompted reasoning is the
    fallback when thinking is off on the target model. Verify which models allow thinking
    to be disabled, and that on some current models a prompt asking for visible reasoning
    in tags may be declined — the guidance is model-specific and moves
  - **Structured output** — fixes *parse failures* and schema drift that instructions and
    examples only reduce; schema-constrained output makes the contract enforceable
- Weigh **token cost** against the task's stated complexity: examples, thinking, and higher
  effort add tokens on every call, so the cheapest sufficient technique wins. First match
  the technique to the failure (a parse failure needs structured output, whatever its
  place in any list); then, among techniques that fit, prefer the cheaper — instruction
  clarity, examples, output structure, thinking/effort, then model change — and reject a
  model change before the prompt is unambiguous (model tier itself
  is P2.1, session 31)

**P2.5 — cache breakpoints and reusable packaging**
- Lay out a **repeated prompt sequence** so stable content precedes dynamic content, in the
  cache hierarchy order (verify: tools, then system, then messages), and place a breakpoint
  on the **last block that stays identical** across the stated call pattern — not on the
  varying block. Verify the current breakpoint limit, lookback behaviour, minimum cacheable
  length, and TTL options before doing arithmetic
- Use **multiple breakpoints** when sections change at different frequencies (tools rarely,
  reference context daily, conversation every turn), and know when automatic caching
  suffices for a growing conversation
- Apply **modular composition** for reuse: shared modules byte-identical and placed first,
  task-specific modules after, so five related tasks share one cached prefix. Know the
  blast radius — an edit to a shared module changes behaviour everywhere and invalidates
  every downstream cache (session 41's composition view of the same fact)
- Apply **Skill-based packaging** where the cost is *always-loaded* instructions: only
  metadata sits in context until the Skill triggers, the body loads on trigger, bundled
  resources load only when read. The description is the trigger — it must say what the
  Skill does and when to use it; an over-broad one fires wrongly (same principle as tool
  descriptions, Tier 1 session 14). This is progressive discovery (session 41, P3.7)
  applied to instructions
- Choose among the reuse mechanisms on what each does: **caching** makes a repeated prefix
  cheap but sends the same tokens; **modular composition** removes authoring duplication
  and makes prefixes shareable; **Skills** defer loading until relevance is established.
  They compose; the item asks which one addresses the stated call pattern
- Know that **Skills don't reuse across surfaces automatically** — custom Skills are managed
  per surface and sharing scope differs. Verify current behaviour; distribution across an
  org is P7.1, session 43, and surface choice is P1.6, session 29

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which dimension is underspecified | Do the bad outputs vary in *what* is answered, *how* it's shaped, or *how it behaves* on a case? |
| Targeted constraint vs. rigid template | Do request types legitimately differ in the dimension you'd lock down? |
| Add a rule vs. explain the goal | Will unlisted cases need the model to generalise? |
| Zero-shot vs. add examples | Is the failure target-ambiguity, or reasoning capacity? |
| Prompted reasoning vs. native thinking | Is thinking available on this model, and what effort fits the latency budget? |
| Instructions/examples vs. structured output | Must the output parse every time? |
| Raise effort vs. add examples vs. change model | Which is the actual failure — reasoning, target clarity, or capability? |
| System prompt vs. per-request | Is it stable across the call pattern, or per-call? |
| Where the breakpoint goes | What is the last block identical across calls? |
| Cache vs. modularize vs. package as a Skill | Is the cost in repetition, authoring duplication, or always-loaded context? |

## How to run this session

1. **Frame** — every item gives an artifact (a system prompt, sample outputs, a request log)
   and asks for the fix that matches the observed pattern at least cost.
2. **Verify** the current best-practices page, the model-specific prompting page for the
   current models, and the thinking/effort pages before teaching any specifics.
3. **Teach P2.2 diagnosis.** Give a system prompt and six outputs. Have the learner name the
   underspecified dimension from the outputs alone. Repeat with three prompts — one per
   dimension.
4. **Teach over-constraint.** Offer four candidate revisions to one of those prompts: one
   that closes the gap, one rigid template, one exhaustive rule list, one shouted MUST.
   Have them predict what each breaks. The right revision constrains the gap and states why.
5. **Teach technique selection against failures, not as a list.** Give four failing prompts —
   wrong format, wrong reasoning, malformed JSON, and an unambiguous task already carrying
   ten examples — and have them pick zero-shot, few-shot, native thinking, or structured
   output. Reject "add examples" for the reasoning failure and make them say why it won't
   help. This connects to Tier 1 session 8's technique-shotgunning trap.
6. **Teach prompted reasoning versus native thinking at current-model altitude.** The point
   to land: on a model with thinking, hand-written step-by-step scaffolding is the older
   playbook; calibrate effort instead. Ask what they'd do on a model where thinking is off,
   and what they'd check before asking a current model to write its reasoning in tags.
7. **Teach the lever order.** Give four failures and have them first match each to the
   technique that addresses it, then pick the cheapest that does. Reject reaching for a model change first — that's the domain's bias trap.
8. **Teach P2.5 layout.** Give a request log for a repeated sequence — tools, a system prompt
   with a date stamp near the top, a shared reference document, per-user context, the
   message — with a low hit rate. Have them reorder it, place breakpoints, and estimate the
   new hit rate. Verify breakpoint limits and pricing first.
9. **Teach modular and Skill packaging.** Ask how they'd stop five teams each pasting the
   same 800-word procedure into their prompts. Elicit the three mechanisms and what each
   solves, then critique an over-broad Skill description.
10. **Decision table** — walk all rows.
11. **Scenario drill — 6 questions**, standalone Professional format, each built on an
    artifact. Include an underspecification diagnosis, an over-constraint item (the tempting
    revision locks down legitimate variation), a technique-matching item where examples are
    the wrong fix, a prompted-reasoning-versus-thinking item, a breakpoint-placement item,
    and a reuse-mechanism choice.
12. **Distractor autopsy** — expect model upgrades chosen before prompt clarity, rigid
    templates or exhaustive rule lists offered as the "safest" revision, few-shot examples
    offered for a reasoning failure, manual chain-of-thought scaffolding where native
    thinking at a lower effort was the current-model answer, format instructions offered
    where structured output was needed, and a cache breakpoint placed after a per-request
    field.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Model tier selection → session 31 (P2.1)
- Context composition, lifecycle, and effort allocation for long-running agents → session 41
  (P2.4, P2.6)
- Org-wide distribution of Skills and plugins → session 43 (P7.1)
- Deployment surface choice → session 29 (P1.6)
- Comparing two prompt configurations experimentally → session 34 (P4.4)
- Re-tuning prompts for a model migration → session 40 (P4.7)
- Cost telemetry → session 36 (P4.6)
