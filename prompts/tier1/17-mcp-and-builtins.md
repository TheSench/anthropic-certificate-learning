# MCP Servers and Built-in Tools — F4 Tool Design & MCP Integration

**Exam weight: 18%**

## What this session assumes

Sessions 14 (designing tool interfaces) and 16 (tool errors and tool distribution). Session
14 established that a description is the model's selection mechanism — which is exactly what
decides whether your MCP server's tools get used instead of a built-in. Session 16 established
`isError` and structured error metadata on MCP tool results, and the cost of an oversized tool
surface, which is what connecting several servers at once produces. This is the last F4
session and the last of Tier 1's teaching sessions on this domain. It owns § 6 tasks
**2.4 — "Integrate MCP servers into Claude Code and agent workflows"** and **2.5 — "Select and
apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively."**

## Why this domain is worth 18% of your score

The F4 domain description names **MCP server configuration**, and MCP is listed among the
products in scope — but § 17 draws a hard line through it: servers, tools, resources,
`isError`, tool descriptions, tool distribution, `.mcp.json`, and environment variable
expansion are in; **deploying or hosting MCP servers is explicitly out**. That boundary is
the single most useful thing to internalise here, because a great deal of real-world MCP
knowledge is hosting knowledge and none of it is scored. Task 2.5 is the domain's most
concrete material: which built-in tool for which job, and the exam asks it as a plain
selection question with a tempting near-miss in the options.

## Session focus

This session covers integrating MCP servers into a working setup and selecting among the
built-in tools. The crux is **resources expose catalogs, tools take actions — and a
description good enough to beat the built-in is what gets your MCP server used at all.**
Spend disproportionate time on that pair: the resources-vs-tools distinction is where the
exam tests whether the learner understands what MCP actually offers beyond "more tools", and
the description-quality point is session 14 cashing out — an under-described MCP tool loses
to `Grep` every time, and the agent quietly falls back to the built-in while the team wonders
why they built a server. Then teach configuration concretely: **`.mcp.json`** at project level
versus **`~/.claude.json`** at user level, and **`${ENV_VAR}`** expansion so credentials never
get committed. The second half is task 2.5, which is pure discrimination drill — `Grep` versus
`Glob`, `Edit` versus `Read` + `Write`, and the incremental exploration habit. Do not teach
transports, tunnels, or hosting; see `## Out of scope`, and say why when the learner asks.

## Authoritative sources

Verify config file locations and the built-in tool surface from live docs before teaching
them; both have moved before.

**MCP in Claude Code and the SDK**
- <https://code.claude.com/docs/en/mcp>
- <https://code.claude.com/docs/en/mcp-quickstart>
- <https://code.claude.com/docs/en/agent-sdk/mcp>

**MCP via the API**
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>
- <https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers>

**Built-in tools**
- <https://code.claude.com/docs/en/tools-reference>
- <https://code.claude.com/docs/en/settings>

**Codebase exploration practice**
- <https://code.claude.com/docs/en/best-practices>

## Teaching objectives

### Task 2.4 — integrating MCP servers

By the end, the learner can:

- Explain what MCP standardizes: a protocol for exposing **tools**, **resources**, and
  prompts to a model host, so an integration is written once rather than once per client
- Place a server in the right configuration file and say who it serves:
  - **`.mcp.json`** — **project-level**, living in the repository, committed and shared, so
    every developer on the project gets the same servers
  - **`~/.claude.json`** — **user-level**, personal to one developer across all their
    projects, not shared and not committed
  - The tell: does this server belong to the *project* (everyone working on this codebase
    needs it) or to the *person* (their own tooling, their own accounts)?
- Configure credentials with **`${ENV_VAR}` expansion**, so a shareable committed
  `.mcp.json` references a variable name while the secret itself stays in each developer's
  environment. Name what this buys precisely: the file is committable *because* the secret
  is not in it
- State the discovery mechanic: **tools from all configured MCP servers are discovered at
  connection time and are available simultaneously.** The agent does not pick a server and
  then a tool — every connected server's tools land in one flat selection surface together.
  Two consequences follow, and the learner should derive both: name collisions across servers
  become a real hazard, and the tool-surface problem from session 16 is exactly what you
  create by connecting eight servers at once. Connect that back: selection reliability
  degrades with decision complexity, so scope the connected set to the task
- Distinguish MCP **resources** from MCP **tools** and say when each is right. **Resources
  expose content catalogs** the model can pull from — issue summaries, documentation
  hierarchies, database schemas — while **tools take actions.** The payoff is concrete:
  exposing a catalog as a resource **reduces exploratory tool calls**, because the model reads
  what exists instead of calling a search tool repeatedly to find out. If a learner models
  MCP as "a way to add tools", this is the correction
- **Write MCP tool descriptions good enough to beat the built-in.** This is session 14 applied
  to a specific competition: an agent with both a built-in `Grep` and an MCP tool that does
  something more capable will **prefer the built-in** when the MCP tool's description does not
  make its capabilities and outputs clear. The fix is **enhancing the MCP tool description to
  explain its capabilities and outputs in detail** — what it does that the built-in cannot,
  what it returns, and when to reach for it. Name the failure signature: the server is
  connected, the tools are listed, and the agent never calls them
- Choose **an existing community MCP server over a custom implementation** for standard
  integrations. For a well-known third-party system — Jira is the guide's example — a
  community server already exists, is maintained, and covers the standard surface. **Reserve
  custom servers for team-specific workflows** that no community server models. The tell: is
  this integration standard-for-everyone, or particular to how your team works?
- Debug a server that isn't working as a discrimination: is it connection, configuration, or
  *selection*? The third is the one learners skip, and after session 14 they should reach for
  it — a connected server whose tools are never chosen is a description problem

*Brief aside, not a teaching block:* a third-party server sees the arguments sent to it and
returns content that enters the model's context, so its responses and its tool descriptions
are untrusted input. State that in a sentence if the learner raises it, and move on — it is
not attached to a task statement here, and prompt-injection defense in depth is Tier 3
session 11.

### Task 2.5 — selecting built-in tools

By the end, the learner can:

- Select the right built-in and say why the alternatives are wrong:
  - **`Grep`** — searches file **contents** for a pattern. This is the tool for finding a
    function name, an error message string, or an import statement across a codebase
  - **`Glob`** — matches file **paths** by name or extension: `**/*.test.tsx`. It finds
    *which files exist*, not what is in them
  - **`Read`** / **`Write`** — whole-file operations
  - **`Edit`** — a targeted modification anchored on **text that must be unique** in the file
  - **`Bash`** — running commands
- Name the standard fallback: **when `Edit` fails because its anchor text is not unique in the
  file, use `Read` + `Write`** — read the file, construct the modified content, write it back.
  Make them say why repeating the `Edit` with slightly different text is not the fix
- Build codebase understanding **incrementally rather than reading all files upfront**: start
  with **`Grep` to find entry points**, then **`Read` to follow imports and trace flows**.
  Give the reason in context terms — reading a 200-file service upfront spends the window on
  files that turn out to be irrelevant, and session 6 established that accumulated results are
  what actually fills the window
- **Trace a function's usage across wrapper modules**: first identify **all exported names**
  from the module, then **search for each name** across the codebase. Name why the naive
  approach fails — searching only the original function name misses every call site that goes
  through a re-export or an alias, and the result looks like a complete answer

## Decisions the exam actually tests

Surface each of these explicitly as a "when to use which, and the tell" table:

| Decision | The tell that decides it |
|---|---|
| `.mcp.json` vs. `~/.claude.json` | Does the *project* need this server, or does the *person*? |
| Secret in config vs. `${ENV_VAR}` expansion | Is this file going to be committed? (Then always the variable) |
| MCP resource vs. MCP tool | Is the model *reading a catalog*, or *taking an action*? |
| Community MCP server vs. custom | Is the integration standard (Jira, GitHub), or specific to your team's workflow? |
| Connect every server vs. scope the set | How many tools land in one selection surface at connection time? |
| MCP tool vs. built-in | Does the MCP tool's description make its added capability and outputs clear enough to be chosen? |
| `Grep` vs. `Glob` | Are you searching *inside* files, or *for* files? |
| `Edit` vs. `Read` + `Write` | Is there text unique enough to anchor on? |
| Incremental `Grep`-then-`Read` vs. reading the tree | Do you know yet which files matter? |
| Search one name vs. enumerate exports first | Could the calls be routed through wrappers or re-exports? |

## How to run this session

1. **Frame the scope boundary first.** F4 is 18%; this session owns 2.4 and 2.5. State the
   § 17 line out loud before teaching anything: MCP servers, tools, resources, `isError`,
   descriptions, distribution, `.mcp.json`, and environment variable expansion are testable;
   **deploying or hosting MCP servers is explicitly out of scope** — infrastructure,
   networking, container orchestration, transports, tunnels. If the learner knows MCP
   operationally, tell them plainly that most of that knowledge is not scored here, so they
   do not spend study time defending it.
2. **Teach the problem MCP solves** briefly — the N-integrations × M-clients matrix — then the
   protocol's shape: tools, resources, prompts.
3. **Teach configuration concretely and by filename.** `.mcp.json` at the project, committed;
   `~/.claude.json` for the user, personal. Give a team scenario with four servers — an
   internal ledger service everyone on the repo needs, a personal note-taking server, a shared
   CI integration, a developer's own scratch server — and have them place each and justify it.
   Then introduce **`${ENV_VAR}`** expansion and ask what makes the project file safe to
   commit.
4. **Teach the discovery mechanic and let them derive the consequence.** State it plainly:
   tools from all configured servers are discovered at connection time and available
   simultaneously, in one flat surface. Then ask what eight connected servers does to
   selection. Drive them to session 16's mechanism — decision complexity, not just tokens —
   and to name collisions as the second hazard. This is a callback, so make them do the work.
5. **Teach resources versus tools as the session's first crux half.** Give a scenario where an
   agent makes eleven exploratory tool calls just to learn what documentation exists. Ask what
   would remove them. Drive to: expose the documentation hierarchy as a **resource** — a
   content catalog the model reads — rather than making it discoverable only through repeated
   tool calls. Do the same for issue summaries and a database schema. Make them state the rule:
   catalogs are resources, actions are tools.
6. **Teach the description-beats-the-built-in case as the second crux half.** Present a team
   that built an MCP server with a semantic code-search tool, connected it, and finds the agent
   still using `Grep` for everything. Ask for the diagnosis before the fix. Drive to: the MCP
   tool's description does not explain its capabilities and outputs in enough detail for the
   model to prefer it, so the model falls back to the built-in it understands. The fix is
   enhancing the description — what it does that `Grep` cannot, what it returns, when to use
   it. Say explicitly that this is session 14's mechanism, now competing against a built-in.
7. **Teach build-versus-adopt.** Ask whether they would write a Jira MCP server. Drive to: use
   the existing community server for standard integrations; reserve custom servers for
   team-specific workflows nothing off the shelf models.
8. **Teach debugging as a three-way discrimination** — connection, configuration, selection —
   and make them notice that after step 6 the third is the one they now reach for.
9. **Pivot to 2.5 and drill it as selection, not definitions.** Verify the current built-in
   surface against `code.claude.com/docs/en/tools-reference` first. Then give six concrete
   tasks and have them name the tool and justify it: "find every caller of `parse_config`";
   "find all `.test.tsx` files"; "find where this error message is produced"; "change one line
   in a file where that line appears three times"; "understand an unfamiliar 200-file
   service"; "trace how a helper is used across wrapper modules". The two that decide items:
   **`Grep` versus `Glob`** (contents versus paths) and the **`Edit`-anchor-not-unique →
   `Read` + `Write`** fallback.
10. **Teach incremental exploration explicitly.** Ask how they would approach the 200-file
    service. Reject "read the src directory" and drive to: `Grep` for the entry point, then
    `Read` to follow imports and trace the flow. Connect the cost back to session 6 —
    accumulated results dominate the window.
11. **Teach the wrapper-module trace.** Ask how to find every usage of a helper that is
    re-exported through two wrapper modules. Drive to the two-step method: identify all
    exported names first, then search for each name across the codebase. Ask what a
    single-name search would have reported, and why that wrong answer looks complete.
12. **Decision table** — walk all ten rows. For each, give a scenario and have them apply it
    before you give the answer.
13. **Scenario drill — 6 questions.** Use a platform team standing up MCP for a repo: an
    internal service server everyone needs, a vendor Jira integration, a credential that must
    not be committed, and an agent that ignores their new search tool in favour of `Grep`.
    Ask for: the config-file placement; the credential handling; resources-versus-tools for a
    documentation hierarchy causing exploratory calls; the diagnosis of the ignored MCP tool;
    community-versus-custom for Jira; and one built-in selection item. Include one
    multiple-response, and make one item turn on `Glob` being offered for a search-inside-files
    task or a repeated `Edit` against a non-unique anchor.
14. **Distractor autopsy.** Expect: `~/.claude.json` chosen where the whole project needs the
    server; a credential written into a committed `.mcp.json`; an MCP tool added where a
    resource was the answer; "write our own Jira server" for a standard integration; a
    system-prompt instruction telling the agent to prefer the MCP tool, where the answer is to
    improve its description; and `Glob` offered for a contents search.
15. **Close Tier 1's F4 arc.** All three F4 task groups are now taught — interfaces (14),
    errors and distribution (16), MCP and built-ins (17). Tell the learner F4 is complete and
    name their weakest of the three.
16. Record per `.agents/TUTORIAL.md` Step 5. Glossary **`.mcp.json`**, **`~/.claude.json`**,
    **`${ENV_VAR}` expansion**, **MCP resource**, and each built-in tool name.

## Out of scope

Defer and say where it's covered:
- **Deploying or hosting MCP servers** — out of scope for the exam entirely, per § 17:
  infrastructure, networking, and container orchestration. **Transports (stdio vs. HTTP/SSE)
  and enterprise tunnels fall on that side of the line** — do not teach them, and if the
  learner raises them, say in one sentence that they are hosting concerns the exam excludes
  and move on. Correct knowledge of an excluded topic is still wasted study
- OAuth, API key rotation, and authentication protocol details — § 17 excludes these; the
  scored credential content is `${ENV_VAR}` expansion and nothing beyond it
- Specific cloud provider configurations — excluded by § 17
- Prompt injection defenses in depth, and the third-party trust analysis beyond the one-line
  aside above → Tier 3 session 11
- Writing tool descriptions, renaming, splitting → session 14 (task 2.1), already taught;
  this session assumes it and applies it to MCP tools competing with built-ins
- `isError`, `errorCategory`, `isRetryable`, structured error responses → session 16
  (task 2.2), already taught
- Tool distribution, scoped tool sets, `tool_choice` → session 16 (task 2.3), already taught;
  reference it when the connected-surface question comes up rather than re-teaching it
- Context budgeting and why incremental exploration pays → session 6, already taught
- CLAUDE.md, slash commands, and skills → sessions 19 and 20 (F2), which come next
- Enterprise MCP governance, data residency, and gateways → Tier 3 sessions 2 and 10
