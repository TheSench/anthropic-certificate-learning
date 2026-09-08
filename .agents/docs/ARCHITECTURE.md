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

prompts/
  tier1/  (15)        ← Foundations breadth, one session per domain slice
  tier2/  (6)         ← Foundations hardening, one per scenario archetype
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

**Readiness is estimated and labeled as such** — the projected scaled score exists to
answer "which domain do I study next", using weight × shortfall. Untaught domains count
as 0 rather than "unknown", so the projection can't flatter early. A mock result always
overrides the estimate for its domains.

**Mock gates block advancement** — a sub-720 mock queues the weakest domains for review
instead of advancing a tier. This is the one place the system is designed to say no.

**Missed questions become durable artifacts** — every miss becomes a drill card with its
distractor tell, on a spacing schedule. Missed questions are the highest-signal study
material available, and losing them to conversation scrollback wastes the session.

**Glossary as a flat running index** — one file, topic-sectioned rather than per-session,
so each term has exactly one entry that later sessions deepen in place. Written at the
end of every session, never loaded wholesale at the start.
