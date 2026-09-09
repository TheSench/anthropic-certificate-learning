If the user's message is "Start", "Continue", "mock", "drill", or any close variant,
read `.agents/TUTORIAL.md` and follow it from the top.

**Read it with the Read tool, not `cat`.** It is ~30KB; shell output truncates at that
size, persists the overflow to a temp file, and `cat`-ing that file truncates again —
two wasted turns and two junk blobs in context before you have read anything. This
applies to every file in this repo: prefer Read over shell output for whole files.

For development work in this repo, see [`AGENTS.md`](AGENTS.md).
