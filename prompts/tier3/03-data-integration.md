# Retrieval Architecture: Full Context, Agentic Search, or RAG — P3 Integration

**Exam weight: 21%**

*Owns CCAR-P v1.1 § 5 task statement:*

- P3.5 — Retrieval Architecture Selection: Selecting among retrieval architectures
  (pre-built RAG pipeline, agentic search with tools, full-corpus context) based on corpus
  characteristics, query pattern, and latency and cost limits, and, when indexing is
  chosen, specifying the contextual-retrieval and fallback configuration that maximizes
  retrieval quality within those limits.

## What this session assumes

Sessions 28–29 and Tier 1's tool-use sessions. Prompt caching has not been taught yet:
it appears as a lever in sessions 32 and 36, prefix ordering is session 41 (P2.4), and
breakpoint placement is session 42 (P2.5). Here, state only that a
stable prefix can be cached, which is what makes full-corpus context and per-chunk context
generation affordable, and defer the mechanics. This completes P3's data side: how
enterprise content reaches the model.

## Why this domain is worth 21% of your score

P3 is the largest Professional domain, and v1.1 rewrote its retrieval objective. It no
longer asks you to design a chunking strategy; it asks you to **choose the retrieval
architecture first** — a pre-built RAG pipeline, agentic search with tools, or the whole
corpus in context — from the corpus, the query pattern, and the latency and cost limits,
and only then, if you chose an index, to configure it well. Wrong answers build a pipeline
the corpus didn't need, or pick an index where the model should have searched with tools,
or tune the index without a fallback for the queries it will miss.

## Session focus

This session teaches retrieval architecture selection. The crux is **three architectures,
chosen by corpus and query shape before any pipeline detail**: full-corpus context when the
corpus is small and stable enough to fit and cache; agentic search with tools when the
corpus is large, live, already searchable through its own systems, or permission-rich, and
queries are exploratory or multi-hop; a pre-built RAG pipeline when the corpus is large and
the query pattern is high-volume, predictable, and latency-bound so a precomputed index
pays for itself. Spend disproportionate time making the learner choose among the three
against stated latency and cost limits — and treat agentic search as a first-class option,
not a fallback, because "we need RAG" is the reflex the exam punishes. The second half is
the "when indexing is chosen" branch: **contextual retrieval** (contextual embeddings,
contextual BM25, reranking) and the **fallback configuration** for queries the index
misses. Chunking survives only as the prerequisite contextual retrieval and indexing need;
it is no longer a named objective, so keep it short.

## Authoritative sources

**Retrieval architecture and contextual retrieval**
- <https://www.anthropic.com/engineering/contextual-retrieval>
- <https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide>
- <https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide>
- <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents> — just-in-time retrieval via tools versus pre-computed retrieval

> **Note on sourcing.** These are first-party and carry real numbers — verify against them
> the same as any other source. The Contextual Retrieval article is the anchor: it
> publishes the measured failure-rate reductions for contextual embeddings, contextual
> BM25, and reranking, the retrieve-many-then-rerank shape, the cost of generating chunk
> context with prompt caching, and the corpus-size threshold below which the whole
> knowledge base can simply go in the prompt. Verify each figure from the article before
> teaching it, and teach them as *measured on Anthropic's evaluation*, not as universal
> settings.
>
> What is genuinely *not* first-party: embedding-model and vector-database selection.
> Anthropic states it "does not offer its own embedding model" and its embeddings page is
> a guide to a third party. Teach vendor choice as vendor-neutral reasoning; the task
> statement asks for an architecture and a configuration, not a vendor.

**Agentic search with tools**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool>
- <https://platform.claude.com/docs/en/build-with-claude/search-results>

**Full-corpus context**
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
- <https://platform.claude.com/docs/en/build-with-claude/files>
- <https://platform.claude.com/docs/en/build-with-claude/pdf-support>

**Grounding and attribution**
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/embeddings>

## Teaching objectives

By the end, the learner can:

- Name the **three retrieval architectures** and what each assumes:
  - **Full-corpus context** — the whole corpus goes in the prompt, cached as a stable
    prefix. No index, no retrieval misses, no pipeline to operate; costs per-request
    tokens and latency that caching only partly offsets, and is bounded by the window and
    by long-context accuracy. Apply Anthropic's corpus-size threshold (verify it from the
    Contextual Retrieval article) *before* designing anything else — a corpus under it
    usually needs no retrieval at all
  - **Agentic search with tools** — the model searches at inference time through tools
    (search APIs, grep/file tools, database queries, the source system's own search),
    iterating and refining. No precomputed index to build or keep fresh; reads the system
    of record, so freshness and the source's own permissions come for free; handles
    exploratory and multi-hop queries well. Costs multiple model turns per query — higher
    and less predictable latency and token spend
  - **Pre-built RAG pipeline** — an index (embeddings, keyword, or both) built ahead of
    time, queried in one retrieval step. Fast and cheap per query at high volume; costs
    an indexing pipeline, a freshness and invalidation story, and the misses a one-shot
    retrieval makes on queries it wasn't shaped for
- Select among them from the **three inputs the statement names**:
  - **Corpus characteristics** — size (fits the window or not), rate of change, whether
    it already has a usable search interface, structure (prose, code, tables, records),
    and whether access rules vary by document
  - **Query pattern** — volume, predictability, single-hop lookup vs. exploratory or
    multi-hop, exact identifiers vs. paraphrase, and whether the "question" is really a
    filter over known fields (then the tool is a structured query, not an embedding)
  - **Latency and cost limits** — a tight per-query latency budget at high volume favors
    a precomputed index; a loose budget and low volume make agentic search affordable;
    a small stable corpus with caching can make full context cheapest of all
- Recognize **agentic search as the default for live, permission-rich systems of record**
  (tickets, accounts, a code repo, an intranet with per-user ACLs): searching through the
  source system's own tools, under the user's identity, avoids building an index that
  duplicates data and must replicate every ACL change — a copied index of
  permission-varying documents leaks unless every chunk carries its ACL and every query
  is filtered per user (the auth posture side is session 28)
- Combine architectures deliberately — a small stable core in cached context plus
  agentic search for the long tail, or an index with an agentic fallback — and say what
  each layer is for
- When indexing is chosen, specify the **contextual-retrieval configuration**:
  - **Contextual embeddings** — prepend to each chunk a short, model-generated
    description of its place in the parent document, so the embedding encodes what the
    chunk is *about*, not only what it literally says; generate that context with prompt
    caching so the parent document is paid for once
  - **Contextual BM25** — a keyword index over the same contextualized chunks, catching
    exact identifiers, error codes, and names that embeddings miss; merge with the dense
    results (hybrid)
  - **Reranking** — retrieve a large candidate set cheaply, rerank, pass a smaller top
    set; costs a latency step. Cite the published shape (each layer reduces retrieval
    failure, and they compose) rather than memorized digits
  - **Chunking only as prerequisite** — chunks are the unit contextual retrieval
    describes and indexes, so cut on the document's semantic boundaries and attach
    per-chunk metadata (source, section, date, ACL/tenant); that metadata is what filtering
    and citation run on. Size and overlap are tuned per corpus, not memorized
- When indexing is chosen, specify the **fallback configuration** for queries the index
  serves badly: hybrid keyword retrieval for exact-term misses; a relevance threshold
  below which the system falls back to agentic search, a broader query, or the full
  source document; and an explicit "not found" or escalation path rather than answering
  from weak context. A fallback is configured against the same latency and cost limits —
  it should fire on the miss case, not on every query
- Keep the index honest over time: re-embedding and invalidation when documents change,
  and removal when a document is deleted or re-permissioned
- Use **citations** to make retrieved answers verifiable, and connect them to groundedness
  as an eval dimension (session 34)

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Full-corpus context vs. any retrieval | Does the corpus fit under the threshold, and is it stable enough to cache? |
| Agentic search vs. pre-built RAG | Is the corpus live, already searchable, or permission-rich — and can the latency budget afford multiple turns? |
| Pre-built RAG vs. agentic search | Are queries high-volume and predictable under a tight per-query latency or cost limit? |
| Embedding retrieval vs. structured query tool | Is the question really a filter over known fields? |
| Contextual embeddings vs. raw-chunk embeddings | Do chunks lose meaning out of their parent document? |
| Dense only vs. hybrid with contextual BM25 | Do queries include exact identifiers, codes, or names? |
| Rerank vs. retrieve fewer | Is first-pass recall adequate but precision poor, and is there latency budget for a rerank step? |
| Index alone vs. index with fallback | What happens to the query the index misses — wrong answer, or a fallback path? |
| Copied index vs. search the system of record | Do access rules vary per document and change often? |

## How to run this session

1. **Frame** — v1.1 asks for the architecture before the pipeline. Name the three options
   and say plainly that agentic search is a first-class choice, not what you do when RAG
   fails.
2. **Ask for the corpus size first.** Before any design, establish whether full-corpus
   context answers it. Make the learner ask this unprompted in a later exercise; a
   candidate who builds an index for a 60-page handbook has over-engineered.
3. **Teach the three architectures** with a concrete example each, naming what each one
   makes you operate and what it costs per query.
4. **Teach selection as elimination.** Give five scenarios with stated corpus, query
   pattern, and latency/cost limits — a stable 80-page policy manual, a customer-support
   bot at high volume over a 50,000-article KB with a sub-second budget, an engineer's
   exploratory questions over a large monorepo, an intranet with per-team ACLs that change
   weekly, and a mixed case — and have the learner choose, naming the deciding input
   each time. Spend the most time here.
5. **Teach agentic search properly.** Ask what it buys (freshness, source permissions,
   multi-hop) and what it costs (turns, latency variance, tokens). If the learner
   reaches for an index on the ACL-heavy intranet, construct the leak from a copied index
   and ask what keeping it correct would take.
6. **Teach combinations** — cached core plus agentic long tail, index plus agentic
   fallback — and when the extra layer is justified.

   *The remaining steps are the "when indexing is chosen" branch. Verify the figures
   against the Contextual Retrieval article before teaching them, and tell the learner
   they are measurements from one evaluation, not settings to memorize.*

7. **Teach chunking briefly as the prerequisite** — the chunk is the unit contextual
   retrieval describes, so cut on semantic boundaries and attach metadata. One example,
   not a workshop; chunking is no longer a named objective.
8. **Teach contextual retrieval as a stack** — contextual embeddings, contextual BM25,
   reranking — and have the learner say which layer fixes which miss: a chunk that
   doesn't say what it's about, an exact part number, a relevant chunk ranked 40th.
   Connect the context-generation cost to prompt caching.
9. **Teach fallback configuration.** Present three misses — an exact error code the
   embedding ignores, a question no chunk answers, a multi-hop question the one-shot
   retrieval can't assemble — and have them configure the fallback for each within the
   stated limits. "Improve the prompt" is the wrong answer to all three.
10. **Teach index upkeep** in one pass: change, delete, re-permission.
11. **Decision table** — walk all rows.
12. **Scenario drill — 5 questions**, standalone Professional format. Include a
    full-context-vs-retrieval choice decided by corpus size, an agentic-search-vs-RAG
    choice decided by latency or freshness, a contextual-retrieval configuration item, a
    fallback-configuration item, and one multiple-response on which corpus or query
    characteristics favor a stated architecture.
13. **Distractor autopsy** — expect a RAG pipeline built for a corpus that fits in
    context, an index chosen for a live permission-rich system of record where agentic
    search fits, agentic search chosen under a tight high-volume latency budget, dense
    retrieval offered for exact-identifier lookup, an index with no fallback for its
    misses, and "add more context" as the answer to a precision problem.
14. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Retrieval depth as a latency/accuracy lever on a running system → session 32 (P3.3)
- Retrieval failure as a root cause in traces → session 33 (P4.5); retrieval and
  groundedness metrics → session 34 (P4.1)
- Retrieved documents as an injection surface → session 35 (P5.2)
- PII redaction, residency, and tenant isolation controls → session 37 (P5.5)
- Progressive discovery vs. loading everything up front, and context economics →
  session 41 (P3.7, P2.4)
- Vector database product selection and operations → out of scope for the exam entirely
