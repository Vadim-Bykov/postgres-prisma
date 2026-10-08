#!/usr/bin/env bash
# Cursor `beforeShellExecution` adapter for bin/git-guard (light mode).
#
# The policy lives in ONE place: bin/git-guard (blocks force/mirror pushes, remote
# branch deletion and hook bypasses; commits and pushes to `main` are allowed).
# This script only translates Cursor's JSON envelope:
#
#   Cursor in : {"command": "...", "cwd": "..."}
#   Cursor out: {"permission": "allow"|"deny"|"ask", "user_message": "...", "agent_message": "..."}
#
# When the guard cannot be consulted we emit "ask" rather than "allow", so a broken
# setup surfaces to the developer instead of silently dropping enforcement.
set -u

payload="$(cat)"

root="${CURSOR_PROJECT_DIR:-$PWD}"
guard="$root/bin/git-guard"
[ -x "$guard" ] || guard="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/bin/git-guard"

emit_allow() {
  printf '{"permission":"allow"}\n'
  exit 0
}

emit_ask() {
  if command -v jq >/dev/null 2>&1; then
    jq -nc --arg m "$1" '{permission:"ask",user_message:$m,agent_message:$m}'
  else
    printf '{"permission":"ask"}\n'
  fi
  exit 0
}

if ! command -v jq >/dev/null 2>&1; then
  printf '%s\n' '{"permission":"ask","user_message":"git-guard: jq not found - git policy was NOT checked.","agent_message":"The git guard could not run because jq is missing. Do not assume the command is policy-compliant."}'
  exit 0
fi

[ -x "$guard" ] || emit_ask "git-guard: $guard is missing or not executable - git policy was NOT checked."

cmd="$(printf '%s' "$payload" | jq -r '.command // ""')"
[ -n "$cmd" ] || emit_allow

cwd="$(printf '%s' "$payload" | jq -r '.cwd // ""')"
[ -n "$cwd" ] || cwd="$root"

reason="$("$guard" --cwd "$cwd" --cmd "$cmd" 2>/dev/null)"
rc=$?

case "$rc" in
  0) emit_allow ;;
  10)
    jq -nc --arg m "${reason:-Blocked by git-guard.}" \
      '{permission:"deny",user_message:("Blocked by git-guard: " + $m),agent_message:$m}'
    exit 0
    ;;
  *) emit_ask "git-guard: the guard exited abnormally (exit $rc) - git policy was NOT checked." ;;
esac
