# Context Engineering at Scale — P6 Claude Models, Prompting & Context Engineering

**Exam weight: 13%**

## What this session assumes

Tier 1 session 14 (context mechanics) and Tier 3 sessions 3, 5, and 9.

## Why this domain is worth 13% of your score

The P6 domain description names **large-scale context management**. Foundations taught the
mechanics — windows, caching, compaction. Professional asks how you *architect* context
for a system serving many users over long horizons, where context strategy is simultaneously
the dominant cost driver, a correctness concern, and a data-boundary concern.

## Session focus

This session raises context from mechanics to architecture for a system serving many users over long horizons. The crux, and the highest-severity failure in the domain, is **multi-tenant context safety**: tenant data must not cross through a shared prefix, a shared cache, or an unscoped memory store. Construct the leak all three ways. The Professional-altitude insight to draw out: because a frequently-edited shared prefix invalidates the cache for every user, prompt-change governance is a cost decision — have the learner connect a policy to a budget line.

## Authoritative sources

**Context mechanics at scale**
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://platform.claude.com/docs/en/build-with-claude/compaction>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics>

**Tool and memory context**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://platform.claude.com/docs/en/managed-agents/memory>

**Session and state architecture**
- <https://code.claude.com/docs/en/agent-sdk/session-storage>
- <https://code.claude.com/docs/en/agent-sdk/sessions>
- <https://platform.claude.com/docs/en/managed-agents/sessions>

**Thinking and effort as context consumers**
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/preserved-thinking>

## Teaching objectives

By the end, the learner can:

- Design a **context architecture** deliberately: what's static and cacheable, what's
  per-user, what's per-request, what's retrieved on demand, and what's summarized — and
  order it so caching actually works
- Explain the **cache-efficiency-first layout rule** and its organizational consequence: a
  frequently-edited instruction file at the top of a shared prefix invalidates the cache for
  every user, so prompt-change governance is a cost decision
- Design **multi-tenant context** safely: per-tenant data must not cross tenants through a
  shared prefix, a shared cache, or a shared memory store — and know that this is the
  highest-severity failure in the domain
- Choose a **long-horizon memory strategy**: summarize-and-carry, external store queried on
  demand, the memory tool, or structured state the agent reads — and name what each loses
- Reason about **summarization as lossy compression** applied repeatedly: successive
  compactions degrade fidelity, and errors introduced in a summary become facts the model
  trusts thereafter
- Design **context budgets per component** — system, tools, retrieved content, history,
  output reserve — and enforce them rather than discovering exhaustion in production
- Explain why **tool definitions are a scaling problem** and how tool search or per-task
  scoping addresses it — the guide's term for this trade is **progressive discovery vs.
  monolithic context** (load everything up front, or let the agent discover what it needs).
  Our retrieve-on-demand, tool-search, and per-task-scoping material *is* progressive
  discovery; know the phrase, because an exam item may use it without explanation
- Recognize **capability bloat** (the guide's term) as the failure mode behind an
  overlarge tool surface: more tools than the task needs degrades selection accuracy,
  inflates every request's prefix, and widens the blast radius — the same problem Tier 1
  session 11 taught as overlapping descriptions and too many tools
- Connect context strategy to **cost** (accumulated input dominates), **quality** (relevant
  content must survive), and **compliance** (what enters the window is a data-handling event)
- Diagnose a context problem in a production system to its cause, and pick the fix that
  matches the cause rather than the symptom

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Shared cacheable prefix vs. per-tenant | Could tenant data or entitlements differ inside the prefix? |
| Summarize vs. externalize state | Is fidelity over time required, or is a gist enough? |
| Memory tool vs. application-owned store | Who needs to read, audit, and delete it? |
| Retrieve on demand vs. carry in context | How often is it actually needed per session? |
| Progressive discovery vs. monolithic context | Is the full surface needed every turn, or discoverable on demand? |
| Tool search vs. curated per-task tools | Is the tool surface large and task-dependent? |
| Raise the budget vs. redesign the flow | Is growth bounded, or unbounded by construction? |

## How to run this session

1. **Frame** — context architecture is simultaneously the top cost driver, a correctness
   concern, and a data-boundary concern. Most P6 items turn on one of those three.
2. **Teach the layered context architecture** and have the learner lay out all five layers
   for a stated multi-tenant product, ordered for cacheability.
3. **Teach the cache-layout rule** and then its organizational consequence: who is allowed
   to edit the shared prefix, and how often. Ask them to connect a prompt-governance policy
   to a cost line. That link is the Professional-altitude insight.
4. **Teach multi-tenant context safety** as the session's highest-stakes idea. Construct the
   leak three ways — shared prefix containing tenant data, cache shared across tenants,
   memory store without tenant scoping — and have them design against each.
5. **Teach long-horizon memory options** and have them place four requirements.
6. **Teach repeated-summarization degradation.** Ask what happens after five compactions,
   and what an error in summary two does to the rest of the session.
7. **Teach per-component budgets** and have them allocate a window explicitly.
8. **Teach the tool-definition scaling problem** and its mitigations.
9. **Teach the three-way connection** — cost, quality, compliance — with one example each.
10. **Teach diagnosis**: four production context symptoms, four different causes and fixes.
11. **Decision table** — walk all six rows.
12. **Scenario drill — 5 questions**, standalone Professional format. Include a
    multi-tenant safety question, a cache-layout question, a memory strategy choice, a
    budget allocation question, and one multiple-response on summarization risks.
13. **Distractor autopsy** — expect cache efficiency pursued at the cost of tenant
    isolation, and budget increases offered for unbounded growth.
14. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Model steering and prompt portfolios → session 15
- Retrieval design → session 3
- Cost arithmetic → session 9
- Compliance program → session 10
