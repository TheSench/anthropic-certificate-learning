# Prompt Engineering That Survives Production — F3 Prompt Engineering & Structured Output

**Exam weight: 20%**

## What this session assumes

Sessions 1–7. The learner has written prompts but may not have a systematic model of
which techniques earn their token cost.

## Why this domain is worth 20% of your score

The F3 domain description names **explicit criteria development** and **few-shot
examples**. The exam does not test prompt trivia or "magic phrases" — it tests whether
you can diagnose *why* a production prompt is failing and pick the intervention that
addresses that cause. Wrong answers are usually real techniques applied to the wrong
failure mode.

## Authoritative sources

**Core technique reference**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

**Model-specific guidance** — verify which applies to the model in the scenario
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5>

**Reasoning controls**
- <https://platform.claude.com/docs/en/build-with-claude/extended-thinking>
- <https://platform.claude.com/docs/en/build-with-claude/effort>

**Reliability under prompting**
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- <https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons>

**System prompt design**
- <https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts>

## Teaching objectives

By the end, the learner can:

- Write **explicit success criteria** into a prompt — what "good output" means, in terms
  checkable by someone who didn't write it — and explain why vague quality words
  ("professional", "concise") don't constrain behavior
- Choose and construct **few-shot examples** deliberately: what a good example set covers
  (the boundary cases, not the easy middle), how many, and how examples can *narrow*
  behavior harmfully when unrepresentative
- Use **role and context framing** where it changes output, and recognize where it's
  decoration
- Structure a long prompt so the model reliably finds what matters — ordering, delimiters,
  and putting instructions where they survive a long context
- Decide when to use **extended thinking** or a higher effort setting, and what it costs
  in latency and tokens
- Diagnose a failing prompt to a *cause* — ambiguous criteria, missing context, unstated
  edge-case handling, conflicting instructions, or genuinely needing a stronger model —
  and pick the matching intervention
- Explain why "add more instructions" often makes a prompt worse, and what to do instead
- Handle refusals and unexpected stop reasons as design considerations, not surprises
- Explain what belongs in a **system prompt** vs. a per-request message, on caching and
  stability grounds

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Few-shot vs. explicit criteria | Is the gap in *knowing the target*, or in *judging it*? |
| Extended thinking vs. a better prompt | Is the failure multi-step reasoning, or an unclear ask? |
| Stronger model vs. better prompt | Does the prompt already state the task unambiguously? |
| System prompt vs. per-request context | Is it stable across requests (cacheable) or per-call? |
| More instruction vs. less | Are the current instructions conflicting or diluted? |
| Prompt fix vs. output validation | Must correctness be *guaranteed*, or improved on average? |

## How to run this session

1. **Frame** — the exam tests diagnosis, not technique recall. Say so.
2. **Teach explicit criteria** first. Give a weak prompt ("summarize this professionally")
   and have the learner rewrite the criteria until a stranger could grade the output.
   Iterate at least twice — the first attempt is usually still vague.
3. **Teach few-shot construction.** Have them pick 3 examples for a classification task
   from a pool you describe, then ask what behavior their choice *excludes*. The lesson is
   that examples both teach and constrain.
4. **Teach long-prompt structure** — ordering and delimiters, and where instructions get
   lost.
5. **Teach the reasoning controls** and their cost. Ask when they wouldn't use extended
   thinking despite it improving quality.
6. **Teach diagnosis as the core skill.** Present four failing prompts, each broken a
   different way. For each: what's the cause, and what's the minimal fix? Do not let the
   learner answer "add few-shot examples" to all four — that's the exact bias the exam
   punishes.
7. **Teach the prompt-vs-validation boundary.** Prompting improves the distribution; it
   never guarantees. Anything requiring a guarantee needs validation (session 9).
8. **Decision table** — walk all six rows.
9. **Scenario drill — 4 questions.** Use a support-ticket classifier at 92% accuracy with
   a 98% requirement, where errors cluster in ambiguous multi-issue tickets. Ask for the
   diagnosis, the intervention, what to change about the examples, and where prompting
   stops being the answer. Include one multiple-response.
10. **Distractor autopsy** — expect technique-shotgunning (apply everything) and reaching
    for a stronger model before the prompt is unambiguous.
11. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Schema enforcement and JSON validation → session 9
- Batch and throughput → session 10
- Prompt caching mechanics → session 14
- Eval design to measure prompt changes → Tier 3 session 7
- Prompt portfolios across models → Tier 3 session 15
