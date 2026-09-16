# Agent SDK Hooks for Interception and Normalization — F1 Agentic Architecture & Orchestration

**Exam weight: 27% (highest of any Foundations domain)**

*Owns § 6 task statement 1.5 — Apply Agent SDK hooks for tool call interception and data
normalization.*

## What this session assumes

Sessions 1 and 14. From session 1: the agentic loop, `stop_reason`, and above all harness
vs. model — a hook *is* harness, so the learner must already believe that most production
failures are fixed on the harness side rather than by rewriting a prompt. From session 14:
what a tool interface actually is — name, description, parameter schema, and the result
that comes back. That dependency is the reason this session sits at 15 rather than beside
the other F1 material at 1–4: a hook intercepts a tool call and rewrites a tool result, and
a learner who has not yet designed a tool interface has nothing concrete to intercept. Say
this out loud when you frame the session.

Session 4 taught **enforcement as an architectural choice** and explicitly deferred the
mechanism here. Close that loop in the first two minutes: "you decided in session 4 that a
gate belongs in the harness; this session is the API that builds the gate."

## Why this domain is worth 27% of your score

This is an F1 session, not an F2 one, and that matters more than it looks. Task 1.5 is
Domain 1 — Agentic Architecture — because a hook is a *structural* property of the agent,
not a Claude Code convenience: it changes what the loop is guaranteed to do regardless of
what the model decides. The material has historically been filed under Claude Code
configuration, which made F1's real coverage look thinner than it was. Teach it as
architecture. "When a hook beats a system-prompt instruction" is a documented exam question
type, and the axis it tests — guaranteed versus requested — is the same axis session 4 used
for enforcement and session 1 used for harness vs. model.

## Session focus

This session covers Agent SDK hooks as the deterministic layer of the agentic loop: intercepting an outgoing tool call to enforce a rule, and transforming a tool result before the model ever reads it. The crux is the **guarantee axis** — a hook is harness-enforced code that runs every time on an event, while a prompt instruction is context the model may or may not act on, and "usually complies" is not a control. Land that axis before any mechanism detail, and return to it at every decision. Spend disproportionate time on the two named patterns the task statement calls out: `PostToolUse` normalization of heterogeneous formats (the model never sees the mess), and outgoing-call interception that *blocks and redirects* rather than merely failing. Verify the current hook event names against live docs before you teach any of them — event surfaces change more often than concepts do, and a confidently wrong event name is worse than saying "let me check."

## Authoritative sources

Verify event names and the hook payload shape against live docs before naming any of them.

**Hook events and payloads**
- <https://code.claude.com/docs/en/hooks> — event reference
- <https://code.claude.com/docs/en/hooks-guide> — patterns
- <https://code.claude.com/docs/en/agent-sdk/hooks> — the SDK surface, which is what 1.5 names

**What a hook acts on**
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works>
- <https://code.claude.com/docs/en/tools-reference>

**The loop the hook sits inside**
- <https://code.claude.com/docs/en/agent-sdk/agent-loop>

## Teaching objectives

By the end, the learner can:

- State the decisive difference: a **hook** is harness-enforced code that runs
  deterministically on an event; a **prompt instruction** is context the model may or may
  not act on. Name the consequence — anything that must happen *every* time belongs on the
  event path, not in a prompt
- Describe the hook event surface by name, having verified it against live docs, and place
  **`PostToolUse`** on it precisely: it fires *after* a tool executes and *before* the model
  reads the result, which is exactly what makes result transformation possible
- Use a **`PostToolUse`** hook to **normalize heterogeneous data formats** arriving from
  different MCP tools, using the guide's own examples: one backend returning **Unix
  timestamps** and another **ISO 8601**; one returning **numeric status codes** and another
  status strings. The hook reconciles them on the event path, so the model receives one
  consistent shape and no prompt has to explain the inconsistency
- Explain why normalization in a hook beats normalization in the prompt: the mismatch is
  *mechanical*, so it needs no judgment, and a prompt that explains three timestamp formats
  spends context on every turn to buy a probabilistic result
- Use a hook that intercepts an **outgoing tool call** to enforce compliance — the canonical
  case being a refund tool call above a stated threshold — and describe what interception
  can do that a post-hoc check cannot: the action never happens
- Design the interception to **block *and redirect***, not merely refuse: a blocked
  refund above threshold routes to **human escalation**, so the workflow has somewhere to
  go rather than dead-ending in an error the model then has to improvise around. Name this
  as the difference between a guardrail and a wall
- Choose hooks over prompt-based enforcement whenever a business rule requires
  **guaranteed compliance**, and say what the alternative actually costs: a prompt
  instruction has a non-zero failure rate, and for a financial or policy control a non-zero
  failure rate is the whole risk
- Recognize the two inverse anti-patterns: a hook doing work that requires model judgment
  (relevance, tone, "is this request reasonable") and an instruction doing work that
  requires a guarantee (secret scanning, threshold enforcement, required ordering)
- Connect the mechanism back to session 4: the gate that must hold *every* time between
  steps of a multi-step workflow is implemented as an interception hook, and the deferred
  "how" from that session is answered here

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| Hook vs. prompt instruction | Must it happen *every* time, or is compliance advisory? |
| `PostToolUse` transform vs. explaining the format in the prompt | Is the inconsistency mechanical, or does reconciling it need judgment? |
| Intercept the outgoing call vs. check after the fact | Is the action reversible once it has happened? |
| Block-and-redirect vs. block-and-fail | Does the workflow have a legitimate next step (escalation), or is stopping correct? |
| Hook vs. model judgment | Is the rule expressible as code, or does it need the model to weigh something? |

## How to run this session

1. **Frame — and fix the filing.** Say plainly that this is F1 architecture, not Claude
   Code configuration: a hook changes what the loop is *guaranteed* to do. Then close the
   session 4 loop explicitly — "you chose a gate architecturally there; here is the API" —
   and say why the session sits after 14: you cannot reason about intercepting a tool call
   until you have designed a tool interface.
2. **Verify the hook event list against live docs** before teaching it. Do not recite event
   names from memory. Tell the learner you are doing this and why.
3. **Teach the guarantee axis first**, before any mechanism detail. Two questions, in this
   order: "you must never let a secret reach a commit — instruction or hook?" then "you'd
   *prefer* commit messages follow a convention — instruction or hook?" The axis has to land
   before detail arrives, or every later choice becomes a memory exercise.
4. **Teach `PostToolUse` normalization** as the session's first deep pattern, because it is
   the one learners have not met. Give three MCP-backed tools returning the same field three
   ways — a Unix timestamp, an ISO 8601 string, and a numeric status code where a sibling
   returns a string — and ask where that gets reconciled. Push back on "tell the model about
   the formats in the system prompt": ask what that costs per turn and what its failure rate
   is. Land the sentence that makes it stick: **the model never sees the mess**, because the
   hook runs after the tool and before the model reads the result.
5. **Teach outgoing-call interception** with the refund-threshold case. First ask for the
   prompt-based version, then ask what its failure rate is and who finds out. Then have them
   write the rule as a hook. Then — this is the part they will miss — ask what happens to the
   conversation *after* the block. Draw out block-and-redirect: route to human escalation so
   there is a next step, rather than returning an error the model then improvises around.
6. **Teach the choice rule.** Guaranteed compliance → hook. Judgment → model. Have them
   classify six requirements, at least one of which reads like a hook but needs judgment,
   and at least one of which reads like guidance but must be enforced.
7. **Decision table** — walk all five rows, scenario-first: give the scenario, take their
   answer, then name the tell.
8. **Scenario drill — 5 questions.** Use an agent over three MCP-backed services — a
   payments backend, a CRM, and a ticketing system — that return timestamps and status in
   different shapes, and where refunds above $500 require a human. Ask which hook event
   handles the format mismatch, what the prompt-based enforcement of the refund ceiling
   costs, what a block should do besides refuse, and one item where the tempting answer is a
   hook but the rule needs judgment. Include one multiple-response.
9. **Distractor autopsy** on all five. Expect "add the format rules to the system prompt",
   "give the model clearer instructions about the refund limit", and "check the refund after
   it posts and reverse it if it violates policy" — the last one is the reversibility trap
   and is worth naming as its own tell.
10. Record per `.agents/TUTORIAL.md` Step 5. Glossary every event name and payload field you
    verified.

## Out of scope

Defer and say where it's covered:
- Skills, `SKILL.md` frontmatter, and slash commands → session 20. They are extension
  mechanisms too, but they sit on the *other* side of the guarantee axis and belong with
  CLAUDE.md, not with hooks
- CLAUDE.md as an instruction surface → session 19
- Iterative refinement and CI/CD → session 21
- The architectural case for enforcement, and session state → session 4, already taught
- Tool interface authorship → session 14, already taught
- **Plugins** as a packaging and distribution mechanism: one labelled aside at most. They
  appear in neither § 6 nor the § 17 appendix, so they are not scored — say "this exists and
  is how teams distribute the above" and move on. Do not build a decision row around it
