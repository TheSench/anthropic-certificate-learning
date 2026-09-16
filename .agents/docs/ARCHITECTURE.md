# ARCHITECTURE.md — System Design

## Overview

Static markdown curriculum plus an agent-driven session protocol. No service, no API,
no dependencies. All state lives in files and is committed to git.

## Module map

```
BLUEPRINT.md          ← Canonical exam blueprints: domains, weights, formats, doc URLs
README.md             ← Human-facing guide: what this is, how to use it
CLAUDE.md             ← Session trigger ("Start"/"Continue"/"mock"/"drill")
AGENTS.md             ← Development routing

.agents/
  TUTORIAL.md         ← Session protocol: teach → drill → score → record → commit
  docs/               ← Architecture, development playbooks, conventions, templates
    TRAPS.md          ← Distractor inventory: bias families + per-domain traps

prompts/
  tier1/  (15)        ← Foundations breadth, one session per domain slice
  tier2/  (6)         ← Scenario-archetype drills; 2 run interleaved inside Tier 1
  tier3/  (16)        ← Professional breadth, one session per domain slice
  tier4/  (4)         ← Professional capstones

learner/              ← All mutable learner state
  profile.md          ← Background, progress, mastery, review queue, distractor patterns
  readiness.md        ← Per-domain confidence + projected scaled score
  relevance.md        ← Per-domain depth calibration
  glossary.md         ← Single running term index
  progress.md         ← Generated mermaid charts
  sessions/           ← Individual session logs (after the profile split)

drills/
  deck.md             ← Spaced-repetition cards from missed questions
```

## Session flow

```
User sends "Start" / "Continue" / "mock" / "drill"
  └─ Agent reads .agents/TUTORIAL.md
  └─ Agent reads learner/{profile,relevance,readiness}.md
       ├─ Missing profile → initialization (background questions, create files)
       └─ Found → decide what runs next, in priority order:
            explicit request > due drills > due review > GATE mock > next session
  └─ Agent loads prompts/<tier>/<NN>-<slug>.md
  └─ Agent fetches the prompt file's cited docs to verify version-sensitive facts
  └─ Agent runs the session: frame → teach Socratically → decision tables
       → scenario drill at exam difficulty → distractor autopsy
  └─ Agent records: session log, mastery, review queue, readiness, drill cards,
       glossary, progress charts
  └─ Agent commits
  └─ Agent displays the closing message
```

## Key design decisions

**Progress on a branch, harness on `main`** — the learner commits `learner/` and
`drills/` to a `learning` branch; curriculum and protocol updates arrive on `main` and
are merged in at Step 0.5 of `TUTORIAL.md`. This works only because the ownership split
is disjoint: the learner writes `learner/` and `drills/`, the maintainer writes
`prompts/`, `.agents/`, `BLUEPRINT.md`, and `README.md`. Nothing is written by both, so
the recurring merge is conflict-free in practice. A conflict is a signal the split was
violated, which is why the sync aborts and hands it to a human rather than resolving it.

**Merge, never rebase** — rebasing would rewrite progress commits every session, forcing
a force-push on any published branch and diverging a learner who studies on two machines.
The session log is an append-only record; its hashes are expected to be stable.

**Sync reads the fork's `upstream`, not `origin`** — most learners arrive by forking, so
`origin` is their own copy and carries none of the updates. Fetching `origin` on a fork
"succeeds" and reports up-to-date forever, which is a silent failure: the learner studies
a frozen curriculum believing it is current. The sync detects a non-canonical `origin`
with no `upstream` and emits the one-time `git remote add` fix.

**Sync never blocks a session** — a failed fetch prints one line and proceeds. Studying
offline matters more than being current.

**State in files, not memory** — everything is written to `learner/` and `drills/` and
committed after each session, so progress survives across conversations and machines.

**Curriculum read-only to agents** — `prompts/`, `.agents/TUTORIAL.md`, `BLUEPRINT.md`,
and `README.md` are the learning contract. Only humans change them. This keeps an agent
from quietly rewriting the syllabus to match what it just happened to teach.

**Weight-proportional session counts** — sessions per domain track the official exam
percentages rather than the topic's intrinsic interest. A 27% domain gets four sessions;
a 7% domain gets one. Study time follows what is scored.

**Docs are the source of truth, not the prompt files** — both exams test current product
behavior across Claude Code, the Agent SDK, the API, and MCP, all of which move faster
than any static curriculum. Prompt files carry the *pedagogy* (what to teach, in what
order, with which decisions surfaced) and cite authoritative URLs for the *facts*. The
protocol requires fetching those before teaching anything version-sensitive, and logging
any contradiction so a human can fix the prompt file.

**Teach then drill, never one without the other** — these are scenario-based
multiple-choice exams sat closed-book. Understanding alone doesn't build answer
recognition under time pressure, and drilling alone doesn't transfer to unseen scenarios.
Every session does both, and the distractor autopsy is treated as the highest-value
segment, because on a well-written exam the wrong answers are where the discrimination is.

**Domain order is F1 → F5 → F2 → F3 → F4, and two drills are interleaved into Tier 1** —
strict tier order left a fourteen-session gap between teaching F1 (sessions 1–4) and drilling
it at scenario scale, and put the first sustained exam-format block at session 18. Both are
bad for a recognition-under-pressure exam. The fix required reordering, not just moving
drills: both F1-heavy archetypes (S1, S3) also need F5, so with F5 taught last no F1 drill
could run early at all. Teaching F5 second unlocks S3 at session 7, cutting F1's gap from
fourteen sessions to three; S2 follows at session 11 for F2. S1 deliberately stays last in
Tier 2 as a final F1/F5 pass immediately before the mock. The tier boundary still means what
it did — Tier 2 is drilling, Tier 1 is teaching — the drills just start earlier.

The first attempt at this moved S2 and S4 forward without reordering domains, and measuring
it showed the worst gap going from 14 to 15 sessions: inserting drills pushed later teaching
down, and neither chosen archetype touched F1. Placement alone couldn't fix a gap that came
from the domain order.

**A drill may teach, but only into a knowledge hole** — the "teach nothing new" rule is
correct for a recognition failure, where another rep and the autopsy are the fix. It's wrong
when the learner simply doesn't know the material: deferring to a review session several
sessions out means reaching the mock with the hole open. So a drill stops, re-teaches one
concept, re-drills it, and continues — capped at two per session, because a third means the
tier didn't land and the honest call is to re-run the source session.

**Readiness is estimated and labeled as such** — the projected scaled score exists to
answer "which domain do I study next", using weight × shortfall. Untaught domains count
as 0 rather than "unknown", so the projection can't flatter early. A mock result always
overrides the estimate for its domains.

**Mock gates block advancement** — a sub-720 mock queues the weakest domains for review
instead of advancing a tier. This is the one place the system is designed to say no.

**Missed questions become durable artifacts** — every miss becomes a drill card with its
distractor tell, on a spacing schedule. Missed questions are the highest-signal study
material available, and losing them to conversation scrollback wastes the session.

**Questions are generated per session; traps are stored** — prompt files specify a
*generator* (scenario shape, domain mix, coverage list, trap inventory) rather than a bank
of written items, and `docs/TRAPS.md` stores the reusable half. A committed question bank
is the obvious alternative and it's worse here for three reasons. There is one learner and
they read the repo, so a stored item is an item they've seen — which is why Tier 2 briefs
are regenerated fresh and `GATE-F` draws 4 of 6 archetypes at random. Stored items are also
frozen at authoring time and can't respond to depth calibration or a readiness number that
says push harder in F1. And they rot: the docs move often enough to need
`check-sources.sh` and a weekly changelog check, so a static bank would silently drill
stale behavior. What *doesn't* rot is the reasoning error a distractor exploits, so that's
what's stored — at the level of the bias, never the flag name or the limit.

**Items are constructed before they're administered** — the five gates are a cold check
and don't work applied to an item you're already committed to asking, so the whole drill is
drafted and gated as a batch before question one (`TUTORIAL.md` § Item pre-batch). The cost
asymmetry drives this: a rewrite during drafting is free, while a defective item misgrades
a question *and* writes a fabricated weakness into the profile that then steers calibration
and mock selection indefinitely. One recorded session administered five items of which
three were defective, and the phantom weakness fed calibration until the learner challenged
it.

**Glossary as a flat running index** — one file, topic-sectioned rather than per-session,
so each term has exactly one entry that later sessions deepen in place. Written at the
end of every session, never loaded wholesale at the start.
