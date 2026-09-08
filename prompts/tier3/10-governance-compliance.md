# Governance, Residency, and Compliance — P4 Governance, Safety & Risk Management

**Exam weight: 14% · part of the 35% that appears ONLY on Professional**

## What this session assumes

Sessions 1–9. This begins the three domains (P4, P5, P7) absent from Foundations
entirely — the most common reason a strong Foundations candidate fails Professional.

## Why this domain is worth 14% of your score

P4, P5, and P7 together are 35% of the Professional exam and appear nowhere on
Foundations. A candidate who prepared only by building will be weakest here, and it's
enough to fail on. This session covers the controls and evidence an enterprise deployment
requires: who can use what, where data goes, how long it's kept, and how you prove it.

## Authoritative sources

**Organizational control**
- <https://platform.claude.com/docs/en/manage-claude/workspaces>
- <https://platform.claude.com/docs/en/manage-claude/user-management>
- <https://platform.claude.com/docs/en/manage-claude/admin-api>
- <https://platform.claude.com/docs/en/manage-claude/admin-api-keys>

**Data handling**
- <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>
- <https://platform.claude.com/docs/en/manage-claude/data-residency>
- <https://code.claude.com/docs/en/zero-data-retention>
- <https://code.claude.com/docs/en/data-usage>

**Encryption and key custody**
- <https://platform.claude.com/docs/en/manage-claude/cmek>
- <https://platform.claude.com/docs/en/manage-claude/cmek-aws-kms>

**Audit and compliance evidence**
- <https://platform.claude.com/docs/en/manage-claude/compliance-api>
- <https://platform.claude.com/docs/en/manage-claude/compliance-activity-feed>
- <https://platform.claude.com/docs/en/manage-claude/compliance-integration-patterns>
- <https://platform.claude.com/docs/en/manage-claude/access-transparency>

**Policy enforcement points**
- <https://platform.claude.com/docs/en/manage-claude/inference-hooks>
- <https://platform.claude.com/docs/en/manage-claude/spend-limits-api>
- <https://code.claude.com/docs/en/managed-settings>
- <https://code.claude.com/docs/en/legal-and-compliance>

**Identity**
- <https://platform.claude.com/docs/en/manage-claude/workload-identity-federation>

## Teaching objectives

By the end, the learner can:

- Design the **organizational structure**: workspaces, user and role management, and API
  key scoping — so access, spend, and data are separated along the lines the business needs
- Explain **data retention** options and **zero data retention**, what each means concretely,
  and which contractual or regulatory terms drive the choice
- Explain **data residency** and how it constrains deployment surface — connecting back to
  session 2, where residency eliminated options
- Explain **customer-managed encryption keys** and what control they actually provide
- Design the **audit trail**: what must be recorded, how it's retrieved, how long it's kept,
  and how it satisfies an auditor rather than merely existing
- Distinguish the enforcement points and choose correctly: **managed settings** (client
  configuration the user can't override), **inference hooks** (server-side policy on
  requests), **spend limits**, and **workspace boundaries**
- Explain why **policy in a document is not a control**, and identify which of a set of
  stated policies are actually enforced
- Map a **regulatory requirement to a technical control** — GDPR data subject requests,
  HIPAA handling of PHI, PCI scope, SOC 2 evidence — without overclaiming compliance
- Design the **data classification gate**: what may enter a prompt, what must be redacted
  or tokenized first, and where that decision is enforced
- Explain the **shared responsibility** split: what the provider is accountable for versus
  what remains the customer's obligation — and why conflating them fails an audit
- Answer an auditor's question with **evidence**, not intent

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Managed settings vs. documented policy | Must compliance be mechanically guaranteed? |
| Inference hooks vs. client-side control | Can the client be bypassed or self-configured? |
| ZDR vs. standard retention | Is there a contractual or regulatory retention term? |
| Workspace separation vs. shared workspace | Do teams, tenants, or data classes need isolation? |
| Redact before sending vs. control access after | Is the field itself regulated? |
| CMEK vs. provider-managed keys | Does the org require key custody for its own audit? |

## How to run this session

1. **Frame** — say plainly that P4/P5/P7 are 35% of this exam, absent from Foundations, and
   the usual reason strong builders fail it. This session and the next four are where the
   Professional credential is actually won.
2. **Verify** the retention, residency, and compliance-API specifics from live docs before
   teaching them. These carry contractual weight and must not be approximated.
3. **Teach the org structure** and have the learner design workspaces for a company with
   three business units, one of them handling regulated data.
4. **Teach retention and ZDR** and what each means concretely.
5. **Teach residency** and connect it to session 2's elimination exercise.
6. **Teach CMEK** and what key custody buys.
7. **Teach the audit trail** with the auditor's question as the test: "show me every request
   that touched customer data last March." Ask whether their design can answer it.
8. **Teach the enforcement points** as the session's core judgment. Give six stated policies
   and have the learner place each on an enforcement point — or identify that it's currently
   unenforced. The unenforced ones are the point of the exercise.
9. **Teach regulation-to-control mapping** for two regimes, with the discipline of not
   overclaiming: a control supports compliance, it doesn't confer it.
10. **Teach the classification gate** and connect it to session 3's redaction material.
11. **Teach shared responsibility** and have them draw the line for a specific deployment.
12. **Decision table** — walk all six rows.
13. **Scenario drill — 5 questions**, standalone Professional format. Include an
    enforcement-point choice, a residency constraint, an audit-evidence question, a
    regulated-data handling question, and one multiple-response on shared responsibility.
14. **Distractor autopsy** — expect documented policy accepted as a control, and compliance
    overclaimed from a single technical measure.
15. Record per `.agents/TUTORIAL.md` Step 5. Given this domain's absence from Foundations,
    score conservatively — an unfamiliar domain answered correctly once is not mastery.

## Out of scope

- Safety controls and risk management → session 11
- Stakeholder communication of risk → session 12
- Cost governance mechanics → session 9
