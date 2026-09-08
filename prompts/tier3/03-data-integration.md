# Files, Citations, RAG, and Data Wiring — P1 Integration

**Exam weight: 19%**

## What this session assumes

Sessions 1–2. This completes P1 by covering how enterprise *data* reaches the model.

## Why this domain is worth 19% of your score

"Data wiring" is named in the P1 domain description. The scored judgment is choosing among
ways to get information in front of the model — long context, retrieval, files, tool
lookup at inference time — and knowing which one satisfies a *freshness*, *permission*,
and *auditability* requirement rather than just fitting the tokens.

## Authoritative sources

**Getting content to the model**
- <https://platform.claude.com/docs/en/build-with-claude/files>
- <https://platform.claude.com/docs/en/build-with-claude/pdf-support>
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>

**Grounding and attribution**
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/search-results>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>

**Retrieval building blocks**
- <https://platform.claude.com/docs/en/build-with-claude/embeddings>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool>

**Agent-side data access and persistence**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://platform.claude.com/docs/en/managed-agents/files>
- <https://platform.claude.com/docs/en/managed-agents/memory>
- <https://platform.claude.com/docs/en/managed-agents/vaults>

## Teaching objectives

By the end, the learner can:

- Choose among the data-delivery options and defend it: **stuff the context**, **retrieve
  then augment (RAG)**, **upload as files**, or **look it up via a tool at inference time**
- Apply the deciding criteria in the right order — **permission** (may this user see it),
  **freshness** (how stale may it be), **volume** (does it fit, and at what cost),
  **auditability** (must the answer be traceable) — and recognize that permission usually
  dominates
- Explain the **permission-filtered retrieval** problem: a shared index over documents with
  differing access rules leaks unless retrieval is filtered per requesting user, and
  post-hoc filtering of generated output is not a fix
- Use **citations** to make an answer verifiable, and explain why citation-grounded output
  is the standard answer to enterprise hallucination concerns
- Explain when **tool lookup at inference time** beats retrieval: authoritative, fast-moving,
  or permission-sensitive data (account balances, inventory, ticket status)
- Design a caching strategy for large stable corpora, and connect it to the prefix-ordering
  rule from Tier 1 session 14
- Recognize when **long context replaces retrieval** and when it doesn't — cost, latency,
  and the fact that relevant-needle performance is not free
- Decide where agent-generated artifacts and durable knowledge live, and who can read them
- Design the **data classification** step: what may enter a prompt at all, and what must be
  redacted or tokenized before it does

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| RAG vs. long context | Is the corpus large, and is per-request cost or latency binding? |
| Retrieval vs. inference-time tool lookup | Must the value be current at the moment of answering? |
| Shared index vs. per-user filtered retrieval | Do documents have differing access rules? |
| Citations vs. plain output | Must a human be able to verify the claim? |
| Files API vs. inline content | Is the same document reused across requests? |
| Redact before sending vs. send and control access | Is the field regulated (PII, PHI, PCI)? |

## How to run this session

1. **Frame** — the choice is decided by permission, freshness, and auditability far more
   often than by token math. Most wrong answers optimize tokens and lose on permissions.
2. **Teach the four delivery options** with a concrete example each.
3. **Teach the criteria order** and have the learner apply it to four data needs: a static
   policy manual, a customer's current balance, a 40,000-document knowledge base with
   mixed ACLs, and last night's log dump.
4. **Teach permission-filtered retrieval** as the session's most important idea. Construct
   the leak: one index, two users with different entitlements, one query. Ask them to fix
   it, and reject any answer that filters after generation — explain why that's too late.
5. **Teach citations** and connect them to enterprise hallucination objections. Ask how
   they'd answer a compliance reviewer who says "the model might make things up."
6. **Teach inference-time lookup** and where it beats retrieval outright.
7. **Teach caching for corpora**, referencing the prefix rule.
8. **Teach the long-context/RAG boundary** honestly — including that a large window does
   not make retrieval obsolete.
9. **Teach data classification and redaction** as a pre-prompt step, and connect forward to
   session 10.
10. **Decision table** — walk all six rows.
11. **Scenario drill — 5 questions**, standalone Professional format. Include a
    permission-filtering question, a freshness-driven choice, an auditability requirement,
    a redaction question, and one multiple-response on RAG-vs-long-context trade-offs.
12. **Distractor autopsy** — expect token-optimal answers that violate a permission or
    freshness requirement, and post-generation filtering as a leak "fix".
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Eval design for retrieval quality → session 7
- Compliance and residency program → session 10
- Context engineering at scale → session 14
- Cost modeling → session 9
