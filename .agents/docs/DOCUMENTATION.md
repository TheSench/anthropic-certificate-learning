# DOCUMENTATION.md — Doc Index and Ownership

## Files

| File | Purpose | Owner | Agent may edit |
|---|---|---|---|
| `README.md` | Human-facing guide: what this is, how to run it | Human | No |
| `BLUEPRINT.md` | Canonical exam blueprints, weights, doc URL map | Human | No |
| `CLAUDE.md` | Session trigger | Human | No |
| `AGENTS.md` | Development routing | Human | No |
| `.agents/TUTORIAL.md` | Session protocol | Human | No |
| `.agents/docs/ARCHITECTURE.md` | System design + rationale | Human | No |
| `.agents/docs/DEVELOPMENT.md` | Change playbooks | Human | No |
| `.agents/docs/GUIDELINES.md` | Conventions + anti-patterns | Human | No |
| `.agents/docs/TEMPLATES.md` | Learner file templates | Human | No |
| `.agents/docs/DOCUMENTATION.md` | This file | Human | No |
| `prompts/**` | Session curriculum | Human | No |
| `learner/**` | Learner state | Agent | Yes |
| `drills/deck.md` | Spaced-repetition cards | Agent | Yes |

The split is deliberate: the agent owns everything about *this learner's progress*, and
owns none of the *curriculum or protocol*. See `ARCHITECTURE.md` § Key design decisions.

## Where to look first

| Question | File |
|---|---|
| What's on the exam, and what's it weighted? | `BLUEPRINT.md` |
| How does a session actually run? | `.agents/TUTORIAL.md` |
| Why is it built this way? | `.agents/docs/ARCHITECTURE.md` |
| How do I change X? | `.agents/docs/DEVELOPMENT.md` |
| What are the naming/writing rules? | `.agents/docs/GUIDELINES.md` |
| Where is the learner right now? | `learner/profile.md`, `learner/readiness.md` |
| What should the learner study next? | `learner/readiness.md` § Highest-leverage next study |

## Staleness watch

Two things in this repo go stale on their own, and both have refresh playbooks in
`DEVELOPMENT.md`:

1. **Exam blueprints** — Anthropic revises domains and weights. Re-verify before booking.
2. **Documentation URLs** — Claude Code docs moved from `docs.claude.com` to
   `code.claude.com`, and API docs to `platform.claude.com`. Expect more moves.

Session prompts cite live docs rather than restating product facts, so ordinary product
drift is absorbed at session time. Only structural changes need a repo edit.
