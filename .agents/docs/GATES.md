# GATES.md — Item Validation Gates

The six checks a drafted item must pass before it's administered. They run at
[`TUTORIAL.md` § Item pre-batch](../TUTORIAL.md#item-pre-batch), over the whole batch,
item by item, before the first question is asked — see that section for when and why
pre-batching happens. A "no" on any gate means rewrite that item now, while rewriting is
still free.

**This file is the only copy of the gates.** They are not restated anywhere else in the
repo; every reference to them points here.

1. **The intended answer is present** — verbatim, as one of the options. Not "close
   to" option D; *is* option D.
2. **No option restates the premise.** If the question presupposes a property, that
   property cannot be the keyed-false option.
3. **The keyed defect is stated in the source definition's own words** — not a
   paraphrase. Paraphrase is where a definition silently drifts into a different
   property.
4. **The distractor tell is writable.** If you can't name what makes each wrong option
   tempting, it isn't a distractor — rewrite it. This is the gate that fails most
   often; [`TRAPS.md`](TRAPS.md) is the inventory of distractors whose tell
   is already named.
5. **The key's position is not predictable.** Across a batch, no single letter may hold
   more than half the keys, and every batch of four or more must use at least three
   distinct letters. Assign positions *after* writing the items — the correct answer
   tends to land in the same slot when written first and never moved. A deck keyed 58%
   to one letter can be beaten without reading the question. The official sample items
   are themselves skewed (10 of 12 keyed A); do **not** imitate that — the exam can
   afford a skew because its pool is unseen, a deck that re-serves cards cannot.
6. **The stem decides the item.** A scenario question whose stated constraints don't
   rule out the distractors has no defensible key, whatever the other gates say.
   Answer three questions per item, in writing — the writing is the gate, because an
   item you drafted reads as decidable to you whether or not it is:
   - **Which stated constraint kills each distractor?** One named constraint per wrong
     option. A distractor that dies by assumption rather than by something in the stem
     means either the constraint is missing or the option is throwaway — fix whichever
     it is.
   - **Does the key depend on a quantity the stem doesn't supply?** If the key's
     correctness turns on a number, that number is in the stem.
   - **Does every stated constraint do work?** A constraint that decides nothing
     invites a defensible case for a different answer. Either it constrains the key or
     it doesn't belong in the stem.
