#!/usr/bin/env bash
# Check every doc URL under `## Authoritative sources` in prompts/ still resolves.
#
# The prompt files teach from live Anthropic docs, so a moved or retired page is a
# silent failure: the session fetches nothing useful and teaches from memory instead.
# Version-pinned paths (models/opus-5/..., models/haiku-4-5/...) carry a built-in
# expiry and are reported separately — they are the ones that rot first.
#
# Usage:  .agents/check-sources.sh [-j N]      (default 12 parallel requests)
# Exit:   0 all URLs resolve · 1 one or more failed

set -uo pipefail
cd "$(dirname "$0")/.."

JOBS=12
while getopts "j:" opt; do
  case $opt in
    j) JOBS="$OPTARG" ;;
    *) echo "usage: $0 [-j N]" >&2; exit 2 ;;
  esac
done

command -v rg >/dev/null || { echo "error: ripgrep (rg) required" >&2; exit 2; }

urls=$(rg -o 'https?://[^>) ]+' prompts/ --no-filename | sed 's/[.,]$//' | sort -u)
total=$(printf '%s\n' "$urls" | grep -c . || true)
[ "$total" -eq 0 ] && { echo "no URLs found under prompts/ — is the layout still the same?" >&2; exit 2; }

echo "Checking $total unique URLs from prompts/ (${JOBS}-way parallel)…"
echo

fails=$(mktemp)
trap 'rm -f "$fails"' EXIT

check() {
  local url="$1"
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 20 \
           -A 'anthropic-learning link-check' "$url" 2>/dev/null || echo 000)
  if [ "$code" != "200" ]; then
    printf '%s\t%s\n' "$code" "$url"
  fi
}
export -f check

printf '%s\n' "$urls" | xargs -P "$JOBS" -I{} bash -c 'check "$@"' _ {} > "$fails"

nfail=$(grep -c . < "$fails" || true)

if [ "$nfail" -eq 0 ]; then
  echo "All $total URLs resolve."
else
  echo "$nfail of $total FAILED:"
  echo
  while IFS=$'\t' read -r code url; do
    [ -z "$url" ] && continue
    printf '  [%s] %s\n' "$code" "$url"
    rg -n --no-heading -F "$url" prompts/ | sed 's/^/        /'
  done < "$fails"
fi

# Version-pinned paths: correct today, but they expire when the model line advances.
echo
pinned=$(rg -n -o 'https?://[^>) ]*(opus-[0-9]|sonnet-[0-9]|haiku-[0-9])[^>) ]*' prompts/ | sort -u)
if [ -n "$pinned" ]; then
  echo "Version-pinned URLs to re-check when the model line advances:"
  printf '%s\n' "$pinned" | sed 's/^/  /'
fi

[ "$nfail" -eq 0 ]
