#!/usr/bin/env bash
# scan.sh — heuristic static scan for postgres-prisma hard-rule violations.
# Greps changed (or all) source files for the obvious misses the review rubric covers.
# HEURISTIC: every hit is a lead, not a verdict — confirm against the source before
# reporting. Read-only.
#
# Usage: scan.sh [--base <git-ref>] [--all] [--help]
#   (default)    : scan files changed in the working tree vs HEAD (staged + unstaged + untracked)
#   --base <ref> : scan files changed vs <ref> (e.g. origin/main)
#   --all        : scan the whole source tree (app/ store/ server/ utils/ models/ lib/ prisma/ scripts/)
# Output: one TSV line per hit — `tag<TAB>file:line<TAB>snippet`, then a stderr summary.
# Exit 0 always (hits are data, not a failure).
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 2

MODE="worktree"; BASE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) MODE="base"; BASE="$2"; shift 2;;
    --all) MODE="all"; shift;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) echo "scan: unknown arg: $1" >&2; exit 2;;
  esac
done

SRC_GLOBS=('app/**' 'store/**' 'server/**' 'utils/**' 'models/**' 'lib/**' 'prisma/**' 'scripts/**' 'middleware.ts')

FILES=()   # populate portably (macOS bash 3.2 has no mapfile)
add_files() { while IFS= read -r f; do [[ -n "$f" && -f "$f" ]] && FILES+=("$f"); done; }
case "$MODE" in
  base)
    add_files < <(git diff --name-only "$BASE"...HEAD -- "${SRC_GLOBS[@]}" 2>/dev/null)
    ;;
  worktree)
    add_files < <( { git diff --name-only HEAD -- "${SRC_GLOBS[@]}"; git ls-files --others --exclude-standard -- "${SRC_GLOBS[@]}"; } 2>/dev/null | sort -u)
    ;;
  all)
    add_files < <(find app store server utils models lib prisma scripts middleware.ts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.scss' -o -name '*.sh' -o -name '*.prisma' \) 2>/dev/null)
    ;;
esac
[[ ${#FILES[@]} -gt 0 ]] || { echo "scan: no source files in scope." >&2; exit 0; }

snip() { sed 's/^[[:space:]]*//' | cut -c1-110; }

# scan <tag> <regex> [file-filter-regex] [exclude-regex] — grep tag over the in-scope
# files; lines matching exclude-regex are dropped (POSIX ERE only — no lookaheads).
scan() {
  local tag="$1" re="$2" filter="${3:-.}" exclude="${4:-}"
  for f in "${FILES[@]}"; do
    [[ "$f" =~ $filter ]] || continue
    grep -nE "$re" "$f" 2>/dev/null | { if [[ -n "$exclude" ]]; then grep -vE "$exclude"; else cat; fi; } | while IFS=: read -r l t; do
      printf '%s\t%s:%s\t%s\n' "$tag" "$f" "$l" "$(printf '%s' "$t" | snip)"
    done
  done
}

# file-name checks
for f in "${FILES[@]}"; do
  [[ "$f" == *" copy"* ]] && printf 'copy-file\t%s:0\t%s\n' "$f" "stray copied file name"
done

scan console-log     '\bconsole\.(log|error|warn|debug|info)\('                    '\.(ts|tsx)$'
scan any-type        '(:\s*any\b|\bas any\b|<any>)'                                  '\.(ts|tsx)$'
scan ts-ignore       '@ts-ignore'                                                    '\.(ts|tsx)$'
scan inline-style    'style=\{\{'                                                    '\.tsx$'
scan hardcoded-hex   '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b'                           '^(app|utils|store)/.*\.(tsx|css|scss)$'
scan raw-fetch       '\bfetch\('                                                     '^app/.*\.tsx$'
scan prisma-in-ui    'from "@/lib/prisma"|PrismaClient'                              '^app/.*\.tsx$'
scan client-env      'process\.env\.[A-Za-z_]+'                                      '^(app/.*\.tsx|store/.*\.ts|utils/.*\.tsx?)$'  'NEXT_PUBLIC_'
scan skip-only       '\.(skip|only)\('                                               '\.test\.(ts|tsx)$'
scan hardcoded-email '[A-Za-z0-9._%+-]+@(gmail|yandex|mail|outlook|icloud)\.[a-z]+'  '\.(ts|tsx)$'
scan force-reset     '(force-reset|accept-data-loss|migrate reset|TRUNCATE|DROP TABLE)' '\.(ts|sh|prisma|json)$'
scan english-ui      '>(Loading\.\.\.|Submit|Delete|Save|Cancel|Error)<'             '^app/.*\.tsx$'
scan ty-register     '\b(Ты|ты|Твой|твой|Тебе|тебе|Твоя|твоя)\b'                      '^app/.*\.tsx$'
scan max-width-query '@media[^{]*max-width'                                          '\.(css|scss)$'

echo "scan: ${#FILES[@]} file(s) scanned (mode: $MODE). Hits are heuristic — confirm each against the source." >&2
exit 0
