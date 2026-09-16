# BLUEPRINT.md — Exam Blueprints (canonical)

The two target exams, their official domain weights, and the documentation each
domain is drawn from. Everything in `prompts/` traces back to a domain here.

> **Verification note.** Every structural figure below (domains, weights, item
> counts, durations, passing scores, scenario bank) was verified verbatim against
> the official Anthropic exam guides on 2026-09-11 — see § Sources. Anthropic
> revises blueprints; re-verify against those PDFs before your exam date. Do
> *not* re-verify against <https://www.pearsonvue.com/us/en/anthropic.html>: that
> page lists exam names only and contains none of these figures.

---

## Sources

Provenance splits into two layers with different authority. Be precise about
which is which when describing this system.

### Layer 1 — Exam structure (authoritative)

Domains, weights, item counts, durations, passing scores, and the CCAR-F scenario
bank come from Anthropic's official exam guides. Both are v1.0, effective July
2026, and are publicly fetchable without login from the Partner Academy CDN.
Each states it "is the authoritative reference for candidates preparing to sit
the exam."

- [CCAR-F Exam Guide (PDF)](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542750/Claude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf)
- [CCAR-P Exam Guide (PDF)](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542810/Claude+Certified+Architect+%E2%80%93+Professional+Exam+Guide.pdf)

**Our P-codes are not the guide's domain numbers.** This file orders the Professional
domains by weight and labels them P1–P7; the guide lists them in its own order as Domain
1–7. The domains, names, and weights are identical — only the numbering differs. Read
across when comparing this file to the guide:

| Ours | Guide | Domain | Weight |
|---|---|---|---|
| P1 | Domain 3 | Integration | 19% |
| P2 | Domain 1 | Solution Design & Architecture | 17% |
| P3 | Domain 4 | Evaluation, Testing & Optimization | 16% |
| P4 | Domain 5 | Governance, Safety & Risk Management | 14% |
| P5 | Domain 6 | Stakeholder Communication & Lifecycle Management | 14% |
| P6 | Domain 2 | Claude Models, Prompting & Context Engineering | 13% |
| P7 | Domain 7 | Developer Productivity & Operational Enablement | 7% |

CCAR-F's § 17 Appendix carries three lists that define scope precisely —
**Technologies and Concepts**, **In-Scope Topics**, and **Out-of-Scope Topics**.
CCAR-P has no appendix and no equivalent lists; its scope is the Domain 1–7 task
statements in § 6 and nothing else.

### Layer 2 — Documentation map (editorial)

**The exam guides cite no documentation URLs and provide no reading list.** The
~210 pages in § Documentation map are *our* selections, chosen to cover the
guides' domains, task statements, and CCAR-F's appendix lists. No official source
prescribes them.

The only guide text pointing at documentation at all is CCAR-P § 7: "Review
official Anthropic documentation for the Claude API, models, prompt engineering,
MCP, and Skills." It names areas, not pages. CCAR-F never mentions documentation
as a prep resource; its § 7 is hands-on build tasks only.

### Secondary — Anthropic Partner Academy prep courses

A parallel interpretation of the same blueprints, useful as a cross-check but
*not* authoritative: CCAR-P § 7 states "There is no single required course.
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
- Third-party prep sites (findskill.ai, prepgenaicerts.com and similar) — sell
  unofficial material; their claimed exam structure is unverified marketing.
- Anthropic's **AI Fluency Framework** and its "4 D's" (Delegation, Description,
  Discernment, Diligence) — a real Anthropic-published framework, but not exam
  scope. Verified 2026-09-11: `fluency`, `Delegation`, `Discernment`, and
  `Diligence` appear nowhere in either exam guide, and CCAR-P's scope is its § 6
  task statements alone. Reaches the Partner Academy catalog as education-sector
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
| Question types | Multiple choice, multiple response |
| Passing score | 720 scaled (100–1000) |
| Conditions | Proctored, closed-book, no AI assistance |
| Validity | 12 months |
| Prerequisites | None |

\* **Derived, not stated.** The guide gives 60 items and "4 scenarios drawn from a bank of
6"; 15 per scenario is our arithmetic, and the guide does not commit to an even split.
Everything else in this table is verbatim.

### Domains

| # | Domain | Weight | Tier 1 sessions |
|---|--------|--------|-----------------|
| F1 | Agentic Architecture & Orchestration | **27%** | 4 |
| F2 | Claude Code Configuration & Workflows | **20%** | 3 |
| F3 | Prompt Engineering & Structured Output | **20%** | 3 |
| F4 | Tool Design & MCP Integration | **18%** | 3 |
| F5 | Context Management & Reliability | **15%** | 2 |

Session counts are proportional to weight — study time tracks what is scored.

**Our F-codes are not the guide's domain numbers**, for the same reason as the P-codes
below: this file orders domains by weight, the guide uses its own order. F1 and F5 happen
to coincide; F2, F3, and F4 do not. The score report is per-domain, so read across before
comparing a result to the guide:

| Ours | Guide | Domain | Weight |
|---|---|---|---|
| F1 | Domain 1 | Agentic Architecture & Orchestration | 27% |
| F2 | Domain 3 | Claude Code Configuration & Workflows | 20% |
| F3 | Domain 4 | Prompt Engineering & Structured Output | 20% |
| F4 | Domain 2 | Tool Design & MCP Integration | 18% |
| F5 | Domain 5 | Context Management & Reliability | 15% |

### Task statements — the real scope

Domain weights say how much is scored; **§ 6 task statements say what is scored**, and
exam items are written against them ("Exam items are written against these objectives").
A session aligned to a domain but not to its task statements teaches the right subject
and the wrong material.

Every task statement below is quoted from the guide. Curriculum coverage is measured
per task statement, not per session — see `.agents/TUTORIAL.md` § Coverage scoring.

| ID | Task statement | Owning session |
|---|---|---|
| **1.1** | Design and implement agentic loops for autonomous task execution | T1-01 |
| **1.2** | Orchestrate multi-agent systems with coordinator-subagent patterns | T1-03 |
| **1.3** | Configure subagent invocation, context passing, and spawning | T1-03 |
| **1.4** | Implement multi-step workflows with enforcement and handoff patterns | T1-02 |
| **1.5** | Apply Agent SDK hooks for tool call interception and data normalization | T1-06 |
| **1.6** | Design task decomposition strategies for complex workflows | T1-04 |
| **1.7** | Manage session state, resumption, and forking | T1-03 |
| **2.1** | Design effective tool interfaces with clear descriptions and boundaries | T1-11 |
| **2.2** | Implement structured error responses for MCP tools | T1-13 |
| **2.3** | Distribute tools appropriately across agents and configure tool choice | T1-11 |
| **2.4** | Integrate MCP servers into Claude Code and agent workflows | T1-12 |
| **2.5** | Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively | T1-12 |
| **3.1** | Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization | T1-05 |
| **3.2** | Create and configure custom slash commands and skills | T1-06 |
| **3.3** | Apply path-specific rules for conditional convention loading | T1-05 |
| **3.4** | Determine when to use plan mode vs direct execution | T1-07 |
| **3.5** | Apply iterative refinement techniques for progressive improvement | T1-07 |
| **3.6** | Integrate Claude Code into CI/CD pipelines | T1-07 |
| **4.1** | Design prompts with explicit criteria to improve precision and reduce false positives | T1-08 |
| **4.2** | Apply few-shot prompting to improve output consistency and quality | T1-08 |
| **4.3** | Enforce structured output using tool use and JSON schemas | T1-09 |
| **4.4** | Implement validation, retry, and feedback loops for extraction quality | T1-09 |
| **4.5** | Design efficient batch processing strategies | T1-10 |
| **4.6** | Design multi-instance and multi-pass review architectures | T1-10 |
| **5.1** | Manage conversation context to preserve critical information across long interactions | T1-14 |
| **5.2** | Design effective escalation and ambiguity resolution patterns | T1-15 |
| **5.3** | Implement error propagation strategies across multi-agent systems | T1-15 |
| **5.4** | Manage context effectively in large codebase exploration | T1-14 |
| **5.5** | Design human review workflows and confidence calibration | T1-09 |
| **5.6** | Preserve information provenance and handle uncertainty in multi-source synthesis | T1-14 |

Owning session is where the task statement is *taught and drilled*. A session may
support others, but exactly one owns each statement, and drill cards carry the
statement ID so per-domain accuracy measures the domain's own objectives.

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

| Property | Value |
|---|---|
| Items | 63 |
| Duration | 120 minutes |
| Format | **Standalone items** (not scenario-bundled) |
| Passing score | 720 scaled (100–1000) |
| Prerequisites | None formally; assumes Foundations-level fluency |
| Assumed experience | 3+ yrs architecture/platform engineering, 6+ mo Claude in production |

### Domains

| # | Domain | Weight | Tier 3 sessions |
|---|--------|--------|-----------------|
| P1 | Integration | **19%** | 3 |
| P2 | Solution Design & Architecture | **17%** | 3 |
| P3 | Evaluation, Testing & Optimization | **16%** | 3 |
| P4 | Governance, Safety & Risk Management | **14%** | 2 |
| P5 | Stakeholder Communication & Lifecycle Management | **14%** | 2 |
| P6 | Claude Models, Prompting & Context Engineering | **13%** | 2 |
| P7 | Developer Productivity & Operational Enablement | **7%** | 1 |

**P4, P5, P7 together are 35% of Professional and appear nowhere on Foundations.**
They are the most common reason a strong Foundations candidate fails Professional —
the curriculum treats them as first-class, not as an afterthought.

---

## Documentation map

Prompt files cite from these. Claude Code docs live on `code.claude.com`;
API/platform docs on `platform.claude.com`. (Both moved from `docs.claude.com`
— old links 301-redirect.)

### Agentic architecture & orchestration (F1, P2)
- <https://code.claude.com/docs/en/sub-agents>
- <https://code.claude.com/docs/en/agent-teams>
- <https://code.claude.com/docs/en/workflows>
- <https://code.claude.com/docs/en/agent-sdk/overview>
- <https://code.claude.com/docs/en/agent-sdk/agent-loop>
- <https://code.claude.com/docs/en/agent-sdk/subagents>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent>

### Claude Code configuration & workflows (F2, P7)
- <https://code.claude.com/docs/en/memory> — CLAUDE.md hierarchy, auto memory
- <https://code.claude.com/docs/en/settings> · <https://code.claude.com/docs/en/settings-reference>
- <https://code.claude.com/docs/en/hooks> · <https://code.claude.com/docs/en/hooks-guide>
- <https://code.claude.com/docs/en/skills>
- <https://code.claude.com/docs/en/commands>
- <https://code.claude.com/docs/en/permissions> · <https://code.claude.com/docs/en/permission-modes>
- <https://code.claude.com/docs/en/plugins> · <https://code.claude.com/docs/en/plugins-reference>
- <https://code.claude.com/docs/en/github-actions> · <https://code.claude.com/docs/en/gitlab-ci-cd>
- <https://code.claude.com/docs/en/code-review>
- <https://code.claude.com/docs/en/headless> · <https://code.claude.com/docs/en/cli-reference>
- <https://code.claude.com/docs/en/best-practices>
- <https://code.claude.com/docs/en/managed-settings> · <https://code.claude.com/docs/en/admin-setup>

### Prompt engineering & structured output (F3, P6)
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5>
- <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
- <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/effort>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>

### Tool design & MCP (F4, P1)
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

### Context management & reliability (F5, P6)
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://platform.claude.com/docs/en/build-with-claude/compaction>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://code.claude.com/docs/en/context-window>
- <https://code.claude.com/docs/en/sessions> · <https://code.claude.com/docs/en/checkpointing>

### Integration (P1)
- <https://platform.claude.com/docs/en/managed-agents/overview>
- <https://platform.claude.com/docs/en/managed-agents/webhooks>
- <https://platform.claude.com/docs/en/managed-agents/environments>
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock>
- <https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai>
- <https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry>
- <https://code.claude.com/docs/en/llm-gateway> · <https://code.claude.com/docs/en/gateways>
- <https://platform.claude.com/docs/en/build-with-claude/files>
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/embeddings>
- <https://platform.claude.com/docs/en/build-with-claude/streaming>

### Evaluation, testing & optimization (P3)
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak>
- <https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence>
- <https://platform.claude.com/docs/en/about-claude/pricing>

### Governance, safety & risk (P4)
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

### Lifecycle & operational enablement (P5, P7)
- <https://platform.claude.com/docs/en/about-claude/models/migration-guide>
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>
- <https://platform.claude.com/docs/en/about-claude/models/choosing-a-model>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>
- <https://platform.claude.com/docs/en/manage-claude/analytics-api>
- <https://platform.claude.com/docs/en/manage-claude/claude-code-analytics-api>
- <https://code.claude.com/docs/en/analytics> · <https://code.claude.com/docs/en/monitoring-usage>
- <https://code.claude.com/docs/en/costs>
- <https://platform.claude.com/docs/en/managed-agents/budgets>

### Model selection (P2, P6)
- <https://platform.claude.com/docs/en/models/overview>
- <https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions>
- <https://platform.claude.com/docs/en/models/opus-5/overview>
- <https://platform.claude.com/docs/en/models/sonnet-5/overview>
- <https://platform.claude.com/docs/en/models/haiku-4-5/overview>

### Doc indexes (for finding anything not listed)
- <https://code.claude.com/docs/llms.txt>
- <https://platform.claude.com/llms.txt>
