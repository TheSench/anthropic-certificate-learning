# Guardrails and the Injection Surface — P5 Governance, Safety, and Risk Management

**Exam weight: 16%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P5.1 — Guardrail Placement: Analyzing guardrail placement in a system design against a
  described misuse path, and selecting the control that closes the path without degrading
  a stated legitimate use case.
- P5.2 — Prompt Injection Surface and Controls: Analyzing the injection surface of an
  architecture whose model context includes retrieved documents, tool results, MCP server
  responses, or third-party Skills, and specifying the controls that prevent untrusted
  content from being treated as instruction.

## What this session assumes

Session 34 (eval design) — guardrails without evals are unmeasurable, so that order
matters. Session 28 (integration auth posture, P3.2) and Tier 1 sessions 7 and 12 (MCP and
CI agents), which this session uses as injection callbacks.

## Why this domain is worth 16% of your score

P5 Governance, Safety, and Risk Management grew to 16% in v1.1, and it is where
Foundations-strong candidates are thinnest. Both objectives here are **placement**
questions: given a system diagram and a misuse path, *where* does the control go, and
which content in context must never be obeyed. The scored judgment is choosing the control
that closes the specific path — knowing that prompt-level guardrails shift odds rather than
guarantee, so anything stated as "must never" needs a deterministic control outside the
model — while leaving the stated legitimate use intact. v1.1's Sample 3 rewards the same
shape: a narrow deterministic constraint on the risky action, not a blanket gate.

## Session focus

This session is placing controls on a system diagram. The crux is **close the path, not the product**: for P5.1, trace the misuse path from where it enters to where harm lands, and pick the control at the narrowest point the legitimate use case doesn't cross — a blanket input filter or a gate on everything usually "closes" the path by breaking the stated legitimate use, and that option is the distractor. For P5.2, the crux is that **every channel that puts third-party text into context is an instruction channel unless the architecture makes it otherwise** — retrieved documents, tool results, MCP server responses, and third-party Skills (which are instructions by design) — and the strongest control is limiting what an injected instruction could *do* (least privilege, no side effects after untrusted reads, validation at the side-effect boundary), not asking the model to ignore it. Spend disproportionate time on the walk-the-diagram exercise for both.

## Authoritative sources

**Guardrails and where they sit**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/content-moderation>
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://www.anthropic.com/legal/aup>

**Enforcement points outside the model**
- <https://platform.claude.com/docs/en/manage-claude/inference-hooks>
- <https://code.claude.com/docs/en/hooks>
- <https://code.claude.com/docs/en/permissions>
- <https://code.claude.com/docs/en/sandboxing>

**The injection surface (P5.2)**
- <https://code.claude.com/docs/en/security>
- <https://code.claude.com/docs/en/security-guidance>
- <https://code.claude.com/docs/en/mcp>
- <https://code.claude.com/docs/en/managed-mcp>
- <https://code.claude.com/docs/en/skills>

**Supporting — grounding (scored mainly in sessions 33–34)**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/build-with-claude/citations>

## Teaching objectives

By the end, the learner can:

**P5.1 — guardrail placement against a misuse path**

- Trace a **misuse path** through a system diagram: where the misuse enters (user input,
  ingested content, a tool), which component acts on it, and where the harm lands (data
  returned, a side effect, an outbound message)
- Know the **placement points** and what each can and cannot close: input screening,
  system prompt instructions, tool scoping and permissions, the side-effect boundary
  (deterministic validation of arguments before a tool executes), output screening,
  human approval (where gates sit is P5.4, session 38), and quotas
- Select the control that **closes the path without degrading the stated legitimate use
  case**: the narrowest deterministic constraint on the step the misuse needs and the
  legitimate use doesn't — e.g. restricting an email tool to addresses already on the
  account rather than removing email; scoping a lookup tool to the caller's records rather
  than screening every query for keywords
- Apply the central limitation: prompt-level guardrails shift probabilities; they don't
  guarantee. Any requirement stated as "must never" needs a deterministic control outside
  the model
- Treat **over-refusal** as degradation, not a safe default: a control that blocks the
  nurse asking about a drug interaction, or the security engineer asking about an exploit,
  fails P5.1's second clause
- Use **input vs. output screening** by where the harm is — in what's received, or in
  what's returned — and design the on-hit action (block, redact, degrade, escalate)
- Explain why the system prompt is not a security boundary: assume it is discoverable, so
  a secret in it is a design defect to remove, not a leak to hide
- Explain **defense in depth**: no single control is sufficient; layer controls so one
  failing does not open the path
- Measure placement with **guardrail evals**: an adversarial set *and* a legitimate-use set
  run as a regression gate (session 34), since a control that closes the path but breaks
  the legitimate use only shows up in the second set

**P5.2 — the injection surface and its controls**

- Distinguish **prompt injection** (instructions arriving through content the system
  ingests) from **jailbreak** (the user's own input): the mitigations differ, and
  injection is a privilege problem more than a prompt problem
- Enumerate the injection surface for a given architecture, channel by channel:
  - **Retrieved documents** — any author who can write to the corpus can write
    instructions into context
  - **Tool results** — web pages, tickets, emails, PR bodies, API responses
  - **MCP server responses** — tool results *and* the server-supplied tool descriptions
    themselves; a third-party or compromised server controls both
  - **Third-party Skills** — loaded into context *as* instructions, often with scripts the
    agent may run; labelling cannot help, because the content is meant to be followed
- Specify the controls that keep untrusted content from being treated as instruction:
  - **Least-privilege tooling** — the strongest control: an injected instruction can only
    do what the tools permit (scoping tool connections is P3.1, session 41)
  - **Separate and label untrusted content** as data (clearly delimited, attributed to
    its source), and tell the model it carries no authority — useful but probabilistic,
    never the only layer
  - **No side effects downstream of untrusted reads** without a check — once untrusted
    content is in context, restrict or gate side-effecting and outbound tools, or split
    reading and acting into separate agents with a narrow structured handoff
  - **Validate at the side-effect boundary** — deterministic checks on tool arguments
    (allowed recipients, allowed paths, amount limits) that injected text cannot talk past
  - **Provenance and allowlisting for Skills and MCP servers** — review, pin, and
    centrally manage which third-party Skills and servers may load, and sandbox what they
    run. Supply-chain risk ranking is P5.3, session 38; central distribution controls are
    P7.1, session 43
- Verify current Claude Code and platform mechanisms (hooks, permission rules, managed MCP
  and Skills settings, sandboxing) from live docs before naming them

**Supporting material, no longer separately scored here**

- Hallucination and inconsistency mitigation (grounding, citations, permission to say "I
  don't know"; explicit criteria and structured output) has no owning P5 objective in
  v1.1. Mention it only where it supports a placement answer; it is scored mainly through
  groundedness (P4.1, session 34) and root-cause isolation (P4.5, session 33)

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Where on the path to place the control | Which step does the misuse need that the legitimate use doesn't? |
| Narrow deterministic constraint vs. blanket gate or filter | Does the broader control break the stated legitimate use case? |
| Prompt guardrail vs. deterministic control | Is the requirement "usually" or "never"? |
| Input screening vs. output screening | Is the harm in what's received or what's returned? |
| Injection vs. jailbreak | Did the instruction come from ingested content or from the user? |
| Restrict tools vs. harden instructions | Could an injected instruction cause real damage with the current tools? |
| Label untrusted content vs. remove the capability | Is the channel's content meant to be data, or (like a Skill) instruction? |
| Hide the system prompt vs. remove the secret | Is the exposure a leak, or a design defect? |

## How to run this session

1. **Frame** — both objectives are placement on a diagram. The trap is treating "add
   guardrails" as a universal answer, and the second trap is a control that works by
   breaking the legitimate use. Name both upfront.
2. **Teach the probabilistic limitation** first. Give a "must never disclose X" requirement
   and ask whether a prompt instruction satisfies it. It does not — have them design the
   deterministic control.
3. **Teach P5.1 placement.** Present a diagram (e.g. a customer-account assistant with
   lookup, update, and email tools) plus a misuse path ("a caller talks it into emailing
   another customer's statement") and a legitimate use ("customers can have statements
   emailed to themselves"). Have the learner trace the path, list every placement point,
   and pick the one that closes the path without breaking the use. Then hand them a
   blanket option and make them say exactly what it degrades.
4. **Teach over-refusal and input vs. output screening** as placement choices, with a
   legitimate-but-sensitive request.
5. **Teach injection vs. jailbreak**, using the MCP and CI examples from Tier 1 sessions 7
   and 12 as callbacks.
6. **Teach P5.2 surface enumeration.** Give an architecture with a RAG corpus, a web-fetch
   tool, a third-party MCP server, and a marketplace Skill. Have them list every channel
   by which text reaches context and who controls it. Make sure they catch MCP tool
   descriptions and the Skill, which are instructions by design.
7. **Teach the P5.2 controls.** Ask what an injected instruction could actually accomplish
   given the tool set, then have them reduce privileges and add side-effect validation
   until the answer is "nothing much." Then ask where labelling helps and where it can't
   (the Skill).
8. **Teach the system-prompt-is-not-a-secret rule** briefly.
9. **Teach guardrail evals** — adversarial and legitimate-use sets, tying back to
   session 34.
10. **Decision table** — walk all eight rows.
11. **Scenario drill — 5 questions**, standalone Professional format with a system diagram
    or configuration in each stem. Include two placement items (one where the blanket
    control degrades the stated use), a "must never" requirement needing a deterministic
    control, an injection-surface item involving an MCP server response or a third-party
    Skill, and one multiple-response on injection controls.
12. **Distractor autopsy** — expect prompt instructions offered for absolute requirements;
    blanket filters or gates that close the misuse path by breaking the stated legitimate
    use; injection treated as a prompt-hardening problem rather than a privilege problem;
    "label it as untrusted" offered as the sole control, or offered for a third-party
    Skill whose content is meant to be followed; and tool descriptions from an MCP server
    left out of the injection surface.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Compliance obligations and their controls (P5.5) → session 37
- Risk ranking incl. supply chain (P5.3), human-in-the-loop gate placement (P5.4), and
  bias across groups (P5.6) → session 38
- Hallucination and groundedness measurement → session 34; root cause from traces → session 33
- Least-privilege tool configuration (P3.1) → session 41
- Central distribution and managed settings for plugins and Skills (P7.1) → session 43
- Cost and latency → session 36
