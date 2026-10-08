#!/usr/bin/env bash
# git-guard.sh — Claude Code PreToolUse adapter for the Bash tool (light git policy).
#
# ADAPTER ONLY. The policy lives in the tool-neutral `bin/git-guard` (shared with the
# Cursor adapter in .cursor/hooks/git-guard.sh), so both harnesses enforce exactly the
# same rules: no force/mirror pushes, no remote branch deletion, no --no-verify, no
# core.hooksPath overrides. Commits and pushes to `main` are allowed in this repo.
#
#   stdin  : PreToolUse hook JSON  ({ tool_input: { command }, cwd })
#   stdout : permissionDecision "deny" when `bin/git-guard` exits 10,
#            "ask" when the guard cannot be consulted (jq or the guard missing),
#            nothing otherwise
#   exit   : always 0 (silence = normal permission handling proceeds)

set -u

input="$(cat)"

ask() {
  # Fail closed-ish: surface the broken setup instead of silently allowing.
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

command -v jq >/dev/null 2>&1 || ask "git-guard: jq not found - git policy was NOT checked."

cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // ""')"
basecwd="$(printf '%s' "$input" | jq -r '.cwd // "."')"

[ -n "$cmd" ] || exit 0

guard="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}/bin/git-guard"
[ -x "$guard" ] || ask "git-guard: $guard is missing or not executable - git policy was NOT checked."

reason="$("$guard" --cwd "$basecwd" --cmd "$cmd")"
status=$?

case "$status" in
  0) exit 0 ;;
  10)
    jq -n --arg r "$reason" \
      '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
    exit 0
    ;;
  *) ask "git-guard: the guard exited abnormally (exit $status) - git policy was NOT checked." ;;
esac
