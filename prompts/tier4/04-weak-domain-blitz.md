# Weak-Domain Blitz

**Targets whichever domains the learner is weakest in · Professional capstone 4 of 4**

## What this session is

An adaptive final session before the Professional mock gate. Unlike the other capstones,
this one has **no fixed content** — it reads the learner's own record and attacks their
specific weaknesses.

Run this last. It's the highest-leverage session in the curriculum precisely because it's
targeted, and it's the one worth re-running.

## Session focus

This session has **no fixed content** — it reads the learner's own record and attacks their specific weaknesses, which makes it the highest-leverage session in the curriculum and the one worth re-running. Two crux ideas: rank domains by *weight × shortfall* rather than by raw weakness, and attack recurring **distractor patterns** separately from domain gaps, by constructing questions engineered to trigger each bias. Tell the learner afterward that those questions were built to trip that bias — naming a trap is what makes it resistible under exam pressure. Be direct in the verdict; a false green light costs an exam fee and a retake wait.

## Step 1 — Read the record

Before doing anything else, read:

- `learner/readiness.md` — per-domain confidence and the projected score
- `learner/profile.md` — `## Topic mastery`, `## Review queue`, `## Recurring gaps`, and
  especially `## Distractor patterns`
- `drills/deck.md` — cards with low streaks or high `Seen` counts relative to streak (these
  are the persistent confusions)
- The most recent mock result, if any, and its per-domain breakdown

## Step 2 — Compute the target list

Rank domains by **weight × shortfall** — the same calculation that drives the readiness
file's "highest-leverage next study". Take the top three.

Then, separately, identify the top two **distractor patterns** — the systematic biases
recurring across sessions. These are attacked differently: not by re-teaching a domain, but
by constructing questions designed to trigger the bias and letting the learner feel it fire.

State the plan to the learner before starting:

```
**Blitz targets** (weight × shortfall):
1. [Domain] — [weight]% × [shortfall] = highest leverage
2. …
3. …

**Bias targets:**
- [Pattern, e.g. "defaults to the most capable model when a cost constraint should decide"]
- [Pattern]

Projected: [N]/1000 · 720 to pass
```

If the projection is already comfortably above 720 and all domains are above 70, say so and
recommend proceeding to the mock rather than padding the session.

## Step 3 — Run the blitz

For each of the three target domains, in weight order:

1. **Two minutes of targeted re-teaching**, aimed only at the specific gap the record shows
   — not a domain overview. If the record shows the gap is a confusion between two things,
   teach the discrimination and nothing else.
2. **4–6 exam-format questions** at full Professional difficulty, standalone items.
3. **Full distractor autopsy** on every one.
4. Re-score the domain from measured accuracy.

Then for each bias target:

1. Construct **3 questions specifically engineered to trigger it** — a scenario where the
   biased answer is genuinely attractive and a stated constraint rules it out.
2. Tell the learner afterward that these were built to trip that specific bias, whether or
   not they fell for it. Naming the trap is what makes it resistible under exam pressure.

## Step 4 — Interleaved drill

Pull the 8–10 worst-performing cards from `drills/deck.md` — lowest streak, highest `Seen` —
and run them closed-book. These are the confusions that haven't stuck despite repetition,
and they're the likeliest to appear on the exam as a miss.

## Step 5 — Readiness verdict

Recompute the projection and give a direct recommendation:

- **Above 780 with no domain below 65** → ready; proceed to the mock
- **720–780** → marginal; name the one domain to drill and re-run this blitz before the mock
- **Below 720** → not ready; name the two domains and recommend specific Tier 3 sessions to
  re-run as reviews

Be direct. A false green light here costs the learner an exam fee and a retake wait.

```
## Blitz result — [date]

| Domain | Before | After | Basis |
|---|---|---|---|

**Bias check:** [did each targeted bias fire?]
**Drill:** [N]/[N] on the hardest cards
**Projected: [N]/1000**

**Verdict:** [Ready / Marginal / Not ready] — [one sentence why]
**Next:** [specific action]
```

## Re-running this session

This session is designed to be run more than once. On a re-run, recompute targets from the
current record rather than reusing the previous list, and note in the log which targets
changed — a domain that keeps reappearing needs a different approach than another drill
pass, and should be called out plainly.

## Recording

Record per `.agents/TUTORIAL.md` Step 5. Update every touched readiness row from measured
accuracy. Add drill cards for new misses, and reset the streak on any old card missed again.
