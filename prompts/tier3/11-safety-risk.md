# Safety Controls and Risk Management — P4 Governance, Safety & Risk Management

**Exam weight: 14% · part of the 35% that appears ONLY on Professional**

## What this session assumes

Sessions 8 and 10 (guardrails; governance and compliance).

## Why this domain is worth 14% of your score

Session 8 covered guardrails as *technical* mitigations; this covers risk management as an
*organizational* discipline — identifying what could go wrong before it does, deciding
what's acceptable, and owning the residual. Exam items here read like an architecture
review board's questions, and the scored skill is systematic risk reasoning rather than
listing safety features.

## Session focus

This session covers risk management as an organizational discipline, framed as an architecture review board would ask it. The crux is **least privilege for agents**: an agent's blast radius is the union of its tool permissions, so restricting tools beats hardening instructions. Insist the learner explicitly *accept* at least one risk — an architect who mitigates everything hasn't prioritized. Also land the agent-specific risk that traditional appsec misses: the action set is chosen at runtime by a probabilistic process influenced by untrusted input. This session also owns **ethical AI — bias, fairness, transparency** — which CCAR-P names as its own task statement. Teach it as an engineering concern with the same likelihood × impact discipline as any other risk, not as a values discussion: where bias enters, how you would *detect* it, and what disclosure the deployment owes its users.

## Authoritative sources

**Security posture**
- <https://code.claude.com/docs/en/security>
- <https://code.claude.com/docs/en/security-guidance>
- <https://code.claude.com/docs/en/claude-security>
- <https://code.claude.com/docs/en/sandboxing>
- <https://code.claude.com/docs/en/sandbox-environments>

**Permission and policy controls**
- <https://code.claude.com/docs/en/permissions>
- <https://code.claude.com/docs/en/permission-modes>
- <https://platform.claude.com/docs/en/managed-agents/permission-policies>
- <https://platform.claude.com/docs/en/manage-claude/inference-hooks>

**Agent-specific risk surface**
- <https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/security>
- <https://code.claude.com/docs/en/agent-sdk/secure-deployment>
- <https://code.claude.com/docs/en/agent-sdk/permissions>

**Policy and acceptable use**
- <https://www.anthropic.com/legal/aup>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks>

**Ethical AI and model behavior**
- <https://www.anthropic.com/legal/aup>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/content-moderation>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>

> Anthropic's docs cover safety controls thoroughly but treat bias and fairness mainly as
> model-behavior and policy concerns rather than as an architect's checklist. Teach this
> objective as risk engineering — detection, measurement, disclosure — and keep it concrete.
> The exam asks what an architect *does* about bias, not what bias is.

## Teaching objectives

By the end, the learner can:

- Run a **systematic risk assessment** for a Claude deployment across the categories that
  matter: incorrect output acted upon, unauthorized action, data exposure, prompt injection
  via ingested content, cost runaway, availability dependency, and reputational or
  regulatory harm
- Reason in terms of **likelihood × impact**, and distinguish risks to *mitigate*, to
  *accept explicitly*, and to *design out entirely*
- Apply **least privilege to agents** as the primary control: an agent's blast radius is
  the union of its tool permissions, so restricting tools is more effective than
  restricting instructions
- Design **sandboxing and isolation** appropriately — what an agent can reach, and what a
  compromised or confused agent could therefore do
- Design **human oversight** proportionate to risk: pre-approval for irreversible actions,
  post-hoc review by sampling for routine ones, and full autonomy where the blast radius
  is genuinely small
- Explain the **agent-specific risk** that traditional application security misses: the
  action set is chosen at runtime by a probabilistic process influenced by untrusted input
- Design an **incident response** path for an agentic system: detect, contain (kill switch,
  permission revocation), investigate using logs, and remediate — and specify who can pull
  which lever
- Explain the **kill switch requirement** — the ability to stop an agent fleet quickly — and
  why it must be tested rather than assumed
- Explain **acceptable use** obligations and their implications for what an org may build
- Identify **where bias enters a Claude system** and treat each as a distinct risk with its
  own control: the model's own tendencies, the prompt (examples and criteria that encode an
  assumption), the retrieval corpus (an index over historical decisions carries their
  pattern forward), and the human process around it (who reviews what, and whose cases get
  escalated). Naming the entry point is what makes it addressable
- Explain why **disparate outcomes across groups are measurable** and therefore an
  engineering problem: define the segments that matter for the use case, evaluate per
  segment rather than in aggregate, and recognize that a strong aggregate score can hide a
  failure concentrated in one group — an eval suite that only reports a mean cannot detect
  this, which connects directly to session 7
- Apply **proportionality**: bias risk scales with consequence and reversibility, so a
  system ranking support tickets and a system screening job applicants or loan
  applications warrant different controls. Name the high-consequence domains where a
  disparate-outcome failure is also a *regulatory* failure, connecting to session 10
- Design **transparency** at the right level for each audience: disclosure that a user is
  interacting with an AI system, an explanation a decision *subject* can act on, and an
  audit trail a reviewer can inspect — and explain honestly that a model's reasoning is not
  reliably introspectable, so "explainability" in a Claude system means logged inputs,
  retrieved sources, citations, and decision records rather than an account of why the
  model produced what it did
- Explain why **a human in the loop is not automatically a fairness control** — a reviewer
  who rubber-stamps at volume, or who inherits the model's framing, launders the outcome
  rather than checking it — and what makes oversight real: sampling, disagreement rates
  tracked, and authority to overturn
- Present a risk position honestly: residual risk stated, not hidden — which also rehearses
  session 12

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Mitigate vs. accept vs. design out | What's the impact, and is the mitigation proportionate? |
| Restrict tools vs. add instructions | Could the harm occur through a permitted tool? |
| Pre-approval vs. sampled post-review | Is the action reversible? |
| Sandbox vs. direct access | Could the agent reach anything outside its task? |
| Human in the loop vs. fully autonomous | What's the blast radius of a wrong action at volume? |
| Block the use case vs. constrain it | Is the risk in the capability or the configuration? |
| Aggregate eval vs. per-segment eval | Could a failure be concentrated in one group? |
| Disclose AI involvement vs. not | Does the user's decision change if they know? |
| Human review vs. automated decision | What's the consequence to the decision subject, and is it reversible? |

## How to run this session

1. **Frame** — this is risk management as an architecture review board would ask it. The
   exam wants systematic reasoning, not a list of safety features.
2. **Teach the risk categories** and immediately run one full assessment together on a
   stated deployment. Have the learner enumerate risks before you supply any; then add what
   they missed, and discuss why those are the easy ones to miss.
3. **Teach likelihood × impact** and the three-way response. Insist they explicitly *accept*
   at least one risk — architects who mitigate everything haven't prioritized.
4. **Teach least privilege for agents** as the strongest control. Ask what an agent could do
   if its instructions were fully subverted, then reduce the tool set until the answer is
   tolerable. This is the same move as session 8's injection defense, at organizational level.
5. **Teach sandboxing and isolation.**
6. **Teach proportionate oversight.** Give six actions and have them assign an oversight
   level, justifying on reversibility and volume — the same rule as Tier 1 session 15, now
   applied to policy.
7. **Teach the agent-specific risk.** Ask what's different from a traditional web app; lead
   them to the runtime-chosen action set influenced by untrusted input.
8. **Teach incident response.** Have them design the path, then ask the hard questions: who
   can revoke permissions at 2am, how would you know it's happening, what do the logs need
   to contain, and has the kill switch been tested?
9. **Teach acceptable use** and its architectural implications.
10. **Teach bias as an entry-point problem.** Don't open with definitions. Give one
    system — a CV screener, or a system triaging benefit claims — and ask where bias could
    enter. Take their answers, then supply the four entry points they missed (model, prompt,
    retrieval corpus, human process). The retrieval one lands hardest: an index built over
    five years of historical decisions carries those decisions' pattern forward, and nothing
    in the prompt reveals it.
11. **Teach detection as measurement.** Ask how they would *know* the system is biased.
    Push past "review the outputs" to per-segment evaluation, and make the arithmetic point:
    a 94% aggregate score can be 98% for one group and 71% for another. Connect to session
    7 — an eval suite reporting only a mean cannot detect this, which is an eval *design*
    defect, not a bias-specific tool.
12. **Teach proportionality**, connecting to session 10. Ask which decisions warrant which
    controls, and where a disparate-outcome failure becomes a regulatory one.
13. **Teach transparency honestly.** Distinguish the three audiences (user, decision
    subject, auditor). Then do the hard part: ask what they would tell a rejected applicant
    who asks why. Reject any answer implying the model can explain itself — the honest
    answer is the logged inputs, the retrieved sources, the criteria applied, and the
    human's decision record. Overclaiming explainability is the distractor here.
14. **Teach the rubber-stamp failure** — why a human in the loop can launder an outcome
    rather than check it, and what makes oversight real.
15. **Teach honest risk presentation** — residual risk named explicitly.
16. **Decision table** — walk all rows.
17. **Scenario drill — 5 questions**, standalone Professional format. Include a risk
    prioritization, a least-privilege question, an oversight proportionality question, a
    bias-detection question (per-segment vs. aggregate), and one multiple-response on what
    transparency a high-consequence deployment owes.
18. **Distractor autopsy** — expect instruction-hardening chosen where privilege reduction
    was the control, and oversight assigned by task difficulty rather than reversibility.
19. Record per `.agents/TUTORIAL.md` Step 5. Score conservatively — this domain is absent
    from Foundations.

## Out of scope

- Technical guardrail mechanics → session 8
- Compliance evidence and residency → session 10
- Communicating risk to executives → session 12
