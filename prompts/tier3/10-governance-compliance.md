# Governance, Residency, and Compliance — P5 Governance, Safety, and Risk Management

**Exam weight: 16% · part of the 31% that appears ONLY on Professional**

*Owns CCAR-P v1.1 § 5 task statement:*

- P5.5 — Architectural Controls for Compliance Obligations: Evaluating candidate
  architectural controls (data residency and deployment surface, retention and
  zero-data-retention configuration, PII detection and redaction, audit logging, tenant
  isolation) against a stated compliance obligation, and selecting the control set that
  evidences the obligation.

## What this session assumes

Sessions 28–36, and session 29 in particular — residency as an elimination constraint on
deployment surface. P5, P6, and P7 are absent from Foundations entirely, which is the most
common reason a strong Foundations candidate fails Professional.

## Why this domain is worth 16% of your score

P5, P6, and P7 together are 31% of the Professional exam and appear nowhere on
Foundations. P5 grew in v1.1, and compliance controls are where builders are thinnest. The
objective is not "know the regulations": an item states an obligation — inputs must stay in
a region, records must not be retained, a tenant must never see another's data — and offers
candidate controls. The scored skill is matching each control to what the obligation
actually constrains, and picking the set whose output an auditor would accept as proof.

## Session focus

This session continues the three domains absent from Foundations entirely (session 35 opened P5); say plainly that P5, P6, and P7 are 31% of this exam and the usual reason strong builders fail it. The crux is **match the control to the dimension the obligation constrains, then prove it**: residency constrains *where* inputs are processed, retention and ZDR constrain *how long* they are held, PII detection and redaction constrain *what* enters the context, tenant isolation constrains *who* can reach it, and audit logging is what makes any of the others evidenceable. The commonest wrong answer is a real control aimed at the wrong dimension — zero data retention offered for a residency obligation, which governs how long data is held, not where it is processed. Spend the most time on the selection exercise: an obligation, five candidate controls, and the learner choosing the set that *evidences* it, rejecting both the mismatched control and the policy document that states intent but enforces nothing.

## Authoritative sources

Verify retention periods, residency options, ZDR eligibility, and per-surface availability
from live docs — these carry contractual weight and must not be approximated.

**Residency and deployment surface**
- <https://platform.claude.com/docs/en/manage-claude/data-residency>
- <https://code.claude.com/docs/en/legal-and-compliance>

**Retention and zero data retention**
- <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>
- <https://code.claude.com/docs/en/zero-data-retention>
- <https://code.claude.com/docs/en/data-usage>

**Inline enforcement for Claude Enterprise (allow/deny only)**
- <https://platform.claude.com/docs/en/manage-claude/inference-hooks> — Enterprise-only
  allow/deny gate on prompts and, optionally, tool calls; it cannot rewrite or redact,
  does not cover API (Platform) organizations, and is not available on Bedrock or Google
  Cloud. Verify scope before citing it

**Data residency on the Anthropic API**
- <https://platform.claude.com/docs/en/manage-claude/data-residency> — per-request inference geo, and workspace-level allowed and default geos

**Audit logging and compliance evidence**
- <https://platform.claude.com/docs/en/manage-claude/compliance-api> — scope differs by
  key: an API (Console) organization reaches the Activity Feed of org events, while
  per-request content endpoints serve Claude Enterprise data. Verify scope before citing
- <https://platform.claude.com/docs/en/manage-claude/compliance-activity-feed>
- <https://platform.claude.com/docs/en/manage-claude/compliance-integration-patterns>
- <https://platform.claude.com/docs/en/manage-claude/access-transparency>

**Tenant isolation and access**
- <https://platform.claude.com/docs/en/manage-claude/workspaces>
- <https://platform.claude.com/docs/en/manage-claude/user-management>
- <https://platform.claude.com/docs/en/manage-claude/admin-api-keys>
- <https://platform.claude.com/docs/en/manage-claude/workload-identity-federation>

**Key custody (supporting)**
- <https://platform.claude.com/docs/en/manage-claude/cmek>

## Teaching objectives

By the end, the learner can:

- **Decompose a compliance obligation** into the dimension(s) it constrains — where data is
  processed, how long it is held, what content may enter the model's context, who may reach
  it, and what must be provable afterwards — before looking at any candidate control.
  Regulations may appear as scenario context; treat them as sources of obligations and
  decompose the obligation, not the acronym
- Apply **data residency** as a hard constraint: a residency obligation eliminates any
  design in which model inputs leave the boundary. Choose the control by the boundary
  it names. A geographic obligation (for example, inference in the US only) can be met on
  the Anthropic API by restricting a workspace's allowed inference geos, which the API
  enforces by rejecting requests for any other geo, rather than trusting each client to
  set a per-request parameter. A boundary the API's geos cannot satisfy, such as the
  firm's own cloud account in Sample 1, needs a deployment surface, and that surface
  imposes trade-offs (feature lag, runtime ownership) the architect must accept
  explicitly. Surface selection is session 29; verify the current geo options and
  settings from live docs
- Explain **retention and zero-data-retention configuration** — what each means concretely,
  which features or surfaces it constrains (verify eligibility from live docs), and why it
  answers a *how long* obligation and never a *where* one
- Place **PII detection and redaction** *before* the content reaches the model or a log, and
  at a point the client cannot bypass — and know that redaction applied after the response
  does not satisfy an obligation about what the model may receive. Teach the mechanics
  here (session 30 defers them to this session): classify fields, then detect and redact
  or tokenize in a gateway, proxy, or ingestion step the architect places in front of the
  API call, keeping the re-identification map outside the model's reach. For an API
  workload this is something you build; don't offer Inference hooks as the redaction
  control — they return allow or deny, cannot redact, and apply only to Claude Enterprise
  (verify from the cited page)
- Design **audit logging** as evidence: what must be recorded, how it is retrieved, how long
  it is kept, and whether it can answer a specific auditor question ("show me every request
  that touched customer data last March"). For an API workload, that per-request log is one the
  architect builds; the Compliance API's reach depends on the organization type (see the
  cited page). Note the tension: audit retention and ZDR pull in
  opposite directions, so the log must record the *fact and metadata* of access without
  re-creating the content a retention obligation forbids keeping
- Design **tenant isolation** — workspace boundaries, scoped keys, per-tenant identity, and
  no shared cache or retrieval index across tenants — and identify where a shared component
  breaks it
- **Select the control set that evidences the obligation**: every dimension the obligation
  constrains is covered by a control that is *enforced* (not merely documented), and at
  least one control produces the record an auditor would accept. Reject the set that adds
  controls for dimensions the obligation never named — over-control has a cost
- Explain why **policy in a document is not a control**, and identify which stated policies
  in a scenario are unenforced
- Explain the **shared responsibility** split: provider attestations cover the provider's
  side; the customer must still evidence its own configuration, and conflating the two
  fails an audit
- Explain **customer-managed encryption keys** only as far as a scenario needs: key custody
  satisfies a custody obligation, not residency or retention. It is not in the objective's
  list; teach it so the learner can reject it when it is offered for the wrong dimension
- Answer an auditor's question with **evidence**, not intent, and never claim a control
  confers compliance — it supports it

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Residency/surface vs. ZDR | Does the obligation say *where* or *how long*? |
| ZDR vs. standard retention | Is there a contractual or regulatory retention term? |
| Redact before sending vs. control access after | Is the obligation about what the model may *receive*? |
| Workspace or tenant separation vs. shared | Could one tenant's data reach another through a shared component? |
| Audit log vs. documented policy | Could you show an auditor a record, or only a statement of intent? |
| Workspace-enforced control vs. per-request client setting | Can the client omit or override it? (Allowed inference geos on the workspace vs. a per-request geo parameter) |
| Minimal sufficient set vs. every available control | Does each control map to a dimension the obligation names? |
| CMEK vs. provider-managed keys | Is the obligation about key custody, or something CMEK doesn't touch? |

## How to run this session

1. **Frame** — P5/P6/P7 are 31% of this exam, absent from Foundations, and the usual reason
   strong builders fail it. This session, sessions 38 and 39, and session 43 are where
   the Professional credential is won.
2. **Verify** the retention, residency, ZDR, and compliance-API specifics from live docs
   before teaching them.
3. **Teach obligation decomposition first.** Give three obligations in plain language and
   have the learner name the dimension each constrains before any control is mentioned.
4. **Teach the five controls** in the objective's order — residency and surface, retention
   and ZDR, PII detection and redaction, audit logging, tenant isolation — each with the
   dimension it answers and the dimension it does *not*. Connect residency to session 29.
5. **Run the mismatch drill.** Offer ZDR for a residency obligation, CMEK for a retention
   obligation, post-response redaction for a "may not be sent" obligation. Have the learner
   reject each and name the dimension it misses. This is the session's highest-yield trap.
6. **Teach audit logging with the auditor's question** as the test, then raise the ZDR
   tension and have them design a log that satisfies both.
7. **Teach tenant isolation** by having them find the shared component — cache, index, key,
   or workspace — that breaks it in a stated multi-tenant design.
8. **Run the selection exercise — the core of the session.** Give one obligation and five
   candidate controls; have the learner pick the set that evidences it and justify each
   inclusion and exclusion. Repeat with an obligation spanning two dimensions.
9. **Teach policy-vs-control and shared responsibility.** Give stated policies and have them
   identify which are unenforced, then draw the provider/customer line for one deployment.
10. **Decision table** — walk all eight rows.
11. **Scenario drill — 5 questions**, standalone Professional format. Include a residency
    obligation with ZDR as a distractor, a redaction-placement question, an audit-evidence
    question, a tenant-isolation question with a shared component, and one
    multiple-response selecting the control set for a two-dimension obligation.
12. **Distractor autopsy** — expect a real control aimed at the wrong dimension (ZDR for
    residency), documented policy accepted as a control, redaction placed after the model,
    a control set padded with controls the obligation never required, and compliance
    overclaimed from a single technical measure.
13. Record per `.agents/TUTORIAL.md` Step 5. Given this domain's absence from Foundations,
    score conservatively — an unfamiliar domain answered correctly once is not mastery.

## Out of scope

- Deployment surface and runtime selection itself → session 29
- Guardrail placement and the injection surface → session 35
- Risk ranking, human-in-the-loop gates, and bias → session 38
- Managed settings and centrally enforced Claude Code controls → session 43
- Spend limits and cost attribution → session 36
