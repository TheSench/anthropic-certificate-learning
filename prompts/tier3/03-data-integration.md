# Files, Citations, RAG, and Data Wiring — P1 Integration

**Exam weight: 19%**

## What this session assumes

Sessions 1–2. This completes P1 by covering how enterprise *data* reaches the model.

## Why this domain is worth 19% of your score

"Data wiring" is named in the P1 domain description. The scored judgment is choosing among
ways to get information in front of the model — long context, retrieval, files, tool
lookup at inference time — and knowing which one satisfies a *freshness*, *permission*,
and *auditability* requirement rather than just fitting the tokens.

## Session focus

This session covers how enterprise data reaches the model — long context, RAG, files, or inference-time tool lookup. The crux is that the choice is decided by **permission, freshness, and auditability far more often than by token math**, and permission usually dominates. Spend the most time on permission-filtered retrieval: one index, two users with different entitlements, one query. Reject any fix that filters *after* generation and explain why that's too late — most wrong answers here are token-optimal designs that leak. The session's second half is **pipeline internals** — chunking, indexing, and retrieval strategy — which CCAR-P names directly in two task statements. Teach it as a chain where each stage constrains the next, and land the rule that governs all of it: **the chunk is the unit of retrieval, so it must be the unit that answers a question.**

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

**RAG pipeline internals** — chunking, hybrid retrieval, reranking

- <https://www.anthropic.com/engineering/contextual-retrieval>
- <https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide>
- <https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide>

> **Note on sourcing.** These three are first-party and carry real numbers — verify against
> them the same as any other source. The Contextual Retrieval article is the anchor: it
> publishes the chunk-size guidance ("usually no more than a few hundred tokens"), the
> measured failure-rate reductions (35% for contextual embeddings, 49% combined with BM25,
> 67% adding a reranker), the retrieve-150-then-rerank-to-20 shape, the cost of generating
> chunk context with prompt caching, and the threshold below which RAG is unnecessary at
> all (a knowledge base under ~200K tokens can simply go in the prompt). Teach those
> numbers as *measured on Anthropic's evaluation*, not as universal settings — the article
> itself says chunk size, boundary, and overlap all affect retrieval and must be tuned per
> corpus.
>
> What is genuinely *not* first-party: embedding-model and vector-database selection.
> Anthropic states it "does not offer its own embedding model" and its embeddings page is a
> guide to a third party (Voyage AI). So teach vendor choice as vendor-neutral reasoning,
> and don't send the learner to a vendor's docs to "verify" a default — that validates a
> product, not an exam answer. The task statements ask for *appropriate strategies* matched
> to data and query shape, not for any vendor's API.

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
- Design the **chunking strategy** from the document's own structure rather than a fixed
  character count: split on semantic boundaries (section, clause, function, row group),
  because a chunk cut mid-argument retrieves as a fragment that answers nothing. State the
  governing rule — **the chunk is the unit of retrieval, so it must be the unit that
  answers a question** — and reason about the two failure directions: chunks too small
  lose the context that makes them interpretable; chunks too large dilute the embedding
  and retrieve on incidental matches
- Explain **chunk overlap** as insurance against boundary loss, and its cost: duplicated
  content inflates the index, returns near-identical neighbours, and spends context budget
  on repetition
- Attach **metadata to every chunk** — source document, section, date, and the ACL or
  tenant it belongs to — and recognize that this is what makes filtered retrieval, recency
  weighting, and citation possible at all. The permission filter taught above *is* a
  metadata filter; without per-chunk metadata it cannot be built
- Explain **contextual retrieval**: a chunk carrying a short description of its place in
  the parent document retrieves far better than the raw span, because the embedding then
  encodes what the chunk is *about* rather than only what it literally says. Anthropic
  measured a 35% reduction in top-20 retrieval failure from contextual embeddings alone,
  49% combined with contextual BM25, and 67% adding a reranker — cite the shape of those
  results (each layer helps, and they compose) rather than the digits
- Apply the **corpus-size threshold before designing a pipeline at all**: Anthropic's
  guidance is that a knowledge base under roughly 200K tokens can simply go in the prompt,
  and building retrieval for it is unnecessary complexity. Ask for corpus size before
  accepting "we need RAG" — this is the session's cheapest correct answer and a clean
  instance of session 4's over-engineering rule
- Choose the **retrieval strategy** against data shape and query pattern, which is a
  distinct decision from choosing RAG at all:
  - **Dense / vector** — paraphrase and concept matching; fails on exact identifiers
  - **Sparse / keyword (BM25)** — exact terms, error codes, part numbers, names
  - **Hybrid** — both, merged; the default for mixed corpora, at the cost of two indexes
  - **Structured query** — when the "question" is really a filter over fields, the right
    retrieval is a database query, not an embedding lookup
- Explain **reranking** as a second, more expensive pass over a cheap first-pass candidate
  set, and why retrieve-many-then-rerank-few beats retrieving few directly — and what it
  costs in latency. Anthropic's published shape is retrieve ~150 candidates, rerank, pass
  the top 20; know that passing more well-ranked chunks (20) outperformed passing fewer
  (5 or 10), which cuts against the instinct to minimize context
- Reason about **what to retrieve versus what to send**: top-k selection, deduplication,
  and the fact that more retrieved context is not monotonically better
- Recognize the **indexing lifecycle** as an operational commitment: documents change, so
  an index needs a re-embedding and invalidation story, and a deleted or re-permissioned
  document must leave the index or the permission filter is already wrong
- Diagnose a retrieval failure to **which stage caused it** — chunking, embedding, the
  retrieval strategy, ranking, or the prompt consuming the results — rather than treating
  "RAG isn't working" as one problem
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
| Structure-aware chunks vs. fixed-size | Does the document have semantic boundaries worth respecting? |
| Smaller chunks vs. larger | Is the failure retrieving fragments, or retrieving on incidental matches? |
| Dense vs. sparse vs. hybrid retrieval | Are queries conceptual, exact-term, or both? |
| Embedding lookup vs. structured query | Is the question really a filter over known fields? |
| Rerank vs. retrieve fewer | Is first-pass recall adequate but precision poor? |
| Re-embed on change vs. periodic rebuild | How fast does the corpus move, and what does a stale chunk cost? |
| Build a pipeline vs. put the corpus in the prompt | Is the corpus above or below the ~200K-token threshold? |

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

   *The remaining steps are the pipeline internals. Verify the figures against the
   Contextual Retrieval article before teaching them, and tell the learner they are
   measurements from one evaluation, not settings to memorize — chunk size and overlap
   are tuned per corpus.*

10. **Ask for the corpus size first.** Before any pipeline design, establish that
    retrieval is warranted at all — under ~200K tokens the corpus can go in the prompt.
    Make the learner ask this unprompted in a later exercise; a candidate who designs a
    chunking strategy for a 60-page handbook has over-engineered, and the exam rewards
    noticing.
11. **Teach chunking from the governing rule**, not from numbers. State it — the chunk is
    the unit of retrieval, so it must be the unit that answers a question — then make them
    apply it: hand them four documents with different structure (an API reference, a
    contract with numbered clauses, a chat transcript, a table of sales rows) and ask where
    each should be cut and why. The point is that the *document's* structure decides, not a
    global setting. Then walk both failure directions: a chunk cut mid-clause that retrieves
    as a meaningless fragment, and a whole-chapter chunk whose embedding is so diluted it
    surfaces on incidental matches.
12. **Teach overlap and metadata together.** Overlap is cheap insurance with a real cost;
    metadata is what the rest of the pipeline runs on. Make the connection back explicitly:
    the permission-filtered retrieval they designed in step 4 *is* a metadata filter, and
    is unbuildable without per-chunk ACLs. If they didn't reach for metadata in step 4,
    that's the gap to name now.
13. **Teach contextual retrieval** — why a chunk that carries its place in the parent
    document retrieves better than the raw span.
14. **Teach retrieval strategy as its own decision.** Give five queries against one corpus
    — a paraphrased concept question, an exact error code, a part number, a "find me
    everything from Q3 by team X", and one mixed — and have them pick dense, sparse,
    hybrid, or structured query for each, naming the tell. The structured-query case is the
    one most people miss: when the question is a filter over known fields, embeddings are
    the wrong tool entirely.
15. **Teach reranking** as retrieve-many-then-rank-few, with its latency cost, and ask when
    it's *not* worth it.
16. **Teach the indexing lifecycle** as the operational half. Ask what happens when a
    document is deleted, re-permissioned, or edited. Connect it hard to permissions: a
    revoked document still sitting in the index means the filter they designed is already
    wrong. This is where a pipeline that passed review starts leaking six months later.
17. **Teach stage-level diagnosis.** Present four retrieval failures — the right document
    exists but never retrieves, the right chunk retrieves but the answer is still wrong,
    retrieval is accurate but too slow, results are relevant but stale — and have them name
    the stage at fault. "Improve the prompt" is a wrong answer to three of the four.
18. **Decision table** — walk all rows.
19. **Scenario drill — 5 questions**, standalone Professional format. Include a
    permission-filtering question, a chunking-strategy choice driven by document structure,
    a dense-vs-sparse-vs-hybrid choice driven by query shape, a stage-diagnosis question,
    and one multiple-response on what a RAG pipeline must handle beyond first retrieval.
20. **Distractor autopsy** — expect token-optimal answers that violate a permission or
    freshness requirement, post-generation filtering as a leak "fix", a fixed chunk size
    applied regardless of document structure, dense retrieval offered for exact-identifier
    lookup, and "add more context" as the answer to a precision problem.
21. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Eval design for retrieval quality → session 7 (retrieval has its own metrics —
  recall@k, precision, faithfulness; name that they exist, teach them there)
- Vector database product selection and operations → out of scope for the exam entirely;
  the task statements ask for strategy, not vendor choice
- Compliance and residency program → session 10
- Context engineering at scale → session 14
- Cost modeling → session 9
