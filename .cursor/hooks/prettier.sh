#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.file_path // empty')

if [ -z "$FILE" ]; then
  exit 0
fi

npx prettier --write "$FILE" 2>/dev/null
exit 0
