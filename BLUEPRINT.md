# BLUEPRINT.md — Exam Blueprints (canonical)

The two target exams, their official domain weights, and the documentation each
domain is drawn from. Everything in `prompts/` traces back to a domain here.

> **Verification note.** Every structural figure below (domains, weights, item
> counts, durations, passing scores, scenario bank) was verified verbatim against
> the official Anthropic exam guides — CCAR-F v1.0 on 2026-09-11, CCAR-P v1.1 on
> 2026-11-18 — see § Sources. Anthropic revises blueprints; re-verify against those
> PDFs before your exam date. Do *not* take figures from
> <https://www.pearsonvue.com/us/en/anthropic.html>: it carries none of them, though
> it is where exam-update dates are announced (see § Not a source).

---

## Sources

Provenance splits into two layers with different authority. Be precise about
which is which when describing this system.

### Layer 1 — Exam structure (authoritative)

Domains, weights, item counts, durations, passing scores, and the CCAR-F scenario
bank come from Anthropic's official exam guides, both publicly fetchable without
login. Each states it "is the authoritative reference for candidates preparing to
sit the exam."

- [CCAR-F Exam Guide (PDF)](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542750/Claude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf)
  — v1.0, effective July 2026. Not part of the December 2026 update.
- [CCAR-P Exam Guide v1.1 (PDF)](https://cc.sj-cdn.net/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1794946420/Claude_Certified_Architect_-_Professional_Exam_Guide_Updated_Dec_7.pdf)
  — v1.1, **effective December 7, 2026**, published 2026-11-17. Its document control
  summarizes the change as "Revised objectives, descriptions, and sample items."
  The superseded [v1.0 (PDF)](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542810/Claude+Certified+Architect+%E2%80%93+Professional+Exam+Guide.pdf)
  applies only to sittings before December 7, 2026; this repo no longer teaches it.

**Domain codes are the guides' domain numbers.** F3 is CCAR-F Domain 3 and P3 is CCAR-P
Domain 3, so a code reads straight across to the guide and to a score report.

CCAR-F's § 17 Appendix carries three lists that define scope precisely —
**Technologies and Concepts**, **In-Scope Topics**, and **Out-of-Scope Topics**.
CCAR-P has no appendix and no equivalent lists; its scope is the Domain 1–7
objectives in § 5, plus CCAR-F's scope, which v1.1 § 6 calls "assumed knowledge for this
exam".

**Section numbers differ between the guides.** CCAR-F's objectives are its § 6 task
statements. CCAR-P v1.1 dropped v1.0's candidate-profile section, so its objectives
moved to **§ 5** (the guide calls them "skills"), How to Prepare to § 6, and sample
questions to § 7. This repo calls both exams' objectives *task statements*; wherever a
prompt file says "§ 6 task statement" about a `P` ID, read CCAR-P § 5.

### Layer 2 — Documentation map (editorial)

**The exam guides cite no documentation URLs and provide no reading list.** The
~210 pages in § Documentation map are *our* selections, chosen to cover the
guides' domains, task statements, and CCAR-F's appendix lists. No official source
prescribes them.

The only guide text pointing at documentation at all is CCAR-P v1.1 § 6: "Review
official Anthropic documentation and engineering guidance for the Claude Developer
Platform, Agent Skills, Claude Code and the Claude Agent SDK, Claude Managed Agents,
and the Model Context Protocol, as well as the feature-availability and data-handling
differences across the Anthropic API, Amazon Bedrock, Google Vertex AI, and Microsoft
Foundry." It names areas, not pages. CCAR-F never mentions documentation as a prep
resource; its § 7 is hands-on build tasks only.

### Secondary — Anthropic Partner Academy prep courses

A parallel interpretation of the same blueprints, useful as a cross-check but
*not* authoritative: CCAR-P § 6 states "There is no single required course.
Anthropic does not guarantee that any particular resource ensures a passing
result." Public without login (module titles, objectives, durations, CCAR-F
lesson lists); actual lesson content is gated.

- [Prep courses index](https://anthropic-partners.skilljar.com/page/claude-certification-exam-prep-courses)
- [CCAR-F prep courses](https://anthropic-partners.skilljar.com/page/claude-certified-architect-foundations-prep-courses)
- [CCAR-P prep path](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional)
- [Partner Academy catalog](https://anthropic-partners.skilljar.com/)

Note: the Academy's `robots.txt` disallows ClaudeBot and other AI crawlers
site-wide. Consult these pages manually; do not scrape them.

### Not a source

- <https://www.pearsonvue.com/us/en/anthropic.html> — confirms the exams exist
  and handles scheduling. Contains no weights, item counts, durations, or scores.
  It *is* where exam-content updates are announced, so check it when re-verifying:
  on 2026-11-12 it announced the December 7, 2026 update to CCAR-P (alongside CCAO-F
  and CCDV-F; not CCAR-F) and the November 17 release of the new guides.
- Third-party prep sites (findskill.ai, prepgenaicerts.com and similar) — sell
  unofficial material; their claimed exam structure is unverified marketing.
- Anthropic's **AI Fluency Framework** and its "4 D's" (Delegation, Description,
  Discernment, Diligence) — a real Anthropic-published framework, but not exam
  scope. Verified 2026-09-11 (and again against CCAR-P v1.1 on 2026-11-18):
  `fluency`, `Delegation`, `Discernment`, and `Diligence` appear nowhere in either
  exam guide, and CCAR-P's scope is its § 5 objectives plus CCAR-F as assumed knowledge. (v1.1's P1.1 says
  "delegated to Claude" in its ordinary sense, not the framework's.) Reaches the Partner Academy catalog as education-sector
  material (developed with Rick Dakan, Ringling College of Art and Design;
  student and educator assignment guides), and the Academy lists it as
  recommended, not required. Two of its terms collide with this curriculum's
  core vocabulary — see GUIDELINES.md § Vocabulary collisions.

---

## Exam 1 — Claude Certified Architect: Foundations (CCAR-F)

| Property | Value |
|---|---|
| Items | 60 |
| Duration | 120 minutes |
| Format | **Scenario-based** — 4 scenarios drawn from a pool of 6 (~15 questions each*) |
| Item format | Multiple-choice and multiple-response items; each item states how many responses to select† |
| Passing score | 720 scaled (100–1000) |
| Conditions | Proctored, closed-book, no AI assistance |
| Validity | 12 months |
| Prerequisites | None |

\* **Derived, not stated.** The guide gives 60 items and "4 scenarios drawn from a bank of
6"; 15 per scenario is our arithmetic, and the guide does not commit to an even split.
Everything else in this table is verbatim.

† **Four options per item, scoring unstated.** The guide does not give an option count, but
all 12 of its sample questions have exactly four (A–D), and the 2026-10-02 sitting matched:
every item had four options, multiple-response items included. The guide does not say how a
multiple-response item is scored (all-or-nothing or partial credit); § 10 covers only the
scaled cut score.

### Domains

| # | Domain | Weight | Task statements | Tier 1 sessions |
|---|--------|--------|-----------------|-----------------|
| F1 | Agentic Architecture & Orchestration | **27%** | 7 | 5 |
| F2 | Tool Design & MCP Integration | **18%** | 5 | 3 |
| F3 | Claude Code Configuration & Workflows | **20%** | 6 | 3 |
| F4 | Prompt Engineering & Structured Output | **20%** | 6 | 4 |
| F5 | Context Management & Reliability | **15%** | 6 | 3 |

Session counts are proportional to weight — study time tracks what is scored. **Task
statement counts are not**: F5 carries six objectives on 15% of the score while F2 carries
five on 18%, so per-domain coverage must be measured against the statement count, not the
session count. See `.agents/TUTORIAL.md` § Readiness scoring.

### Task statements — the real scope

Domain weights say how much is scored; **§ 6 task statements say what is scored**, and
exam items are written against them ("Exam items are written against these objectives").
A session aligned to a domain but not to its task statements teaches the right subject
and the wrong material.

Every task statement below is quoted from the guide. Curriculum coverage is measured
per task statement, not per session — see `.agents/TUTORIAL.md` § Coverage scoring.

| ID | Task statement | Session |
|---|---|---|
| **1.1** | Design and implement agentic loops for autonomous task execution | S1 |
| **1.2** | Orchestrate multi-agent systems with coordinator-subagent patterns | S3 |
| **1.3** | Configure subagent invocation, context passing, and spawning | S3 |
| **1.4** | Implement multi-step workflows with enforcement and handoff patterns | S4 |
| **1.5** | Apply Agent SDK hooks for tool call interception and data normalization | S15 |
| **1.6** | Design task decomposition strategies for complex workflows | S2 |
| **1.7** | Manage session state, resumption, and forking | S4 |
| **2.1** | Design effective tool interfaces with clear descriptions and boundaries | S14 |
| **2.2** | Implement structured error responses for MCP tools | S16 |
| **2.3** | Distribute tools appropriately across agents and configure tool choice | S16 |
| **2.4** | Integrate MCP servers into Claude Code and agent workflows | S17 |
| **2.5** | Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively | S17 |
| **3.1** | Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization | S19 |
| **3.2** | Create and configure custom slash commands and skills | S20 |
| **3.3** | Apply path-specific rules for conditional convention loading | S19 |
| **3.4** | Determine when to use plan mode vs direct execution | S20 |
| **3.5** | Apply iterative refinement techniques for progressive improvement | S21 |
| **3.6** | Integrate Claude Code into CI/CD pipelines | S21 |
| **4.1** | Design prompts with explicit criteria to improve precision and reduce false positives | S8 |
| **4.2** | Apply few-shot prompting to improve output consistency and quality | S8 |
| **4.3** | Enforce structured output using tool use and JSON schemas | S11 |
| **4.4** | Implement validation, retry, and feedback loops for extraction quality | S12 |
| **4.5** | Design efficient batch processing strategies | S13 |
| **4.6** | Design multi-instance and multi-pass review architectures | S13 |
| **5.1** | Manage conversation context to preserve critical information across long interactions | S6 |
| **5.2** | Design effective escalation and ambiguity resolution patterns | S9 |
| **5.3** | Implement error propagation strategies across multi-agent systems | S7 |
| **5.4** | Manage context effectively in large codebase exploration | S7 |
| **5.5** | Design human review workflows and confidence calibration | S12 |
| **5.6** | Preserve information provenance and handle uncertainty in multi-source synthesis | S7 |

`Session` is the Tier 1 session that *owns* the statement — where it is taught and
drilled. Numbers refer to the sequence in `.agents/TUTORIAL.md` § Tier 1. A session may
support other statements, but exactly one owns each, and drill cards carry the statement
ID so per-domain accuracy measures the domain's own objectives.

#### Score-report objectives beyond § 6

The CCAR-F score report gives percent correct per *test objective* (29 of them), worded
differently from the § 6 statements. Most map onto a statement above. These go beyond any
§ 6 bullet, so each is given an owning session the same way:

| Objective (score report) | Owner |
|---|---|
| 1 — every session ends in a completed resolution or human escalation, however the loop terminates | S1 |
| 10, 11 — settings permissions vs. CLAUDE.md; choosing among CLAUDE.md, `.claude/rules/`, Skills, hooks, settings permissions | S19, S20 |
| 12 — Claude Code `PostToolUse` hooks running formatting, linting, or tests after every edit | S15 |
| 16 — `@` references vs. CLAUDE.md vs. inline description for project context | S19 |
| 21 — prefilled responses as a structured-output method | S11 |

The IDs run in guide order; the sessions do not, because Tier 1 is sequenced by dependency
rather than by domain. Task 1.5 (hooks) sits at session 15 because a hook intercepts a tool
call, so it must follow tool interface design at 14 — a session ordering that groups by
domain would teach it at 4 and leave the learner reasoning about interception before they
know what an interface is.

### § 17 Appendix — the scope boundary

CCAR-F's appendix is the arbiter when something looks adjacent-but-tested, or
tested-but-adjacent. All three lists are quoted verbatim.

#### Technologies and Concepts — "might appear on the exam"

- **Claude Agent SDK** — agent definitions, agentic loops, `stop_reason` handling, hooks
  (`PostToolUse`, tool call interception), subagent spawning via Task tool, `allowedTools`
- **MCP** — servers, tools, resources, `isError` flag, tool descriptions, tool
  distribution, `.mcp.json`, environment variable expansion
- **Claude Code** — CLAUDE.md hierarchy (user/project/directory), `.claude/rules/` with
  YAML frontmatter path-scoping, `.claude/commands/`, `.claude/skills/` with SKILL.md
  frontmatter (`context: fork`, `allowed-tools`, `argument-hint`), plan mode, direct
  execution, `/memory`, `/compact`, `--resume`, `fork_session`, Explore subagent
- **Claude Code CLI** — `-p` / `--print`, `--output-format json`, `--json-schema`
- **Claude API** — `tool_use` with JSON schemas, `tool_choice` (`"auto"`, `"any"`, forced),
  `stop_reason` values (`"tool_use"`, `"end_turn"`), `max_tokens`, system prompts
- **Message Batches API** — 50% cost savings, up to 24-hour window, `custom_id`, polling,
  no multi-turn tool calling support
- **JSON Schema** — required vs optional, enums, nullable, `"other"` + detail string,
  strict mode
- **Pydantic** — schema validation, semantic validation errors, validation-retry loops
- **Built-in tools** — Read, Write, Edit, Bash, Grep, Glob
- **Few-shot prompting**, **prompt chaining**
- **Context window management** — token budgets, progressive summarization,
  lost-in-the-middle, context extraction, scratchpad files
- **Session management** — resumption, `fork_session`, named sessions, session context
  isolation
- **Confidence scoring** — field-level, calibration with labeled validation sets,
  stratified sampling

#### Out-of-Scope Topics — "will not appear on the exam"

Teaching these costs exam points twice: the time spent, and the confidence that the
material was worth it.

- Fine-tuning or training custom models
- Claude API authentication, billing, or account management
- Detailed implementation of specific languages or frameworks (beyond tool/schema config)
- **Deploying or hosting MCP servers** (infrastructure, networking, container orchestration)
- Claude's internal architecture, training process, or model weights
- Constitutional AI, RLHF, or safety training methodologies
- Embedding models or vector database implementation details
- Computer use (browser automation, desktop interaction)
- Vision/image analysis
- **Streaming API implementation** or server-sent events
- **Rate limiting, quotas, or API pricing calculations**
- **OAuth, API key rotation, or authentication protocol details**
- **Specific cloud provider configurations** (AWS, GCP, Azure)
- Performance benchmarking or model comparison metrics
- **Prompt caching implementation details (beyond knowing it exists)**
- Token counting algorithms or tokenization specifics

The bolded entries are ones this curriculum has taught or is adjacent to. Prompt caching
is the sharpest: the permitted depth is *that it exists*. Cache prefixes, write premiums,
read discounts, TTL selection, and break-even arithmetic are all excluded — correct
arithmetic on an excluded topic is still wasted study.

### The six scenario archetypes

The exam pool. Tier 2 drills these directly; each Tier 2 session owns one.

1. Customer support resolution with escalation logic
2. Claude Code team configuration and workflows
3. Multi-agent research system orchestration
4. Developer productivity tooling with built-in utilities
5. Automated code review inside a CI/CD pipeline
6. Structured data extraction from unstructured sources

### Products in scope

Claude API · Agent SDK · Claude Code · MCP · Claude Projects

---

## Exam 2 — Claude Certified Architect: Professional (CCAR-P)

**Guide v1.1, effective December 7, 2026.** Everything in this section is quoted or
derived from v1.1; see § Sources for v1.0.

| Property | Value |
|---|---|
| Items | 70 — "of which 60 are scored and 10 are unscored items. Unscored items are not identified and do not affect your score." |
| Duration | 120 minutes |
| Item format | "Scenario-based multiple-choice items; each item states how many responses to select" |
| Passing score | 720 scaled (100–1000) |
| Delivery | Proctored: online and/or test center |
| Validity | 12 months |
| Prerequisites | None. CCAR-F is "recommended, but not required, preparation", and § 6 says its scope "is assumed knowledge for this exam" |
| Assumed experience | 3+ yrs systems architecture or platform engineering, 6+ months hands-on with Claude in production |

**Items are standalone, not scenario-bundled.** Unlike CCAR-F there is no scenario bank:
each item carries its own scenario. The three § 7 samples run 75–95 words of stem plus four long options, and § 6
warns that "exam scenarios present such artifacts" — architecture diagrams, configuration
files, logs and traces, evaluation results, and code — "and expect you to reason from
them." Write Professional items that way.

**Option count.** All three v1.1 samples have four options (A–D), as the v1.0 samples did.
The guide does not state an option count or how multiple-response items are scored.

### Domains

| # | Domain | Weight | v1.0 | Task statements | Tier 3 sessions |
|---|--------|--------|------|-----------------|-----------------|
| P1 | Solution Design and Architecture | **18%** | 17% | 6 | 3 |
| P2 | Claude Models, Prompting, and Context Engineering | **13%** | 13% | 6 | 2 |
| P3 | Integration | **21%** | 19% | 8 | 3 |
| P4 | Evaluation, Testing, and Optimization | **17%** | 16% | 7 | 3 |
| P5 | Governance, Safety, and Risk Management | **16%** | 14% | 6 | 3 |
| P6 | Stakeholder Communication and Lifecycle Management | **7%** | 14% | 3 | 1 |
| P7 | Developer Productivity and Operational Enablement | **8%** | 7% | 3 | 1 |

`Tier 3 sessions` counts sessions by their `Domain` label in `.agents/SEQUENCE.md`; three
labels changed with v1.1 so that session counts track the new weights (see the note under
that table).

**P5, P6, P7 together are 31% of Professional and appear nowhere on Foundations.** P6
halved in v1.1, but P5 grew, and P5 is where Foundations-strong candidates are thinnest:
compliance controls, injection surfaces, risk ranking, and bias sources.

### Task statements

v1.1 replaces v1.0's one-line bullets with **named objectives**, each a heading plus a
one-sentence description, and the guide says "Each domain below lists the skills against
which exam items are written." The IDs are ours: `P` + domain number + the objective's
position in that domain's § 5 list. The `P` prefix keeps them distinct from CCAR-F IDs on
drill cards, where a bare `3.1` already means a Foundations task.

The `Task statement` column quotes the guide's description verbatim. It carries the scope;
the heading is a label. The descriptions are written as **diagnose-and-select** tasks
("Analyzing…", "Evaluating…", "and selecting the…") against stated constraints, which is
the shape items take. A session teaching the concept without the selection under
constraint teaches the wrong skill.

| ID | Objective | Task statement (verbatim) | Session |
|---|---|---|---|
| **P1.1** | Task Delegation Between Claude and Humans | Determining which components of a described business process should be delegated to Claude, retained by humans, or handled collaboratively, and justifying each assignment against reversibility, stakes, and accountability. | S31 |
| **P1.2** | End-to-End Architecture Evaluation | Evaluating whether a proposed end-to-end architecture (input, processing, output, feedback) satisfies stated scalability, maintainability, and access-control requirements, and identifying the component that fails first under a specified load or trust condition. | S32 |
| **P1.3** | Architectural Pattern Selection | Selecting among workflow, agentic, augmented-LLM, and Skills-based architectural patterns for a use case with stated reuse, governance, and risk-profile constraints, and justifying the delegation boundary the selected pattern establishes. | S31 |
| **P1.4** | Orchestrator and Subagent Decomposition | Evaluating a proposed orchestrator/subagent decomposition for a multi-step workload against stated observability and error-recovery requirements, and identifying where task boundaries, control flow, or result synthesis will fail. | S32 |
| **P1.5** | Value-Based Architectural Decisions | Selecting the architectural option that maximizes measurable business outcome under a stated cost or SLA ceiling, weighing competing feature proposals against stated business value pillars such as efficiency, transformation, productivity, solution cost, and performance SLAs. | S31 |
| **P1.6** | Deployment Surface and Agent Runtime Selection | Selecting a deployment surface (Anthropic API, Amazon Bedrock, Google Vertex AI, Microsoft Foundry) and an agent runtime (Messages API loop, self-hosted Agent SDK or headless Claude Code, Claude Managed Agents) under data residency, compliance, model-availability, and operational-ownership constraints, and justifying the trade-offs the selection imposes on latency, feature availability, hosting, session state, sandboxing, and data custody. | S29 |
| **P2.1** | Model Tier Selection | Selecting the Claude model tier that satisfies all binding latency, cost, and quality constraints for a stated workload profile, and identifying why each rejected alternative fails. | S31 |
| **P2.2** | System Prompt Diagnosis and Revision | Diagnosing the underspecification in a system prompt that produces degraded or inconsistent output, and selecting the revision that constrains scope, format, and behavior without over-constraining legitimate variation. | S42 |
| **P2.3** | Prompting Technique Selection | Applying the prompting technique (zero-shot, few-shot, prompted reasoning versus native thinking, structured output) that addresses an observed failure pattern for a task of stated complexity without unnecessary token cost. | S42 |
| **P2.4** | Context Composition and Token Economics | Analyzing context composition and caching behavior against a token budget and a defined call volume to determine where token consumption can be reduced without loss of task-relevant information. | S41 |
| **P2.5** | Cache Breakpoints and Reusable Packaging | Applying cache breakpoints and modular or Skill-based packaging to a repeated prompt sequence so that stable content precedes dynamic content and reuse is maximized across the stated call pattern. | S42 |
| **P2.6** | Reasoning Effort and Context Lifecycle | Allocating reasoning effort and selecting a context lifecycle strategy (context editing, memory tool, compaction) that sustains task performance across the stated session length for a long-running agent workload with stated latency and accuracy requirements. | S41 |
| **P3.1** | Least-Privilege Tool Configuration | Evaluating an agent or subagent tool configuration against least-privilege and minimal-footprint principles, and determining which tool connections to remove, scope down, or replace with a context-efficient access pattern. | S41 |
| **P3.2** | Authentication and Authorization Posture | Analyzing the authentication and authorization posture of an integration design to identify credential exposure and privilege escalation risks, and specifying the mitigation for each. | S28 |
| **P3.3** | Relieving the Binding Performance Constraint | Evaluating candidate configuration changes (retrieval depth, model tier, caching, call pattern) for a system whose dominant constraint is accuracy or latency, and selecting the change that relieves the binding constraint at least cost to the other. | S32 |
| **P3.4** | Instrumentation and Monitoring Gaps | Analyzing the instrumentation gap in a scaled agentic architecture where a described failure went undetected, and selecting the monitoring strategy that would have surfaced it. | S33 |
| **P3.5** | Retrieval Architecture Selection | Selecting among retrieval architectures (pre-built RAG pipeline, agentic search with tools, full-corpus context) based on corpus characteristics, query pattern, and latency and cost limits, and, when indexing is chosen, specifying the contextual-retrieval and fallback configuration that maximizes retrieval quality within those limits. | S30 |
| **P3.6** | Connection Mechanism Selection | Evaluating MCP, direct API/CLI, and agent-to-agent handoff against scenario constraints on latency, security, and statefulness, and selecting the connection mechanism the constraints favor. | S28 |
| **P3.7** | Progressive Discovery vs. Monolithic Context Loading | Evaluating progressive discovery against loading everything into context up front for a task with stated context demands and latency tolerance, and selecting the strategy whose context economics fit the workload. | S41 |
| **P3.8** | Production Reliability Controls | Analyzing the failure pattern in error traces or throughput data from a production integration, and specifying the reliability control (rate-limit handling, retry and backoff, idempotency for side-effecting tools, or fallback routing) that addresses it without introducing duplicate effects. | S33 |
| **P4.1** | Evaluation Coverage Gaps | Analyzing an existing evaluation suite after a failure reached production to determine which metric dimension (accuracy, groundedness, latency, cost, safety, security) or grading target was missing, and specifying the metric that would have detected the failure pre-release. | S34 |
| **P4.2** | Deriving Evaluations from Business Processes | Determining which portion of a business process constitutes a valid evaluation for a decision it must support (model change, prompt change, release gate), deriving the success criterion from the business outcome, and selecting the test-methodology mix that covers the deployed distribution. | S34 |
| **P4.3** | LLM-as-Judge Design and Bias | Evaluating the design of an LLM-as-judge or rubric-based evaluation whose results are inconsistent with human review, and selecting the correction that addresses the responsible bias (position, verbosity, self-preference, judge drift). | S34 |
| **P4.4** | Experimental Design for Configuration Comparison | Applying an experimental design that, within a stated sample and cost budget, yields an interpretable comparison of two candidate prompt or model configurations, including the number of trials per case needed to separate the configuration effect from run-to-run variance. | S34 |
| **P4.5** | Root-Cause Isolation from Logs and Traces | Isolating the root cause of a failing Claude system from its logs or traces among prompt failure, retrieval failure, hallucination, tool or subagent error, and model mismatch, and specifying the corrective action. | S33 |
| **P4.6** | Cost and Latency Optimization | Analyzing cost and latency telemetry, including cache hit rates, to determine where spend or latency is concentrated, and specifying the optimization that reduces it without violating the stated quality floor. | S36 |
| **P4.7** | Model Version Migration | Evaluating migration readiness from a model deprecation timeline and regression results for a candidate version, and selecting the response (pin, re-tune prompts, re-baseline evaluations, or defer) that manages behavioral drift within the timeline. | S40 |
| **P5.1** | Guardrail Placement | Analyzing guardrail placement in a system design against a described misuse path, and selecting the control that closes the path without degrading a stated legitimate use case. | S35 |
| **P5.2** | Prompt Injection Surface and Controls | Analyzing the injection surface of an architecture whose model context includes retrieved documents, tool results, MCP server responses, or third-party Skills, and specifying the controls that prevent untrusted content from being treated as instruction. | S35 |
| **P5.3** | Risk Assessment and Ranking | Analyzing a proposed deployment for risk categories (attack surface, failure modes, token and quota exhaustion, dependency and supply-chain risk) and ranking them by exposure. | S38 |
| **P5.4** | Human-in-the-Loop Checkpoints | Analyzing where human-in-the-loop checkpoints must sit in an agentic workflow containing irreversible or high-stakes actions, and specifying gates that pause execution without stalling acceptable-risk paths. | S38 |
| **P5.5** | Architectural Controls for Compliance Obligations | Evaluating candidate architectural controls (data residency and deployment surface, retention and zero-data-retention configuration, PII detection and redaction, audit logging, tenant isolation) against a stated compliance obligation, and selecting the control set that evidences the obligation. | S37 |
| **P5.6** | Bias Source Identification and Mitigation | Evaluating the evidence for bias when outputs or a dataset show disparate results across groups, and selecting the mitigation appropriate to its source, distinguishing data bias from prompt-framing and evaluation-design bias. | S38 |
| **P6.1** | Unsupportable Commitments in Requirements and SLAs | Identifying a commitment in discovery notes or a draft SLA that the proposed Claude architecture cannot meet, and specifying the requirement clarification or architectural change that resolves it. | S39 |
| **P6.2** | Architecture Decision Records | Evaluating a draft architecture decision record against a stakeholder constraint it fails to address, and selecting the revision that makes the trade-off and its residual risk explicit without overstating certainty about model behavior. | S39 |
| **P6.3** | Operational Handoff Completeness | Identifying the missing assumption, dependency, or runbook element in a handoff package that would block the team receiving a Claude system entering operation, and specifying the documentation that closes the gap. | S40 |
| **P7.1** | Packaging and Distributing Claude Code Workflows | Evaluating how to package and distribute a Claude Code workflow proven on one team across an organization, including plugin contents (skills, hooks, subagents, commands, MCP configuration), marketplace, and managed settings, and deciding which controls are enforced centrally versus left to teams so the workflow stays safe when it runs unattended. | S43 |
| **P7.2** | Agent SDK and Claude Code Configuration | Configuring the Claude Agent SDK or Claude Code (permission modes such as default, acceptEdits, plan, auto, dontAsk, and bypassPermissions; hooks; subagent definitions; headless or CI operation) to support a team workflow within stated safety and automation guardrails. | S43 |
| **P7.3** | Accountability for AI-Generated Code | Analyzing the review and accountability process of a team adopting AI-assisted development, and identifying the control that preserves human ownership of AI-generated code. | S43 |

`Session` is the Tier 3 session that owns the statement, numbered as in
`.agents/SEQUENCE.md` § Tier 3. Ownership follows content, not the session's `Domain`
label — see the note under that table.

### What changed from v1.0

Recorded so a maintainer can audit the re-mapping, and so material taught under v1.0 is
recognizable. **IDs were renumbered**: a v1.0 `P3.5` and a v1.1 `P3.5` are different
objectives.

- **Format:** 63 items → 70 (60 scored + 10 unscored); "multiple-choice and
  multiple-response" → "scenario-based multiple-choice", still stating how many to select.
- **Weights:** P1 +1, P3 +2, P4 +1, P5 +2, P7 +1; **P6 −7** (14% → 7%).
- **Dropped from scope:** "translate business problems into Claude-based AI solutions"
  as a stand-alone objective (v1.0 P1.1); "templates" (v1.0 P2.2); the named regulations
  "GDPR, HIPAA, FedRAMP" (v1.0 P5.4; v1.1 P5.5 names controls, not regulations);
  "fairness" and "transparency" (v1.0 P5.5; v1.1 P5.6 is bias only); structured discovery
  and requirement gathering, stakeholder feedback loops, general lifecycle-phase support
  (v1.0 P6.1, P6.3, P6.5 as written);
  "improve developer workflows" and "support debugging" as stand-alone P7 objectives;
  RAG *chunking* strategy as a named objective (v1.1 P3.5 keeps indexing only as the
  "when indexing is chosen" branch); the "capability bloat" and "mixed methodologies"
  wording (now "least-privilege and minimal-footprint" and "test-methodology mix").
- **New to scope:** Claude/human task delegation (P1.1); Skills-based as a fourth
  architectural pattern (P1.3); deployment surface *and agent runtime* selection,
  including Claude Managed Agents and Microsoft Foundry (P1.6); prompted reasoning versus
  native thinking (P2.3); cache breakpoints (P2.5); reasoning effort and context lifecycle
  — context editing, memory tool, compaction (P2.6); agentic search and full-corpus context
  as retrieval architectures (P3.5); production reliability controls — rate limits,
  backoff, idempotency, fallback routing (P3.8); groundedness as an eval dimension (P4.1);
  deriving evals from business processes (P4.2); named judge biases — position, verbosity,
  self-preference, judge drift (P4.3); trials per case against run-to-run variance (P4.4);
  retrieval failure and tool/subagent error as root causes (P4.5); cache hit rates (P4.6);
  model version migration (P4.7; under v1.0 this repo taught migration in its P6
  lifecycle session); third-party Skills as an injection
  surface (P5.2); token/quota exhaustion and supply-chain risk (P5.3); data vs.
  prompt-framing vs. evaluation-design bias (P5.6); ADRs (P6.2); plugin marketplaces and managed
  settings (P7.1); the six permission modes and headless/CI operation (P7.2);
  accountability for AI-generated code (P7.3).
- **Sharpened, not new:** v1.0's "expectation alignment (including SLAs)" becomes finding
  an unsupportable commitment in discovery notes or a draft SLA (P6.1), and its lifecycle
  "handoff" becomes auditing a handoff package for the gap that blocks the receiving team
  (P6.3).
- **Sample items:** all three replaced. v1.1's samples are longer, constraint-dense, and
  reward naming the binding constraint *and* the trade-off accepted (Sample 1), the
  enforceable control over the prompt-level one (Sample 2), and gate placement by
  reversibility and stakes (Sample 3).

---

## Documentation map

Prompt files cite from these. Claude Code docs live on `code.claude.com`;
API/platform docs on `platform.claude.com`. (Both moved from `docs.claude.com`
— old links 301-redirect.)

### Agentic architecture & orchestration (F1, P1)
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/agent-teams>
- <https://code.claude.com/docs/en/workflows>
- <https://code.claude.com/docs/en/agent-sdk/overview>
- <https://code.claude.com/docs/en/agent-sdk/agent-loop>
- <https://code.claude.com/docs/en/agent-sdk/subagents>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent>

### Claude Code configuration & workflows (F3, P7)
- <https://code.claude.com/docs/en/memory> — CLAUDE.md hierarchy, auto memory
- <https://code.claude.com/docs/en/settings> · <https://code.claude.com/docs/en/settings-reference>
- <https://code.claude.com/docs/en/hooks> · <https://code.claude.com/docs/en/hooks-guide>
- <https://code.claude.com/docs/en/skills>
- <https://code.claude.com/docs/en/commands>
- <https://code.claude.com/docs/en/permissions> · <https://code.claude.com/docs/en/permission-modes>
- <https://code.claude.com/docs/en/plugins> · <https://code.claude.com/docs/en/plugins-reference>
- <https://code.claude.com/docs/en/plugins/create-marketplace> · <https://code.claude.com/docs/en/plugins/host-marketplace> — P7.1 org distribution
- <https://code.claude.com/docs/en/auto-mode-config> · <https://code.claude.com/docs/en/agent-sdk/permissions> — P7.2 permission modes
- <https://code.claude.com/docs/en/github-actions> · <https://code.claude.com/docs/en/gitlab-ci-cd>
- <https://code.claude.com/docs/en/code-review>
- <https://code.claude.com/docs/en/headless> · <https://code.claude.com/docs/en/cli-reference>
- <https://code.claude.com/docs/en/best-practices>
- <https://code.claude.com/docs/en/managed-settings> · <https://code.claude.com/docs/en/admin-setup>

### Prompt engineering & structured output (F4, P2)
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5>
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>

### Tool design & MCP (F2, P3)
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling>
- <https://code.claude.com/docs/en/mcp> · <https://code.claude.com/docs/en/mcp-quickstart>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>
- <https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers>
- <https://code.claude.com/docs/en/managed-mcp>

### Context management & reliability (F5, P2)
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://platform.claude.com/docs/en/build-with-claude/compaction>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://code.claude.com/docs/en/context-window>
- <https://code.claude.com/docs/en/sessions> · <https://code.claude.com/docs/en/checkpointing>

### Integration (P3)
- <https://platform.claude.com/docs/en/managed-agents/overview>
- <https://platform.claude.com/docs/en/managed-agents/webhooks>
- <https://platform.claude.com/docs/en/managed-agents/environments>
- <https://platform.claude.com/docs/en/managed-agents/sessions> · <https://platform.claude.com/docs/en/managed-agents/tools> — P1.6 runtime selection
- <https://platform.claude.com/docs/en/api/errors> · <https://platform.claude.com/docs/en/api/rate-limits> — P3.8 reliability controls
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock>
- <https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed>
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry>
- <https://code.claude.com/docs/en/llm-gateway> · <https://code.claude.com/docs/en/gateways>
- <https://platform.claude.com/docs/en/build-with-claude/files>
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/embeddings>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>

### Evaluation, testing & optimization (P4)
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak>
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>
- <https://platform.claude.com/docs/en/about-claude/pricing>

### Governance, safety & risk (P5)
- <https://platform.claude.com/docs/en/manage-claude/workspaces>
- <https://platform.claude.com/docs/en/manage-claude/user-management>
- <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>
- <https://platform.claude.com/docs/en/manage-claude/data-residency>
- <https://platform.claude.com/docs/en/manage-claude/compliance-api>
- <https://platform.claude.com/docs/en/manage-claude/cmek>
- <https://platform.claude.com/docs/en/manage-claude/workload-identity-federation>
- <https://platform.claude.com/docs/en/manage-claude/inference-hooks>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>
- <https://code.claude.com/docs/en/security> · <https://code.claude.com/docs/en/security-guidance>
- <https://code.claude.com/docs/en/sandboxing> · <https://code.claude.com/docs/en/zero-data-retention>
- <https://code.claude.com/docs/en/legal-and-compliance>
- <https://www.anthropic.com/legal/aup>

### Lifecycle & operational enablement (P6, P7)
- <https://platform.claude.com/docs/en/about-claude/models/migration-guide>
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api>
- <https://platform.claude.com/docs/en/manage-claude/analytics-api>
- <https://platform.claude.com/docs/en/manage-claude/claude-code-analytics-api>
- <https://code.claude.com/docs/en/analytics> · <https://code.claude.com/docs/en/monitoring-usage>
- <https://code.claude.com/docs/en/costs>
- <https://platform.claude.com/docs/en/managed-agents/budgets>

### Model selection (P1, P2)
- <https://platform.claude.com/docs/en/models/overview>
- <https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions>
- <https://platform.claude.com/docs/en/models/fable-5-2/overview> · <https://platform.claude.com/docs/en/models/opus-5-5/overview>
- <https://platform.claude.com/docs/en/models/sonnet-5-5/overview> · <https://platform.claude.com/docs/en/models/haiku-5-5/overview>
- Version-pinned: the lineup changes, so re-check against models/overview before teaching

### Doc indexes (for finding anything not listed)
- <https://code.claude.com/docs/llms.txt>
- <https://platform.claude.com/llms.txt>
