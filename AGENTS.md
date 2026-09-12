# AGENTS.md — anthropic-learning

> Tutorial system preparing one learner for the Claude Certified Architect
> certifications: Foundations (CCAR-F), then Professional (CCAR-P).

## Development reference

| Changing... | Read next |
|---|---|
| Exam blueprints, domain weights, doc URLs | [`BLUEPRINT.md`](BLUEPRINT.md) |
| Session protocol (teaching, drills, mocks, scoring) | [`.agents/TUTORIAL.md`](.agents/TUTORIAL.md) |
| Curriculum content | [`prompts/`](prompts/) |
| Learner file formats | [`.agents/docs/TEMPLATES.md`](.agents/docs/TEMPLATES.md) |
| Architecture or setup | [`.agents/docs/ARCHITECTURE.md`](.agents/docs/ARCHITECTURE.md) |
| Change playbooks | [`.agents/docs/DEVELOPMENT.md`](.agents/docs/DEVELOPMENT.md) |
| Session wrap-up procedure | [`.claude/skills/wrap/SKILL.md`](.claude/skills/wrap/SKILL.md) |
| Checking doc URLs still resolve | [`.agents/check-sources.sh`](.agents/check-sources.sh) |
| Conventions + anti-patterns | [`.agents/docs/GUIDELINES.md`](.agents/docs/GUIDELINES.md) |
| Distractors for drill questions | [`.agents/docs/TRAPS.md`](.agents/docs/TRAPS.md) |

## Working rules

**Always:**
- Follow `.agents/TUTORIAL.md` exactly while a session is in progress
- End every session with the `wrap` skill — it records all six files and verifies the
  commit landed; ad-hoc recording has silently dropped four of six files before
- Verify version-sensitive product facts against the live docs cited in the prompt file before teaching them
- Commit `learner/` and `drills/` after every session: `Session log: [Title] — [Domain] (YYYY-MM-DD)`
- Add a drill card for every missed question, and update `learner/glossary.md` with every new term, before committing

**Flag for human review:** any change to `prompts/`, `.agents/`, `BLUEPRINT.md`, or `README.md`

**Never:**
- Modify `prompts/`, `.agents/`, `BLUEPRINT.md`, or `README.md` without human approval
- Skip the git commit after a session — progress is only durable once committed
- Report a session as saved without seeing it in `git log` — `wrap` checks this for you
- Advance past a `GATE` row when the mock scored under 720
