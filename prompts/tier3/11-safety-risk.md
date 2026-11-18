# Safety Controls and Risk Management — P5 Governance, Safety, and Risk Management

**Exam weight: 16% · part of the 31% that appears ONLY on Professional**

*Owns CCAR-P v1.1 § 5 task statements:*

- P5.3 — Risk Assessment and Ranking: Analyzing a proposed deployment for risk categories
  (attack surface, failure modes, token and quota exhaustion, dependency and supply-chain
  risk) and ranking them by exposure.
- P5.4 — Human-in-the-Loop Checkpoints: Analyzing where human-in-the-loop checkpoints must
  sit in an agentic workflow containing irreversible or high-stakes actions, and specifying
  gates that pause execution without stalling acceptable-risk paths.
- P5.6 — Bias Source Identification and Mitigation: Evaluating the evidence for bias when
  outputs or a dataset show disparate results across groups, and selecting the mitigation
  appropriate to its source, distinguishing data bias from prompt-framing and
  evaluation-design bias.

## What this session assumes

Sessions 35 and 37 (guardrails and the injection surface; compliance controls), and session
34's per-segment evaluation.

## Why this domain is worth 16% of your score

Session 35 covered guardrails as *technical* mitigations at a misuse path; this covers the
review-board questions that sit above them — which risks matter most in this deployment,
where a human must stand in an agentic workflow, and where a disparate outcome came from.
All three are written as diagnose-and-select: rank the categories by exposure, place the
gate, name the bias source and pick its mitigation. The scored skill is systematic
reasoning under stated constraints, never a list of safety features. One of the guide's
three sample items is a human-in-the-loop placement question from this session.

## Session focus

This session owns three objectives; spend disproportionate time on the human-in-the-loop one, because its logic also decides the other two. The crux is **reversibility and stakes decide where a gate sits, and the gate must be deterministic**: an irreversible or high-stakes action gets a pre-execution approval the harness enforces; read-only steps run free; a reversible, auditable step relies on the log and a reversal path; and an outbound action is constrained deterministically rather than reviewed. Gating everything stalls acceptable-risk paths, gating an upstream plan still delays every request and lets execution diverge from what was approved, and a gate triggered by the model's self-reported confidence is not a control for an irreversible step. Teach risk ranking (P5.3) as the same exposure reasoning applied before design — the four named categories, ranked rather than listed, with token and quota exhaustion and supply-chain risk as the two learners forget. Teach bias (P5.6) as source attribution: the evidence decides whether the disparity sits in the data, the prompt's framing, or the evaluation's design, and a mitigation aimed at the wrong source changes nothing.

## Authoritative sources

**Attack surface and least privilege**
- <https://code.claude.com/docs/en/security>
- <https://code.claude.com/docs/en/sandboxing>
- <https://code.claude.com/docs/en/agent-sdk/secure-deployment>
- <https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/security>

**Token and quota exhaustion**
- <https://platform.claude.com/docs/en/api/rate-limits>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>
- <https://platform.claude.com/docs/en/managed-agents/budgets>

**Dependency and supply-chain risk**
- <https://code.claude.com/docs/en/security>
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>

**Human-in-the-loop gates**
- <https://code.claude.com/docs/en/agent-sdk/user-input>
- <https://code.claude.com/docs/en/agent-sdk/permissions>
- <https://code.claude.com/docs/en/permissions>
- <https://platform.claude.com/docs/en/managed-agents/permission-policies>
- <https://platform.claude.com/docs/en/managed-agents/secure-deployment-monitoring>

**Bias evidence and evaluation**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>

> Anthropic's docs cover safety controls thoroughly but treat bias mainly as a
> model-behavior and policy concern rather than an architect's checklist. Teach P5.6 as
> evidence analysis and source attribution — what the disparity's pattern tells you about
> where it entered — and keep it concrete. The exam asks what an architect *does* about a
> disparate result, not what bias is.

## Teaching objectives

By the end, the learner can:

**Risk assessment and ranking (P5.3)**

- Assess a proposed deployment across the four named categories and say what each looks
  like in a Claude system:
  - **Attack surface** — every path by which untrusted input reaches the model or its tools
    (session 35 covers the controls); an agent's blast radius is the union of its tool
    permissions, so least privilege shrinks the surface more than hardened instructions do
  - **Failure modes** — incorrect output acted upon, a loop that never terminates, a tool
    error swallowed as success, a confused agent acting outside its task
  - **Token and quota exhaustion** — runaway loops, unbounded context growth, one tenant or
    one injected document consuming the shared rate limit or budget so every other user is
    throttled (denial of wallet and denial of service from the same cause). Controls are
    iteration caps, per-tenant limits and budgets, and spend limits — verify current
    mechanisms from live docs
  - **Dependency and supply-chain risk** — third-party MCP servers, Skills, and plugins
    that run with the agent's privileges and can change underneath you; SDK and package
    dependencies; single-provider or single-region dependence; and a model version with a
    deprecation date
- **Rank by exposure**, not by severity alone: likelihood × impact, adjusted for whether
  the path is reachable by untrusted input and whether a control already covers it. State
  the top risk and why it outranks the others in *this* deployment, and distinguish risks
  to mitigate, to accept explicitly, and to design out
- Specify the **containment** that answers the top-ranked failure: a kill switch and
  permission revocation, tested rather than assumed, and the logs that show it fired

**Human-in-the-loop checkpoints (P5.4)**

- **Classify each step** of an agentic workflow by reversibility and stakes — read-only,
  reversible and auditable, externally visible, irreversible or financially binding — and
  place gates accordingly:
  - *Pre-execution approval* on the irreversible or high-stakes step only. Gate by
    reversibility and stakes, not by how *difficult* the step is: a hard but reversible
    step needs less oversight than an easy, irreversible one
  - *No gate* on read-only steps and on reversible steps whose audit log supports reversal
  - *Deterministic constraint* instead of review where the risk is a bounded parameter —
    e.g. an email that may only go to the address already on file
  - *Sampled post-review* for reversible actions at volume
- Explain why the **common over-corrections fail**: gating every tool call stalls
  acceptable-risk paths; gating only the plan still delays every request and lets execution
  diverge from what was approved; removing gates and relying on post-execution review cannot
  undo an irreversible action
- Make the **gate deterministic and harness-enforced**: "confirm with a human before issuing
  a refund" in a system prompt binds a cooperative model only; a real gate is a permission
  the agent cannot get past without a human's answer. A gate triggered by the model's
  self-reported confidence is not a control for an irreversible step; confidence-based
  routing is acceptable only for reversible actions, and only where the score was validated
  against labeled outcomes (Tier 1 session 12). Verify the mechanism per surface against the
  cited docs, including where a gate stops firing: an approval callback only sees calls
  nothing earlier in the permission flow already allowed, so a broad allow rule removes the
  human, often without any visible change (some SDK configurations now emit a warning;
  verify current behaviour)
- Keep the gate **real without stalling it**: route only the gated class, size reviewer
  capacity to that volume, and watch override rates and time per case. An approval rate near
  100% at forty cases an hour is evidence the gate is decorative

**Bias source identification and mitigation (P5.6)**

- **Evaluate the evidence first**: is the disparity real (segment sizes, base rates,
  confidence), and is it in the system's outputs or in the dataset used to measure them?
  A strong aggregate score can hide a failure concentrated in one group, so the evidence
  must be per segment (session 34)
- **Attribute the disparity to its source** and name the pattern that points to each:
  - **Data bias** — the corpus, retrieval index, few-shot pool, or historical labels carry
    the pattern (an index over five years of past decisions reproduces them). Tell: the
    disparity tracks what was retrieved or what the examples contain, and persists across
    prompt rewordings
  - **Prompt-framing bias** — the instructions, criteria, or examples encode an assumption
    or a proxy for group membership. Tell: a counterfactual test that changes only the group
    attribute changes the output, and rewording the criteria moves the gap
  - **Evaluation-design bias** — the system may be fine, but the test set under-represents
    a group, the rubric or judge rewards one group's style, or labels were produced by a
    skewed process. Tell: the gap appears in the eval, not in independently reviewed
    outcomes, or disappears when the test set is rebalanced
- **Select the mitigation for the source**: curate, rebalance, or re-index the data;
  rewrite the framing and remove proxies, verified by counterfactual tests; fix the eval
  with representative per-segment sets, recalibrated rubric or judge, and audited labels.
  Explain why a prompt instruction to "be fair" fixes none of the three, and why a human
  reviewer who inherits the model's framing launders the outcome rather than checking it
- Apply **proportionality**: a disparate result in a high-consequence, hard-to-reverse
  decision (screening applicants, triaging benefit claims) warrants stronger mitigation and
  a human gate

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Which risk ranks first | Which has the highest likelihood × impact, and is it reachable by untrusted input? |
| Mitigate vs. accept vs. design out | What's the impact, and is the mitigation proportionate? |
| Restrict tools vs. add instructions | Could the harm occur through a permitted tool? |
| Per-tenant limit vs. global limit | Can one tenant or one input exhaust the shared quota? |
| Pin/vet a third-party component vs. trust it | Does it run with the agent's privileges and can it change underneath you? |
| Pre-execution gate vs. no gate | Is this step irreversible or high-stakes? |
| Gate the step vs. gate the plan | Would plan approval delay every request, and can execution diverge from it? |
| Review vs. deterministic constraint | Is the risk a bounded parameter you can enforce in code? |
| Gate in the harness vs. instruction in the prompt | Can the agent take the action without a human's answer? |
| Deterministic gate vs. confidence threshold | Is the action irreversible, and is the confidence self-reported? |
| Data vs. prompt-framing vs. eval-design bias | Does the gap follow the data, move with the wording, or live only in the eval? |
| Aggregate eval vs. per-segment eval | Could a failure be concentrated in one group? |

## How to run this session

1. **Frame** — three review-board questions: which risk first, where the human stands, and
   where a disparity came from. The exam wants systematic reasoning, not features.
2. **Teach the four risk categories** and run one full assessment together on a stated
   deployment (an agent with a third-party MCP server, shared tenant quota, and a
   side-effecting tool). Have the learner enumerate before you supply; token and quota
   exhaustion and supply-chain risk are the ones they will miss.
3. **Teach ranking by exposure.** Have them rank their list and defend the top item; then
   change one constraint (the MCP server becomes first-party, or quotas become per-tenant)
   and have them re-rank. Insist they explicitly *accept* at least one risk.
4. **Teach least privilege** as the attack-surface lever: ask what the agent could do if its
   instructions were fully subverted, then reduce tools until the answer is tolerable.
5. **Teach human-in-the-loop placement — the block to spend time on.** Give a six-step
   account-change workflow with a gate before every call and requests waiting hours. Have the
   learner classify each step and revise. Then offer the three wrong revisions — remove all
   gates and rely on the log, gate only the plan, gate on self-reported confidence — and have
   them say why each fails. Use the logic of the guide's Sample 3; don't reuse its wording.
6. **Teach gate enforcement.** Take their gated step and ask how the gate is enforced. If the
   answer is an instruction to the model, ask what happens when the model is injected or
   wrong. Then ask what configuration change would remove the gate silently, and have them
   find the allow rule or permission mode that does it in the cited docs.
7. **Teach keeping the gate real** — reviewer capacity, override rates, the
   approve-everything reviewer — briefly; it serves placement, not a separate objective.
8. **Teach bias evidence.** Give a per-segment result table and ask first whether the gap
   is real and whether it is in the outputs or the measurement.
9. **Teach source attribution.** Give three short cases — a retrieval index over historical
   decisions, criteria that mention a proxy attribute, a test set with forty cases from one
   group — and have them name the source and the tell. Then run a counterfactual swap on the
   second to show how framing bias is confirmed.
10. **Teach mitigation by source.** For each case, have them pick the mitigation and reject
    one aimed at the wrong source.
11. **Decision table** — walk all rows.
12. **Scenario drill — 6 questions**, standalone Professional format. Include a risk-ranking
    question with token/quota exhaustion or supply-chain risk as the correct top item, a
    least-privilege question, a gate-placement question in a multi-step workflow, a
    gate-enforcement question (harness vs. prompt vs. confidence), a bias-source attribution
    question, and one multiple-response on the mitigations appropriate to a stated source.
13. **Distractor autopsy** — expect risks listed rather than ranked, quota exhaustion and
    supply-chain risk omitted, instruction-hardening chosen where privilege reduction was the
    control, a gate on every step (or only on the plan) where only the irreversible step
    needed one, a gate triggered by the model's self-reported confidence, a human approval
    requested in the prompt where the harness had to withhold the action, and a bias
    mitigation aimed at the wrong source (a "be fair" instruction for data bias).
14. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — this domain is absent
    from Foundations.

## Out of scope

- Guardrail placement against a misuse path, and injection controls → session 35
- Compliance controls, residency, and audit evidence → session 37
- Retry, backoff, and rate-limit handling as reliability controls → session 33
- Writing the residual risk into a decision record → session 39
