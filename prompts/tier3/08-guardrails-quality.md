# Guardrails: Hallucination, Jailbreak, Leak — P3 Evaluation, Testing & Optimization

**Exam weight: 16%**

## What this session assumes

Session 7 (eval design). Guardrails without evals are unmeasurable, so that order matters.

## Why this domain is worth 16% of your score

The published guardrail guidance maps almost one-to-one onto exam-relevant failure modes:
hallucination, jailbreak, prompt leak, inconsistency, and streaming refusals. The scored
judgment is matching a **mitigation to a specific failure mode** — and knowing that
guardrails are probabilistic, so anything requiring a guarantee needs a deterministic
control outside the model.

## Session focus

This session covers the guardrail set: hallucination, jailbreak, prompt leak, inconsistency, streaming refusals. The exam tests **mitigation matching**, and the trap is treating "add guardrails" as a universal answer. The crux is the probabilistic limitation: prompt-level guardrails shift odds, they don't guarantee — so any requirement stated as "must never" needs a deterministic control outside the model. Second crux: distinguish injection (arriving via untrusted ingested data) from jailbreak (the user's own input), because the fixes differ, and least-privilege tooling is the strongest injection defense.

## Authoritative sources

**The guardrail set**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals>

**Grounding as the hallucination control**
- <https://platform.claude.com/docs/en/build-with-claude/citations>
- <https://platform.claude.com/docs/en/build-with-claude/search-results>

**Refusals and policy**
- <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>
- <https://platform.claude.com/docs/en/about-claude/use-case-guides/content-moderation>
- <https://www.anthropic.com/legal/aup>

**Enforcement points outside the model**
- <https://platform.claude.com/docs/en/manage-claude/inference-hooks>
- <https://code.claude.com/docs/en/security-guidance>

## Teaching objectives

By the end, the learner can:

- Match each failure mode to its effective mitigation rather than applying a generic
  "add guardrails" answer:
  - **Hallucination** → grounding in supplied sources, citations, permission to say
    "I don't know", and verification against a source of truth
  - **Jailbreak / injection** → input isolation and labeling, least-privilege tools,
    output validation, and not relying on instructions alone
  - **Prompt leak** → assume the system prompt is discoverable; don't put secrets in it
  - **Inconsistency** → explicit criteria, structured output, lower temperature, examples
  - **Streaming refusals** → detect and handle mid-stream, since partial output has
    already been sent
- Explain the central limitation: prompt-level guardrails shift probabilities; they don't
  guarantee. Any requirement stated as "must never" needs a deterministic control
- Distinguish **prompt injection** from **jailbreak**: injection arrives through untrusted
  data the system ingests (a document, a PR body, an MCP server's response, a web page);
  jailbreak comes from the user's own input. The mitigations differ
- Explain why **least-privilege tooling** is the strongest injection defense — an injected
  instruction can only do what the tools permit
- Design **content moderation** as a layered control: input screening, output screening,
  and the choice of what to do on a hit
- Handle **over-refusal** as a real product defect, not a safe default, and design for the
  legitimate-but-sensitive request
- Explain why the system prompt is not a security boundary, and where secrets belong instead
- Build the **eval suite for guardrails**: an adversarial set that runs as a regression
  gate, since guardrail quality silently decays across prompt and model changes
- Explain the layered principle: no single control is sufficient, and defense in depth is
  the design answer

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Prompt guardrail vs. deterministic control | Is the requirement "usually" or "never"? |
| Input screening vs. output screening | Where is the harm — in what's received or what's returned? |
| Grounding vs. a stronger model | Is the failure invention, or genuine reasoning difficulty? |
| Restrict tools vs. harden instructions | Could an injected instruction cause real damage? |
| Refuse vs. degrade vs. escalate | Is the request illegitimate, or legitimate but sensitive? |
| Hide the system prompt vs. remove the secret | Is the exposure a leak, or a design defect? |

## How to run this session

1. **Frame** — the exam tests mitigation matching, and the trap is treating "add guardrails"
   as a universal answer. Name that upfront.
2. **Teach the failure modes** one at a time with its specific mitigation. After all five,
   run a matching drill: eight described failures, match each to a mitigation, and reject
   generic answers.
3. **Teach the probabilistic limitation** as the session's central idea. Give a "must never
   disclose X" requirement and ask whether a prompt instruction satisfies it. It does not —
   have them design the deterministic control.
4. **Teach injection vs. jailbreak** carefully; the distinction changes the fix. Use the
   MCP and CI examples from Tier 1 sessions 7 and 12 as callbacks.
5. **Teach least-privilege as injection defense.** Ask what an injected instruction could
   actually accomplish given a tool set, then have them reduce the tool set until the answer
   is "nothing much."
6. **Teach layered moderation** and the on-hit decision.
7. **Teach over-refusal** as a defect. Ask for a legitimate request in a sensitive domain
   (a nurse asking about a drug interaction, a security engineer asking about an exploit)
   and how the design should serve it.
8. **Teach the system-prompt-is-not-a-secret rule** and where secrets go instead.
9. **Teach guardrail evals** — the adversarial regression suite, tying back to session 7.
10. **Decision table** — walk all six rows.
11. **Scenario drill — 5 questions**, standalone Professional format. Include a
    mitigation-matching question, a "must never" requirement needing a deterministic
    control, an injection-via-untrusted-data question, an over-refusal question, and one
    multiple-response on layered defense.
12. **Distractor autopsy** — expect prompt instructions offered for absolute requirements,
    and injection treated as a prompt-hardening problem rather than a privilege problem.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Governance program and compliance evidence → session 10
- Organizational risk management → session 11
- Cost and latency → session 9
