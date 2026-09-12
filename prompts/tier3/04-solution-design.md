# Solution Design and Model Selection — P2 Solution Design & Architecture

**Exam weight: 17%**

## What this session assumes

Sessions 1–3 (P1). Tier 1 session 2 covered agent-vs-workflow; this raises the same
judgment to whole-solution design and adds model choice.

## Why this domain is worth 17% of your score

"When Sonnet is the right call over Opus" is a documented exam question type, and the P2
domain description names **model and API selection for specific problems**. The exam gives
you a problem plus constraints and asks for the design; wrong answers are typically the
most capable option chosen where a stated cost, latency, or simplicity constraint should
have decided otherwise.

## Session focus

This session covers requirements-to-architecture and model selection. Verify current model names, IDs, and prices before teaching any — a stale model ID is simply a wrong answer. The crux is **constraint-first selection**: identify the binding constraint, then choose the cheapest model that clears the quality bar. "When Sonnet is the right call over Opus" is a documented exam question type, and defaulting to the most capable option is the top Professional failure mode. Spend real time on the over-engineering exercise; the exam rewards the *sufficient* design.

## Authoritative sources

Verify current model names, IDs, capabilities, context limits, and prices — model lineups
change frequently, and a stale model ID is a wrong answer.

**Model selection**
- <https://platform.claude.com/docs/en/models/overview>
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>
- <https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions>
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>
- <https://platform.claude.com/docs/en/about-claude/pricing>

**Current model line** — check which exist and their positioning before teaching
- <https://platform.claude.com/docs/en/models/opus-5/overview>
- <https://platform.claude.com/docs/en/models/sonnet-5/overview>
- <https://platform.claude.com/docs/en/models/haiku-4-5/overview>

**Capability levers that change the calculus**
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/fast-mode>

**Architecture patterns**
- <https://code.claude.com/docs/en/workflows>
- <https://platform.claude.com/docs/en/managed-agents/overview>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/overview>

## Teaching objectives

By the end, the learner can:

- Run a **requirements-to-architecture** pass: from stated business need, quality bar,
  volume, latency budget, cost ceiling, and compliance posture to a defensible design
- Name which **business value pillar** a solution is actually serving — CCAR-P lists five:
  **efficiency** (same outcome, less input), **transformation** (something previously
  impossible, not merely faster), **productivity** (people accomplishing more per unit
  time), **cost** (direct spend reduction), and **performance SLAs** (a commitment about
  latency, throughput, or availability). Use them as the exam's vocabulary for *why* a
  system is being built, and recognize that they pull against each other: a transformation
  case tolerates cost that an efficiency case cannot, and an SLA commitment constrains
  designs that a productivity case would happily accept
- Detect the **stated-versus-real pillar mismatch**: a sponsor who says "efficiency" but
  measures headcount reduction, or one who asks for transformation and supplies an
  efficiency budget. The architecture that follows differs, so the mismatch has to surface
  before design, not after
- Select a model from **constraints rather than capability ranking**: identify the binding
  constraint first, then choose the cheapest/fastest model that clears the quality bar
- Explain the **tiered-model pattern**: a cheap model handling the common path with
  escalation to a stronger one on low confidence or complexity — and name what it costs
  (two prompts to maintain, two eval suites, a routing decision that can itself be wrong)
- Explain the **effort/thinking dimension** as an alternative to changing models, and when
  raising effort on a smaller model beats moving to a larger one
- Decide the **API surface**: direct Messages API, Agent SDK, managed/hosted agents, or
  Claude Code — on operational ownership and control grounds
- Justify a design against the alternatives, including the deliberately boring one
- Recognize **over-engineering** — agentic where a workflow fits, multi-agent where one
  agent suffices, RAG where a static prompt would do — and articulate the cost of
  unnecessary complexity in maintenance and evaluation burden
- Design for the **quality bar that's actually required**, and push back on unstated
  perfection assumptions
- Explain why "we'll just use the best model" is a non-answer at enterprise scale

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Larger model vs. better prompt/effort | Is the prompt already unambiguous and the failure genuinely reasoning? |
| Single model vs. tiered with escalation | Is the cost gap large and the common path easy? |
| Raise effort vs. change model | Which constraint is binding — capability or per-token cost? |
| Messages API vs. Agent SDK vs. managed agents | Who owns the loop, the tools, and the operations? |
| Claude Code vs. a built application | Is the user an engineer in a repo, or an end user in a product? |
| Simplest sufficient design vs. flexible one | Is the requirement stable, or genuinely expected to change? |
| Which value pillar governs | Is this efficiency, transformation, productivity, cost, or an SLA commitment? |

## How to run this session

1. **Frame** — the exam rewards choosing the *sufficient* design, not the most capable one.
   Name that this is the top Professional failure mode.
2. **Verify the model lineup** before teaching any name, ID, price, or limit. Tell the
   learner explicitly that model IDs and prices must be checked, since a confidently stated
   stale ID is exactly what an exam question can punish.
3. **Teach the value pillars first**, because they decide what "good" means before any
   constraint is weighed. Give five one-line project briefs and have the learner name the
   governing pillar for each, then say what changes in the design if the pillar were
   different. Include one brief where the stated pillar and the stated success metric
   disagree — that mismatch is the exam-relevant case, and the architect's job is to
   surface it rather than design past it.
4. **Teach the requirements-to-architecture pass** as a repeatable order: pillar, quality
   bar, volume, latency, cost, compliance, then design. Work one example end to end.
5. **Teach constraint-first model selection.** Give four workloads with different binding
   constraints and have them choose, naming the constraint each time. Include one where the
   cheapest model is right and one where it genuinely isn't.
6. **Teach the tiered pattern** with its full cost, not just its savings. Ask what breaks
   when the router misclassifies.
7. **Teach the effort dimension** as a third axis besides model and prompt.
8. **Teach API surface choice** as an ownership question.
9. **Teach over-engineering detection.** Present three over-built designs and have the
   learner simplify each, stating what's lost. Then ask for the one case where the complex
   version was justified.
10. **Teach justification.** Have them defend a design in three sentences to a skeptical
   engineering director — this rehearses P5 as well.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 5 questions**, standalone Professional format. Include a
    constraint-driven model choice, a tiered-pattern trade-off, an API surface decision, an
    over-engineering identification, and one multiple-response on selection criteria.
13. **Distractor autopsy** — expect the most capable model chosen by default, and complexity
    chosen for hypothetical future needs.
14. Record per `.agents/TUTORIAL.md` Step 5. Glossary every model ID and price verified,
    with the date.

## Out of scope

- Scaling trade-offs → session 5
- Reliability patterns → session 6
- Cost optimization mechanics → session 9
- Stakeholder defense in depth → session 12
- Migration between models → session 13
