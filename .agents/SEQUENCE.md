# SEQUENCE.md — Curriculum Map

The session sequence, the scenario archetypes, and why the ordering is what it is.

`.agents/TUTORIAL.md` is the runtime protocol and routes against this file; it does not
restate it. When the two disagree, this file is authoritative for *what runs in what
order* and `TUTORIAL.md` for *how a session runs*.

Task-statement ownership is defined in [`../BLUEPRINT.md`](../BLUEPRINT.md) § Task
statements — the `Owns` column below mirrors it.

---

## Scenario archetypes

The Foundations pool. Tier 2 has one session per archetype; mocks draw 4 at random.

| # | Archetype | Primary domains |
|---|---|---|
| S1 | Customer support resolution with escalation logic | F1, F4, F5 |
| S2 | Claude Code team configuration and workflows | F2, F5 |
| S3 | Multi-agent research system orchestration | F1, F4, F5 |
| S4 | Developer productivity tooling with built-in utilities | F2, F4 |
| S5 | Automated code review inside CI/CD | F2, F3 |
| S6 | Structured data extraction from unstructured sources | F3, F5 |

Each archetype's prompt file is authoritative for its own domains and question mix; this
table is the index. If the two disagree, the prompt file wins and this table is stale.

---

## Session sequence

48 slots: 46 sessions drawing on 44 distinct prompt files (four Tier 2 files are re-run as
interleaved drills), plus 2 mandatory `GATE` mock exams.

Complete a tier before advancing. `GATE` rows are mock exams and are mandatory — see
[`TUTORIAL.md` § Mock exam mode](TUTORIAL.md#mock-exam-mode).

### Tier 1 — Foundations breadth (18 sessions + 4 interleaved drills)

**Sequenced by dependency, not by domain.** A session may only use mechanisms an earlier
session has already built. Domains interleave as a consequence — F1 material appears at
sessions 1–4 and again at 15, F5 at 6, 7 and 9 — because the ordering follows what builds
on what. Every session's prerequisites are taught before it; there are no forward
references.

Each session owns the § 6 task statements listed, and every one of the 30 is owned exactly
once. Session counts track exam weight (F1 5 of 18 against 27%, F3 4 against 20%, F2/F4/F5
3 each against 20/18/15%).

| # | File | Session | Domain | Owns | Builds on |
|---|------|---------|--------|------|-----------|
| 1 | `prompts/tier1/01-agentic-loop.md` | The Agentic Loop and `stop_reason` | F1 | 1.1 | — |
| 2 | `prompts/tier1/02-task-decomposition.md` | Task Decomposition: Fixed Pipelines vs. Adaptive Plans | F1 | 1.6 | 1 |
| 3 | `prompts/tier1/03-orchestration-subagents.md` | Coordinator-Subagent Orchestration and the Task Tool | F1 | 1.2, 1.3 | 1, 2 |
| 4 | `prompts/tier1/04-enforcement-handoff-session.md` | Enforcement, Handoff, and Session State | F1 | 1.4, 1.7 | 1, 3 |
| **5** | `prompts/tier2/03-scenario-multi-agent-research.md` | **DRILL — S3 Multi-Agent Research** (partial: F1 only) | S3 | — | 1–4 |
| 6 | `prompts/tier1/06-conversation-context.md` | Conversation Context and What Summarization Destroys | F5 | 5.1 | 1, 3 |
| 7 | `prompts/tier1/07-reliability-across-agents.md` | Reliability Across Agents: Errors, Crash Recovery, Provenance | F5 | 5.3, 5.4, 5.6 | 1, 3, 4, 6 |
| 8 | `prompts/tier1/08-criteria-and-fewshot.md` | Explicit Criteria and Few-Shot Prompting | F3 | 4.1, 4.2 | 1 |
| 9 | `prompts/tier1/09-escalation.md` | Escalation and Ambiguity Resolution | F5 | 5.2 | 1, 8 |
| **10** | `prompts/tier2/01-scenario-support-escalation.md` | **DRILL — S1 Customer Support Resolution** | S1 | — | 1–9 |
| 11 | `prompts/tier1/11-structured-output.md` | Structured Output via Tool Use and JSON Schemas | F3 | 4.3 | 1, 8 |
| 12 | `prompts/tier1/12-validation-and-calibration.md` | Validation, Retry, and Confidence Calibration | F3 | 4.4, 5.5 | 11 |
| 13 | `prompts/tier1/13-review-and-batch.md` | Multi-Pass Review and Batch Processing | F3 | 4.6, 4.5 | 2, 3, 11, 12 |
| 14 | `prompts/tier1/14-tool-interfaces.md` | Designing Tool Interfaces | F4 | 2.1 | 1, 8 |
| 15 | `prompts/tier1/15-hooks.md` | Agent SDK Hooks for Interception and Normalization | F1 | 1.5 | 1, 14 |
| 16 | `prompts/tier1/16-tool-errors-distribution.md` | Tool Errors and Tool Distribution | F4 | 2.2, 2.3 | 3, 7, 11, 14 |
| 17 | `prompts/tier1/17-mcp-and-builtins.md` | MCP Servers and Built-in Tools | F4 | 2.4, 2.5 | 14, 16 |
| **18** | `prompts/tier2/03-scenario-multi-agent-research.md` | **DRILL — S3 Multi-Agent Research** (full) | S3 | — | 1–17 |
| 19 | `prompts/tier1/19-claude-md-and-rules.md` | CLAUDE.md Hierarchy and Path-Specific Rules | F2 | 3.1, 3.3 | 1, 14 |
| 20 | `prompts/tier1/20-skills-commands-planmode.md` | Skills, Slash Commands, and Plan Mode | F2 | 3.2, 3.4 | 2, 3, 14, 19 |
| 21 | `prompts/tier1/21-refinement-and-cicd.md` | Iterative Refinement and CI/CD Integration | F2 | 3.5, 3.6 | 8, 11, 13, 19, 20 |
| **22** | `prompts/tier2/02-scenario-claude-code-team.md` | **DRILL — S2 Claude Code Team Config** | S2 | — | 1–21 |

Session 12 owns one task from each of two domains (4.4 and 5.5) — the extraction result
and the decision of whether to trust it are one lesson. Its `Domain` label is F3 for
routing, but 5.5 credits F5 under [Readiness scoring](TUTORIAL.md#readiness-scoring),
which counts task statements rather than session labels, so the mixed ownership costs
nothing.

**Why tool design sits at 14, not earlier.** Sessions 1–13 need only tool *use* —
`stop_reason` returning `"tool_use"`, results appended to history, `allowedTools`
restricting an agent — which session 1 establishes. None of them authors a tool
interface. Orchestration needs restriction, context management needs the shape of
accumulated results, reliability needs only that a tool can fail. Authorship (2.1) is a
specialised skill that Tasks 2.2, 2.3, 2.4 and hooks (1.5) all extend, so it sits
immediately before them — and the learner meets it having already watched selection go
wrong from the outside.

### Tier 2 — Foundations exam hardening (4 sessions + gate)

The three archetypes not yet drilled at full coverage, a final S1 pass, then the gate.
Teaching is minimal here; these are drill sessions at exam difficulty. S3 and S2 already
ran inside Tier 1 (sessions 18 and 22).

| # | File | Session | Covers |
|---|------|---------|--------|
| 23 | `prompts/tier2/04-scenario-devtools.md` | Scenario: Developer Productivity Tooling | S4 |
| 24 | `prompts/tier2/06-scenario-data-extraction.md` | Scenario: Structured Data Extraction | S6 |
| 25 | `prompts/tier2/05-scenario-code-review-cicd.md` | Scenario: Code Review in CI/CD | S5 |
| 26 | `prompts/tier2/01-scenario-support-escalation.md` | Scenario: Support & Escalation | S1 |
| 27 | **GATE-F** | Foundations Mock Exam (60q / 120 min) | all |

S5 runs at 25 rather than earlier because 3.6 lands at session 21 — it is the last
archetype to become drillable, and gets the least spacing of any. That is the ordering's
one real cost; it is accepted because hoisting CI earlier would mean teaching it before
CLAUDE.md, structured output, and independent review instances exist.

S1 runs last deliberately — it revisits F1 and F5 immediately before the mock, which is
where that 27% domain most needs a final pass. It is S1's second full pass; the first was
session 10.

#### Interleaved drills

Four Tier 2 archetype drills are pulled forward into Tier 1 (sessions 5, 10, 18, 22). Two
run on **partial coverage** by design.

The problem is spacing. F1 is taught in sessions 1–4; without interleaving, its first
archetype-scale drill would fall after session 22 — an eighteen-session decay window on the
exam's largest domain, and a first sustained exam-format block arriving too late to build
the stamina a 15-question scenario demands.

**A partial drill is worth more than a delayed one.** Running S3 at session 5 on F1 material
alone cuts F1's gap from eighteen sessions to one. The F4 items it would otherwise carry
(subagent tool distribution, scoped cross-role tools) are deferred to the full re-run at
18 — those are authorship decisions that need session 14, and the archetype rehearses fine
without them.

| # | Archetype | Coverage | What it rehearses |
|---|---|---|---|
| 5 | S3 Multi-Agent Research | Partial — F1 only | Decomposition, delegation, coordinator aggregation. Defer F4 and F5 items. |
| 10 | S1 Customer Support Resolution | Full for S1's domains | Loop, subagents, context preservation, error propagation, escalation. |
| 18 | S3 Multi-Agent Research | Full | The same archetype with tool distribution, structured errors, and provenance in place. |
| 22 | S2 Claude Code Team Config | Full | CLAUDE.md scope, skills, plan mode, CI. |

Repeating S3 at 5 and 18 is deliberate: the second pass measures what the first could not,
and spacing the same archetype beats massing it. S1 at 10 lands one session after escalation
(9) completes its last prerequisite.

Run each as its prompt file specifies, with one amendment — see
[`TUTORIAL.md` § Teaching inside a drill](TUTORIAL.md#teaching-inside-a-drill). Where
coverage is partial, **narrow the set to covered domains and say so** rather than padding
with unseen material: at session 5, draw entirely from F1 for ~10 questions instead of S3's
full ~7 F1 / ~4 F4 / ~3 F5 / ~1 F3 mix.

Score these as normal drill sessions: readiness rows updated from measured accuracy, misses
become drill cards. Note in the log that the session ran interleaved and which domains were
excluded, so a later reading of the record doesn't mistake a narrowed set for weak coverage.

S4, S5 and S6 are not interleaved — each needs a prerequisite that lands late (S5 needs 3.6
at session 21), so they run in Tier 2 where they get full coverage.

### Tier 3 — Professional breadth (16 sessions)

File numbers restart at `01` and do not match session numbers — session 28 is
`tier3/01-…`, an offset of 27.

| # | File | Session | Domain | Wt |
|---|------|---------|--------|-----|
| 28 | `prompts/tier3/01-enterprise-integration.md` | Enterprise Integration Patterns | P1 | 19% |
| 29 | `prompts/tier3/02-deployment-surfaces.md` | Bedrock, Vertex, Foundry, Gateways | P1 | 19% |
| 30 | `prompts/tier3/03-data-integration.md` | Files, Citations, RAG, and Data Wiring | P1 | 19% |
| 31 | `prompts/tier3/04-solution-design.md` | Solution Design and Model Selection | P2 | 17% |
| 32 | `prompts/tier3/05-architecture-tradeoffs.md` | Architecture Trade-offs at Scale | P2 | 17% |
| 33 | `prompts/tier3/06-production-reliability.md` | Production Reliability Patterns | P2 | 17% |
| 34 | `prompts/tier3/07-eval-design.md` | Designing Evals That Catch Regressions | P3 | 16% |
| 35 | `prompts/tier3/08-guardrails-quality.md` | Guardrails: Hallucination, Jailbreak, Leak | P3 | 16% |
| 36 | `prompts/tier3/09-cost-latency-optimization.md` | Cost and Latency Optimization | P3 | 16% |
| 37 | `prompts/tier3/10-governance-compliance.md` | Governance, Residency, and Compliance | P4 | 14% |
| 38 | `prompts/tier3/11-safety-risk.md` | Safety Controls and Risk Management | P4 | 14% |
| 39 | `prompts/tier3/12-stakeholder-communication.md` | Defending Architecture Decisions | P5 | 14% |
| 40 | `prompts/tier3/13-lifecycle-management.md` | Lifecycle: Migration and Deprecation | P5 | 14% |
| 41 | `prompts/tier3/14-context-engineering-scale.md` | Context Engineering at Scale | P6 | 13% |
| 42 | `prompts/tier3/15-model-steering.md` | Model Steering and Prompt Portfolios | P6 | 13% |
| 43 | `prompts/tier3/16-developer-enablement.md` | Developer Productivity and Enablement | P7 | 7% |

### Tier 4 — Professional capstones (4 sessions + gate)

Full architecture problems worked end to end, then the gate. File numbers restart at `01`;
session 44 is `tier4/01-…`, an offset of 43.

| # | File | Session |
|---|------|---------|
| 44 | `prompts/tier4/01-capstone-enterprise-rollout.md` | Capstone: Enterprise Claude Code Rollout |
| 45 | `prompts/tier4/02-capstone-regulated-agent.md` | Capstone: Agent in a Regulated Industry |
| 46 | `prompts/tier4/03-capstone-scale-migration.md` | Capstone: Scale and Model Migration |
| 47 | `prompts/tier4/04-weak-domain-blitz.md` | Weak-Domain Blitz (reads readiness, targets gaps) |
| 48 | **GATE-P** | Professional Mock Exam (63q / 120 min) |
