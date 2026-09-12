# TRAPS.md — Distractor Inventory

The reusable half of a drill question. Items are written fresh every session (see
[`ARCHITECTURE.md`](ARCHITECTURE.md) § Key design decisions — a committed question bank
would be a bank this learner has already read). The *traps* are the part that doesn't
need reinventing: they're properties of the exam and of this learner, not of one session.

Use this file when writing distractors, at [`TUTORIAL.md`](../TUTORIAL.md) § Item
pre-batch. Each trap is a wrong answer that a competent candidate would find tempting —
which is the only kind worth writing. Gate 4 requires you to name what makes an option
tempting; these are the named ones.

**This file is curriculum.** Agents don't edit it during a session — a trap discovered
while teaching goes in the session log under `**Distractor patterns:**`, and a human
promotes it here. See [`DOCUMENTATION.md`](DOCUMENTATION.md) § Files.

---

## How to use it

1. **Start from the bias families.** They cross every domain and are where this exam
   does most of its discriminating. One distractor per item should usually come from a
   family, because those are the errors that recur on the real exam.
2. **Add the domain-specific trap** for the session's material from the tables below.
3. **Check the learner's live biases** — `learner/profile.md` § Recurring gaps and the
   `Distractor patterns` lines in recent logs. A family the learner has fallen for
   before is worth building an item around deliberately; see
   [`TUTORIAL.md`](../TUTORIAL.md) § Depth calibration, which says to attack a recurring
   bias directly rather than wait for it to appear.
4. **Never use all of one family in one item.** Four options drawn from the same trap
   collapse into one question asked four times, and the learner can pick by elimination
   without engaging the scenario.

A trap is not a question. It's the wrong answer plus the reason it attracts — you still
have to build a scenario whose stated constraints make it wrong, or the item has no
defensible key.

---

## Bias families

The seven shapes that recur across both exams. The **tell** column is what rules the
tempting answer out — it's what the learner should learn to spot, and what the autopsy
must surface.

### 1. Capability over constraint

Reaching for the more powerful option when a stated constraint makes the simpler one
correct. The most common single failure on both exams.

| Instance | The tell that rules it out |
|---|---|
| The most capable model chosen by default | A stated cost ceiling or latency budget the cheaper model meets |
| "Use a stronger model" for a description, prompt, or harness bug | The fault is locatable in text the model was given, not in its reasoning |
| Model upgrade chosen before prompt clarity | The prompt is still ambiguous; the upgrade masks it without fixing it |
| An agentic loop where the steps are knowable in advance | The step count is fixed and the sequence doesn't branch on results |
| Complexity chosen for hypothetical future needs | No stated requirement demands it; the scenario names present constraints |

### 2. Guidance where enforcement is required

Choosing a mechanism the model *may* follow when the scenario needs one the harness
*guarantees*. The signature trap of F2, and it generalizes to every domain with a
compliance or safety requirement.

| Instance | The tell that rules it out |
|---|---|
| `CLAUDE.md` chosen for an enforceable constraint | The requirement is absolute — "must never", audited, or compliance-bound |
| "Prompt it more firmly" where schema enforcement is required | A malformed output has a downstream consumer that breaks on it |
| Prompt instructions offered for an absolute safety requirement | The control has to hold against an adversary, not a cooperative model |
| Injection treated as prompt hardening rather than privilege reduction | The model can be made to *want* the bad action; only privilege stops it |
| Documented policy accepted as a control | Nothing in the system enforces the document |
| A hook doing model-judgment work, or a skill doing enforcement work | Deterministic check vs. judgment call — match the mechanism to which it is |

### 3. Over-orchestration

More agents, more parallelism, or more autonomy than the problem needs. Dominant in F1,
which is 27% of Foundations.

| Instance | The tell that rules it out |
|---|---|
| More agents where fewer would do | No independent verification boundary between the proposed subtasks |
| Parallelizing across a real dependency | One phase consumes another's output |
| Chains deep enough that original intent is lost | The leaf agent can't state what the user actually asked for |
| Parallel agents writing overlapping files without isolation | Two writers, one path |
| A step given an agent that needs no judgment | The selection is fixed; only the execution varies |
| Autonomous commit / push / merge where propose-only is correct | The wrong action is expensive to reverse and no human sees it first |
| Connecting every MCP server rather than scoping per task | Tools the task can't use still consume context and widen the trust surface |

### 4. Symptom fix over cause fix

Treating the observable rather than what produced it. Recurs wherever a resource limit
is being hit.

| Instance | The tell that rules it out |
|---|---|
| "Use a bigger window" for unbounded growth | Growth is per-iteration; any fixed window is exhausted eventually |
| Compaction chosen where delegation was the fix | The parent doesn't need the detail at all, only the conclusion |
| Budget increases offered for unbounded growth | Same shape as the window answer — a ceiling doesn't bound a rate |
| Adding capacity where the constraint is a rate limit | Throughput is capped by the limit, not by workers |
| Post-generation filtering as a leak "fix" | The data was already retrieved into a context that shouldn't have it |
| "Add more context" as the answer to a precision problem | Recall is fine; precision is the failure, and more context worsens it |
| Model-loop retries for a transient tool failure | Deterministic, cheap retry at the tool layer without model tokens |

### 5. Unverifiable elegance

An answer that reads well and can't be checked. Especially strong on decomposition and
eval items, where the tidy split is the tempting one.

| Instance | The tell that rules it out |
|---|---|
| A subtask that's elegant but unverifiable | No stated success criterion the subtask's output can be judged against |
| A split that ignores a stated ordering requirement | The scenario names a sequence the split breaks |
| Delegating work whose full detail the parent actually needs | The parent's next decision depends on what the summary drops |
| Unvalidated LLM-judge answers | The judge itself has no measured agreement with human labels |
| Spot-checking offered as a regression strategy | A regression is a change over time; a spot check has no baseline |
| Eval sets too small for the claim being made | The claimed difference is smaller than the sample can resolve |
| Compliance overclaimed from a single technical measure | One control, many requirements |
| Activity metrics reported as productivity | The metric counts actions, not outcomes |

### 6. Right technique, wrong condition

A genuinely correct mechanism applied where its precondition doesn't hold. These are the
hardest distractors to rule out, because the option is not wrong in general.

| Instance | The tell that rules it out |
|---|---|
| Batch chosen for a path with a user waiting | Someone is blocked on the response |
| Batch rejected for a nightly path | No one is waiting; the discount is free |
| Streaming proposed as a throughput or cost fix | Streaming changes time-to-first-token, not total tokens or rate |
| A model call for a check a linter does deterministically | The rule is exact, so the cheap deterministic tool is strictly better |
| Few-shot examples offered for a reasoning failure | The model's format is right and its logic is wrong |
| Dense retrieval for exact-identifier lookup | The query is a literal key; lexical match is exact and cheaper |
| A fixed chunk size regardless of document structure | The documents have structure the chunker is destroying |
| Manual chain-of-thought scaffolding where extended thinking was the answer | The current model exposes a thinking budget for exactly this |
| Technique-shotgunning — apply every technique at once | No diagnosis; nothing identifies which one addresses the stated failure |

### 7. Ignoring a stated non-functional requirement

The scenario names a constraint and the tempting answer optimizes something else. Every
scenario question carries the constraints that decide it — an answer that doesn't
reference one is usually the distractor.

| Instance | The tell that rules it out |
|---|---|
| Token-optimal answers that violate a permission or freshness requirement | The requirement is stated; cost is the thing being traded, not the goal |
| Surfaces chosen on technical preference over procurement or residency | The scenario names where data may live or who may be billed |
| Designs that ignore an existing enterprise constraint | The constraint is given as fact, not as a preference to argue with |
| Static credentials chosen for simplicity | An enterprise identity system is already stated to exist |
| Ignoring an auditability requirement when choosing an approach | The output has to be traceable, and the approach loses provenance |
| Running on every PR without checking the cost arithmetic | Volume × per-run cost against a stated budget |
| Exceeding a stated human-review queue capacity | The queue's throughput is given and the design exceeds it |
| Cache efficiency pursued at the cost of tenant isolation | Shared prefixes across tenants is a data boundary violation |
| Technical depth delivered to an audience that needed business framing | The stakeholder is named and it isn't an engineer |
| Overclaiming certainty to satisfy a stakeholder | The evidence named in the scenario doesn't support the claim |
| Designs presented as free of trade-offs | Every architecture gives something up; naming none is the tell |

---

## Foundations — domain traps

Beyond the families. Session codes are the prompt file the trap was authored for.

### F1 Agentic Architecture & Orchestration (27%)

| Trap | The tell | Source |
|---|---|---|
| "Add more autonomy" where the fix is a harness change | The fault is a tool description, a missing stop condition, or context not carried forward | T1-01 |
| "The model needs better prompting" for a harness fault | Same — locate the fault in the harness before the model | T1-01 |
| An agent where a workflow is correct | The steps are known in advance and don't branch on results | T1-02 |
| Splits that are elegant but unverifiable | Fails the *verifiable* test of the four well-formed-subtask tests | T1-04 |
| Splits that ignore a stated ordering requirement | Fails *independent* | T1-04 |
| Fork chosen where a subagent was right, or the reverse | Does the parent need the full detail, or just the conclusion? | T1-03 |
| Treating the lead's context exhaustion as a window-size problem | Delegation is the fix; a bigger window postpones it | S3 |

On any decomposition item, make the learner name **which of the four tests**
(self-contained, verifiable, bounded, independent) their answer turns on. That's the
transferable form, and it's what makes the autopsy stick.

### F2 Claude Code Configuration & Workflows (20%)

| Trap | The tell | Source |
|---|---|---|
| An enforceable constraint written into `CLAUDE.md` | The archetype's central trap — guidance vs. enforcement | T1-05, S2 |
| User-level scope where a managed/enterprise mandate is required | The requirement binds the org, not the individual | T1-05, T1-12, S2 |
| Committed project settings where a personal preference belongs | The setting is about one developer's workflow | S2 |
| An over-broad skill description that would fire when it shouldn't | The description doesn't say when *not* to use it | S2 |
| Skill distribution plans assuming cross-surface sync the surface doesn't provide | Verify per-surface availability rather than assuming parity | T3-15 |
| Broad or bypass-all permissions chosen because CI has no human to approve | Absence of a reviewer argues for *narrower* permissions | T1-07, S5 |
| Long-lived API keys in repo secrets | Short-lived credentials from an identity provider exist | S5 |
| Treating PR-body content as trusted input | It's attacker-controlled on a public repo | S5 |
| No sandbox on a shared runner | Other jobs share the host | S5 |
| Unbounded run time or token spend per job | No ceiling means no cost bound | S5 |

### F3 Prompt Engineering & Output Control (20%)

| Trap | The tell | Source |
|---|---|---|
| Real techniques applied to the wrong failure | Name the failure first, then the technique that addresses *that* | T1-08 |
| "Prompt it more firmly" where enforcement is required | A downstream consumer breaks on malformed output | T1-09 |
| Letting a required field be filled with a plausible invention | The schema permits a value the source never supported | S6 |
| Unbounded retries, or retries that don't feed the error back | A retry with identical input reproduces the identical failure | T1-09, S6 |
| A deeply nested schema where a flat one would fill more reliably | Nesting depth is the failure correlate, not field count | S6 |

### F4 Tools, MCP & Integrations (18%)

| Trap | The tell | Source |
|---|---|---|
| "Improve the system prompt" for a tool-description bug | A tool description *is* a prompt — it's the model's whole basis for choosing | T1-11 |
| Building a custom tool where a built-in or server tool already does it | Check the built-ins before designing | S4 |
| Overlapping tool descriptions left mutually ambiguous | Neither says when to use the other | T1-11, S4 |
| A third-party server accepted without a trust analysis | It sees arguments (exfiltration) and returns context (injection) | T1-12, S4 |
| Returning full payloads that bloat the parent's context | The parent needs a field, not the document | S4 |
| Unbounded retry as an implied default | No ceiling stated anywhere in the design | T1-13 |

### F5 Context, State & Reliability (15%)

| Trap | The tell | Source |
|---|---|---|
| Compaction chosen where delegation was right | The parent never needed the detail | T1-14 |
| "Use a bigger window" for unbounded growth | Growth is per-iteration | T1-14 |
| Difficulty used as the escalation criterion | Escalate on *reversibility* and cost of a wrong action, not hardness | T1-15 |
| Model-judged confidence trusted where a structural rule was needed | Self-reported confidence isn't calibrated | T1-15 |
| Traceability lost in synthesis | The deliverable must cite sources and the design drops provenance | S3 |

---

## Professional — domain traps

Beyond the families. P4–P7 are absent from Foundations, so a correct answer there is
weaker evidence — [`TUTORIAL.md`](../TUTORIAL.md) tells you to score them conservatively.

| Domain | Trap | The tell | Source |
|---|---|---|---|
| P1 (19%) | Parity across deployment surfaces assumed rather than verified | Feature availability differs per surface and moves | T3-02 |
| P1 | Static credentials chosen for simplicity | An enterprise identity system already exists | T3-01 |
| P2 (17%) | Scaling answers that add capacity where the constraint is a limit | Rate limits don't yield to more workers | T3-05 |
| P2 | Prompt-level fixes for reliability problems | Reliability needs a structural control, not better wording | T3-06 |
| P2 | Schema validation trusted to catch semantic errors | Well-formed and wrong is the dangerous case | T3-06 |
| P3 (16%) | Optimization before measurement | No profile identifies where the cost or latency actually is | T3-09 |
| P3 | Levers chosen without their side effect | Every lever trades something; name it | T3-09 |
| P4 (14%) | Oversight assigned by task difficulty rather than reversibility | Hard-and-reversible needs less oversight than easy-and-irreversible | T3-11 |
| P4 | Instruction-hardening where privilege reduction was the control | Instructions bind a cooperative model only | T3-11 |
| P5 (14%) | Migration without eval evidence | No baseline means no way to know the migration regressed | T3-13 |
| P5 | Stronger-model upgrades assumed safe | A more capable model can still regress a specific behavior | T3-13 |
| P6 (13%) | Production A/B results trusted at sample sizes that can't support them | The claimed effect is below the resolvable difference | T3-15 |
| P7 (7%) | Org-wide launches before the enablement path exists | Rollout precedes the support structure it depends on | T3-16 |

---

## Maintenance

- A trap the learner falls for that isn't listed here is worth promoting. It reaches this
  file the same way any curriculum change does: a session logs it under
  `**Distractor patterns:**`, a human adds it.
- Traps naming version-sensitive specifics (a flag, a limit, a model ID) don't belong
  here — they rot. Keep entries at the level of the *reasoning error*, which doesn't.
- When a trap stops being a trap because the product changed, delete it. A distractor
  that is no longer tempting is a throwaway option, and gate 4 fails it.
