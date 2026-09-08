# BLUEPRINT.md — Exam Blueprints (canonical)

The two target exams, their official domain weights, and the documentation each
domain is drawn from. Everything in `prompts/` traces back to a domain here.

> **Verification note.** Domain weights and formats below were gathered from
> published exam-guide sources in September 2026. Anthropic revises blueprints;
> before your exam date, re-verify against the official program page
> (<https://www.pearsonvue.com/us/en/anthropic.html>) and update this file.
> Session prompts cite live documentation, so product detail stays current even
> if a weight shifts.

---

## Exam 1 — Claude Certified Architect: Foundations (CCAR-F)

| Property | Value |
|---|---|
| Items | 60 |
| Duration | 120 minutes |
| Format | **Scenario-based** — 4 scenarios drawn from a pool of 6, 15 questions each |
| Question types | Multiple choice, multiple response |
| Passing score | 720 scaled (100–1000) |
| Conditions | Proctored, closed-book, no AI assistance |
| Validity | 12 months |
| Prerequisites | None |

### Domains

| # | Domain | Weight | Tier 1 sessions |
|---|--------|--------|-----------------|
| F1 | Agentic Architecture & Orchestration | **27%** | 4 |
| F2 | Claude Code Configuration & Workflows | **20%** | 3 |
| F3 | Prompt Engineering & Structured Output | **20%** | 3 |
| F4 | Tool Design & MCP Integration | **18%** | 3 |
| F5 | Context Management & Reliability | **15%** | 2 |

Session counts are proportional to weight — study time tracks what is scored.

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
