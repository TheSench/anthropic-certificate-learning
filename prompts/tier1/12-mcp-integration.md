# MCP: Servers, Transports, Configuration — F4 Tool Design & MCP Integration

**Exam weight: 18%**

## What this session assumes

Tool Design. MCP servers expose tools, so description quality carries over.

## Why this domain is worth 18% of your score

The F4 domain description names **MCP server configuration**, and MCP is listed among the
products in scope. The exam tests configuration judgment and trust boundaries more than
protocol internals: which scope a server belongs in, what a remote third-party server can
see, and what happens when a server's tools land in the context of every request.

## Session focus

This session covers MCP servers, transports, and configuration scopes. The exam tests configuration judgment and trust boundaries here far more than protocol internals, so verify scope names and config locations against live docs. The crux is the **trust boundary**: a third-party server both sees the arguments sent to it (exfiltration) and returns content that enters the model's context (injection), which makes its tool descriptions untrusted input. Have the learner reach the mitigations before you supply any — accepting a vendor server without that analysis is the signature wrong answer.

## Authoritative sources

Verify config file locations, scope names, and transport support against live docs.

**MCP in Claude Code**
- <https://code.claude.com/docs/en/mcp>
- <https://code.claude.com/docs/en/mcp-quickstart>
- <https://code.claude.com/docs/en/managed-mcp>

**MCP via the API and SDK**
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>
- <https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers>
- <https://code.claude.com/docs/en/agent-sdk/mcp>

**Enterprise connectivity**
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/concepts>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/security>

**Security context**
- <https://code.claude.com/docs/en/security>
- <https://code.claude.com/docs/en/permissions>

## Teaching objectives

By the end, the learner can:

- Explain what MCP is and what it standardizes: a protocol for exposing tools, resources,
  and prompts to a model host, so an integration is written once rather than per-client
- Distinguish **local (stdio)** from **remote (HTTP/SSE)** servers and choose correctly
  based on where the data lives, who else needs the server, and what credentials it holds
- Place a server in the right **configuration scope** — personal, project (committed and
  shared), or enterprise-managed — and say who can override each
- Reason about the **trust boundary**: a third-party MCP server sees the arguments sent to
  it and returns content that enters the model's context, which makes its responses an
  injection surface as well as its tools a capability grant
- Explain why MCP tool *descriptions* are untrusted input when the server is third-party
- Account for the **context cost** of connected servers — every server's tool definitions
  occupy the window — and mitigate it
- Choose between an MCP server and a custom tool or built-in for a given need
- Explain what enterprise-managed MCP and tunnels solve that per-developer config doesn't:
  centralized approval, network-boundary crossing, and credential custody
- Debug a server that isn't working: is it connection, authentication, or tool selection?

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Local stdio vs. remote server | Does the data or credential need to stay on the machine? |
| Personal vs. project vs. managed scope | Who needs it, and who must not be able to disable it? |
| MCP server vs. custom tool | Will more than one client or team consume this? |
| Third-party vs. self-hosted server | What does it see, and would you accept that in an audit? |
| Connect all servers vs. scope per task | How much of the window are tool definitions consuming? |
| Managed MCP vs. per-developer config | Does the org need approval and custody centralized? |

## How to run this session

1. **Frame** — the exam tests configuration and trust judgment here, not protocol details.
2. **Verify** scope names and config locations from live docs before teaching them.
3. **Teach the problem MCP solves** — the N-integrations × M-clients matrix — then the
   protocol's shape at a high level.
4. **Teach transports** and have the learner place three servers (a local filesystem tool,
   an internal service behind a VPN, a vendor SaaS) and justify each.
5. **Teach scopes** with a team scenario: which server goes in which scope, and who can
   turn it off? Then ask what changes when one server must be mandatory.
6. **Teach the trust boundary** as the session's most important idea. Ask what a malicious
   or compromised third-party server could do — it sees arguments (data exfiltration) and
   returns content that enters the context (injection). Have them propose mitigations
   before you supply any.
7. **Teach context cost.** Ask what 8 connected servers costs on every request, and what
   to do about it.
8. **Teach the enterprise story** — managed MCP and tunnels — and what they centralize.
9. **Teach debugging** as a three-way discrimination: connection, auth, or selection.
10. **Decision table** — walk all six rows.
11. **Scenario drill — 5 questions.** Use a fintech team wanting MCP access to an internal
    ledger service, a vendor CRM, and a local secrets store, under an audit requirement.
    Ask about transport and scope choices, the trust analysis for the vendor server,
    context cost mitigation, and a debugging discrimination. Include one multiple-response.
12. **Distractor autopsy** — expect third-party servers accepted without a trust analysis,
    and personal scope chosen where a mandate is required.
13. Record per `.agents/TUTORIAL.md` Step 5. Glossary every scope and transport name.

## Out of scope

- Tool error semantics → Tool Errors & Retries
- Deep enterprise networking and gateways → Tier 3 session 2
- Compliance and data residency → Tier 3 session 10
- Prompt injection defenses in depth → Tier 3 session 11
