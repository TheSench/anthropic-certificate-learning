---
name: build-bank
description: Build or rebuild pre-gated item banks for prompt files. Use when asked to build a bank for a slot, rebuild stale banks, or refresh bank facts.
allowed-tools: Bash, Read, Edit, Write
---

# Build an item bank

**Never print, quote, or return item text — stems, options, keys, autopsies — from any step or any subagent; pass file paths and report ids, gate names, reason codes and counts only.**

A bank is `banks/<tier>/<NN>-<slug>.json`: items drafted and gated offline plus verified
facts for one prompt file. The gates live in `.agents/docs/GATES.md` and nowhere else;
this skill never restates them. Each role below is a subagent run from a prompt in
`roles/`, handed file paths only. Intermediates go in `banks/.work/<NN>-<slug>/` (gitignored),
and every bare file name in the procedure below is under that directory.

The blind solver is the check that carries the weight: on the first real run the keyed
auditor passed every item and the solver produced all the useful failures.

## Modes

- `build <slot>` — the full procedure below for one prompt file. Look up the slot's row in
  `.agents/SEQUENCE.md`; its File column gives `prompts/tier<T>/<NN>-<slug>.md`, which fixes
  the tier, `<NN>-<slug>`, and `ID_PREFIX` (`t<tier>-<NN>`).
- `rebuild-stale` — for each `banks/**/*.json`, run
  `node .claude/skills/build-bank/scripts/bank.mjs status <bank>`. Rebuild every `stale-prompt` and `stale-gates`
  bank with `build`; list every fact whose `checkedOn` is more than 30 days old.
- `refresh-facts <slot>` — re-run the facts role. For each fact whose `value` changed,
  regenerate only the items whose `factRefs` include it, through steps 2–5 (generator,
  key stripping, isolated solver, auditor), then reassemble.

Banks are maintainer content and reach `main` by pull request, like any harness change. The commit message carries counts only.

## Procedure

1. **Facts.** Run `roles/facts.md` with `PROMPT` and `OUT=facts.json`. A prompt with no
   withheld facts yields `[]`.
2. **Draft.** Run `roles/generator.md` with `PROMPT`, `FACTS`, `OUT=drafts.json`,
   `ID_PREFIX` (e.g. `t1-06`) and `COUNT` (default 15).
3. **Strip keys.** Write `solver-input.json` with a one-off `node -e` that reads
   `drafts.json` and keeps `{id, prompt, options}` per item. Print only the count.
4. **Isolate the solver.** Create a fresh directory outside the repo, e.g. with
   `mktemp -d`, holding copies of exactly three inputs: `solver-input.json`, the prompt
   file as `prompt.md`, and `facts.json`. Run `roles/blind-solver.md` with
   `ITEMS=solver-input.json`, `PROMPT=prompt.md`, `FACTS=facts.json`,
   `OUT=solver-verdicts.json`, all inside that directory, which is the solver's working
   directory, so it cannot open the drafts. Copy the verdicts back into the work dir.
5. **Audit.** Run `roles/keyed-auditor.md` with `DRAFTS`, `PROMPT`, `FACTS`,
   `OUT=auditor-verdicts.json`.
6. **Score and loop.** Scoring is mechanical:

   ```bash
   node .claude/skills/build-bank/scripts/score.cjs drafts.json solver-verdicts.json auditor-verdicts.json rewrite.json
   ```

   It prints ids and reason codes only and writes the `{id, reasons}` list for the
   generator. Send failed ids back to `roles/generator.md` with `REWRITE=rewrite.json`.
   Re-solve the rewritten items with a **fresh** solver on that subset, in a fresh
   isolated directory (repeat steps 3–4 on the subset), and re-audit them. At most 2
   rounds; then drop what still fails.
7. **Assemble, stamp, validate.** Write the bank as
   `{meta: {promptFile, promptHash: "", gatesHash: "", builtAt: "", model: ""}, facts: <facts.json>, items: <drafts.json>}`
   to `banks/<tier>/<NN>-<slug>.json`, keeping only passing items, then:

   ```bash
   node .claude/skills/build-bank/scripts/bank.mjs stamp banks/<tier>/<NN>-<slug>.json <model>
   node .claude/skills/build-bank/scripts/bank.mjs validate banks/<tier>/<NN>-<slug>.json
   ```

   Expected: exit 0. On `too-few-items`, run one more generator round for the shortfall.
8. **Report** counts only to the maintainer: per gate failed / rewritten / dropped, final
   count, objective coverage, key distribution.

## Calibrating the solver

A seeded-defect calibration is not part of a routine build. On the real run 2 of 9 seeded
"defects" turned out to be decidable, i.e. not defective, so confirm each seed is
defective before scoring the solver against it.
