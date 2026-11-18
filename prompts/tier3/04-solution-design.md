# Solution Design and Model Selection — P1 Solution Design and Architecture

**Exam weight: 18%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P1.1 — Task Delegation Between Claude and Humans: Determining which components of a
  described business process should be delegated to Claude, retained by humans, or
  handled collaboratively, and justifying each assignment against reversibility, stakes,
  and accountability.
- P1.3 — Architectural Pattern Selection: Selecting among workflow, agentic,
  augmented-LLM, and Skills-based architectural patterns for a use case with stated reuse,
  governance, and risk-profile constraints, and justifying the delegation boundary the
  selected pattern establishes.
- P1.5 — Value-Based Architectural Decisions: Selecting the architectural option that
  maximizes measurable business outcome under a stated cost or SLA ceiling, weighing
  competing feature proposals against stated business value pillars such as efficiency,
  transformation, productivity, solution cost, and performance SLAs.
- P2.1 — Model Tier Selection: Selecting the Claude model tier that satisfies all binding
  latency, cost, and quality constraints for a stated workload profile, and identifying
  why each rejected alternative fails.

## What this session assumes

Sessions 28–30 (P3). Tier 1 session 2 covered agent-vs-workflow; this raises the same
judgment to whole-solution design, adds who does what (Claude or a human), and adds model
tier choice.

## Why this domain is worth 18% of your score

P1 is the second-largest Professional domain, and three of its six objectives live here;
P2.1 adds a slice of P2 (13%). Every one of them is a selection under stated constraints:
which work Claude does, which pattern carries it, which option buys the most measurable
outcome under a ceiling, which tier clears every bar. Wrong answers are typically the most
capable or most autonomous option chosen where a stated cost, latency, accountability, or
simplicity constraint should have decided otherwise — or the right choice justified
without saying why the alternatives fail.

## Session focus

This session covers four connected selections: delegating process components between
Claude and humans, choosing the architectural pattern, choosing the option with the best
measurable value under a ceiling, and choosing the model tier. The crux is
**constraint-first selection with the rejections stated**: find every binding constraint,
choose the least option that clears all of them, and say why each rejected alternative
fails — v1.1 scores the rejections, not just the pick. Spend disproportionate time on two
places: model tier selection (verify current model names, IDs, and prices before teaching
any — a stale ID is simply a wrong answer — and drill the "cheapest tier that clears the
quality bar" judgment until the learner names each rejected tier's failing constraint
unprompted), and delegation by **reversibility, stakes, and accountability**, which is new
in v1.1 and also governs the delegation boundary each pattern establishes. Defaulting to
the most capable or most autonomous option is the top Professional failure mode; the exam
rewards the *sufficient* design.

## Authoritative sources

Verify current model names, IDs, capabilities, context limits, and prices — model lineups
change frequently, and a stale model ID is a wrong answer.

**Model tier selection**
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
- <https://www.anthropic.com/engineering/building-effective-agents> — augmented LLM, workflows, agents
- <https://code.claude.com/docs/en/workflows>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview> · <https://code.claude.com/docs/en/skills> — Skills
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/overview>

## Teaching objectives

By the end, the learner can:

- **Delegate process components** (P1.1): break a described business process into its
  components and assign each to **Claude**, **a human**, or **collaborative** handling
  (Claude drafts or recommends, a human approves or decides), justifying each against:
  - **Reversibility** — can the effect be undone cheaply and completely? Irreversible
    effects (a payment, a sent external message, a deleted record) pull toward human
    retention or approval
  - **Stakes** — what does an error cost, and to whom? Low-stakes, high-volume steps are
    the natural delegation targets
  - **Accountability** — who must answer for the decision, by regulation, contract, or
    org policy? Where a named human must be accountable, the human decides even if Claude
    could; collaboration preserves the accountable decision while delegating the work
  Recognize both failure directions: delegating an irreversible, high-stakes, or
  accountable decision to Claude, and retaining reversible, low-stakes work with humans
  so the system adds review delay without reducing risk. Where exactly a human gate sits
  in an agentic flow is session 38 (P5.4); here, decide *who owns* each component
- Name the four **architectural patterns** in the exam's vocabulary and place a problem
  in one (P1.3):
  - **Augmented LLM** — a single model call enhanced with retrieval, tools, or memory.
    The baseline the others must beat
  - **Workflow** — predetermined steps orchestrated in code, with model calls at fixed
    points. Control flow is yours: testable, boundable, debuggable
  - **Agentic** — the model directs control flow, choosing tools and sequence at runtime
  - **Skills-based** — reusable, packaged procedures (instructions, scripts, resources)
    that an agent loads on demand when a task matches. The unit of reuse and governance
    is the Skill: authored once, versioned, reviewed, and distributed across teams and
    agents. Verify current Skill packaging and loading behaviour from live docs
  Tier 1 taught conversational/workflow/agentic; say plainly that the exam's terms are
  augmented LLM and Skills-based, which are not the same idea as a conversational
  assistant
- Select the pattern against the **three constraints the statement names**:
  - **Reuse** — is the same procedure needed across many agents, teams, or tasks? That
    favours Skills; one-off logic does not need packaging
  - **Governance** — must the procedure be reviewed, versioned, and centrally
    controlled? Workflows and Skills give an auditable artifact; agentic control flow is
    harder to govern
  - **Risk profile** — how bad is an unexpected action? High risk pulls control flow
    into code (workflow); low risk and open-ended tasks tolerate agentic
- **Justify the delegation boundary** each pattern establishes — what Claude decides and
  what code or humans decide:
  - Augmented LLM: Claude decides one answer; everything around it is fixed
  - Workflow: code owns sequence and branching; Claude owns the content of each step
  - Agentic: Claude owns sequence and tool choice inside the tools and permissions it is
    given — the permission set *is* the boundary
  - Skills-based: the Skill fixes the procedure Claude follows and the scripts it may
    run; Claude decides when a Skill applies. A third-party Skill moves part of that
    boundary to its author, which is a supply-chain and injection concern (session 35,
    P5.2)
- Make **value-based decisions** (P1.5): choose the option that **maximizes measurable
  business outcome under a stated cost or SLA ceiling**. Treat the ceiling as a hard
  filter first, then rank survivors by measurable outcome. Use the guide's pillars as
  vocabulary — "such as" efficiency (same outcome, less input), transformation (something
  previously impossible), productivity (more per person per unit time), **solution cost**
  (what the solution itself costs to build and run), and **performance SLAs** (latency,
  throughput, availability commitments) — noting the list is illustrative, not closed
- **Weigh competing feature proposals**: given several proposals and one budget or SLA,
  pick the one whose outcome is measurable and largest within the ceiling, and reject
  proposals whose value is unmeasurable, whose cost breaks the ceiling, or that serve a
  pillar the sponsor didn't state. Detect the **stated-versus-measured pillar mismatch**
  (a sponsor who says "transformation" but sets an efficiency budget) before designing
- Select a **model tier** (P2.1) that satisfies **all** binding constraints — latency,
  cost, quality — for the stated workload profile: identify each binding constraint,
  eliminate tiers that fail any, choose the cheapest survivor, and **state why each
  rejected tier fails** (misses the quality bar; breaks the latency budget; breaks the
  cost ceiling at the stated volume). Verify every tier's current positioning and price
  from live docs
- Weigh the alternatives a tier decision is often confused with: a better prompt, higher
  effort or thinking on a smaller tier, or a **tiered/escalation pattern** (cheap tier on
  the common path, stronger tier on hard cases) — and name what tiering costs: two prompts,
  two eval suites, a router that can misroute
- Recognize **over-engineering** — agentic where a workflow fits, Skills packaging for
  logic used once, a larger tier where a smaller one clears the bar — and articulate its
  cost in maintenance and evaluation burden
- Know that a design is incomplete without a **feedback loop**, and leave the full
  four-stage (input, processing, output, feedback) architecture evaluation to session 32
  (P1.2)

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Delegate to Claude vs. retain with human | Is the effect reversible, the stakes low, and no named human accountable? |
| Fully delegated vs. collaborative | Does a human have to own the decision even if Claude does the work? |
| Augmented LLM vs. workflow vs. agentic | Can you enumerate the steps — and does anything need to choose them at runtime? |
| Skills-based vs. inline logic | Is the procedure reused across agents or teams, and must it be governed as an artifact? |
| Workflow vs. agentic under risk | How bad is an unplanned action, and must control flow be auditable? |
| Which delegation boundary | What does the pattern let Claude decide, and is that within the risk profile? |
| Which feature proposal | Which has the largest *measurable* outcome inside the cost or SLA ceiling? |
| Which value pillar governs | Does the stated success metric match the stated pillar? |
| Which model tier | Which is the cheapest tier that clears every binding constraint — and what does each rejected tier fail? |
| Larger tier vs. better prompt/effort | Is the prompt already unambiguous and the failure genuinely capability? |
| Single tier vs. tiered with escalation | Is the cost gap large and the common path easy? |

## How to run this session

1. **Frame** — the exam rewards the *sufficient* design and scores the rejections. Name
   over-reach (most capable, most autonomous) as the top Professional failure mode.
2. **Verify the model lineup** before teaching any name, ID, price, or limit. Tell the
   learner explicitly that model IDs and prices must be checked.
3. **Teach delegation first** (P1.1). Give one business process of six to eight
   components — e.g. intake, classification, lookup, drafting, an approval with financial
   effect, an external send — and have the learner assign each to Claude, human, or
   collaborative, justifying on reversibility, stakes, and accountability. Then flip one
   constraint (a regulator names an accountable officer; an action becomes reversible) and
   ask what moves. Push back on both failure directions.
4. **Teach the value pillars and the ceiling** (P1.5). Give three competing feature
   proposals and one stated cost or SLA ceiling; have the learner filter by the ceiling,
   then rank by measurable outcome, and say why each loser loses. Include one proposal
   whose value can't be measured, and one brief where the stated pillar and the success
   metric disagree.
5. **Teach the four patterns** (P1.3). Give six problems with stated reuse, governance,
   and risk-profile constraints and have them place each, starting from the augmented-LLM
   baseline and requiring a reason to move up. Include two where Skills-based is right
   (a procedure reused by many teams and centrally reviewed) and one where it is
   over-engineering. For each pick, make them state the delegation boundary — what Claude
   decides, what code or humans decide.
6. **Teach constraint-first tier selection** (P2.1). Give four workload profiles with
   different binding constraints; for each the learner picks a tier and states, for every
   rejected tier, which constraint it fails. Include one where the cheapest tier is right
   and one where it genuinely isn't.
7. **Teach the tier alternatives** — prompt, effort, tiered escalation — with their full
   cost. Ask what breaks when the router misroutes.
8. **Teach over-engineering detection.** Present three over-built designs and have the
   learner simplify each, stating what's lost; then ask for the one case where the complex
   version was justified.
9. **Decision table** — walk all rows.
10. **Scenario drill — 6 questions**, standalone Professional format. Include a
    delegation assignment justified by reversibility/stakes/accountability, a pattern
    selection where Skills-based competes with workflow, a delegation-boundary item, a
    feature-proposal choice under a cost or SLA ceiling, a tier selection whose key
    requires knowing why each rejected tier fails, and one multiple-response on selection
    criteria.
11. **Distractor autopsy** — expect the most capable tier chosen by default, an
    irreversible or accountable decision delegated to Claude, every step kept with humans
    "to be safe", Skills packaging for one-off logic, an agentic design where an
    augmented LLM answers the question, and a feature proposal chosen for unmeasurable
    value or one that breaks the stated ceiling.
12. Record per `.agents/TUTORIAL.md` Step 5. Glossary every model ID and price verified,
    with the date.

## Out of scope

- Deployment surface and agent runtime (Messages API loop, Agent SDK, Managed Agents) →
  session 29 (P1.6)
- End-to-end four-stage architecture evaluation and orchestrator/subagent decomposition →
  session 32 (P1.2, P1.4)
- Reliability patterns → session 33
- Third-party Skills as an injection surface → session 35 (P5.2)
- Cost optimization mechanics → session 36 (P4.6)
- Human-in-the-loop gate placement inside an agentic flow → session 38 (P5.4)
- Stakeholder defense and ADRs → session 39 (P6.2)
- Migration between model versions → session 40 (P4.7)
- Reasoning-effort allocation for long-running agents → session 41 (P2.6)
- Skill packaging for cache reuse → session 42 (P2.5); plugin/Skill distribution in
  Claude Code → session 43 (P7.1)
