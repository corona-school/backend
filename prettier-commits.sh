#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g' | grep -E "graphql|common" | grep -v -E "migration|generated")

[ -z "$FILES" ] && echo "No files to prettify" && exit 0

echo "Prettifying the following files: "
echo "$FILES"

echo "Run Prettier"
echo "$FILES" | xargs ./node_modules/.bin/prettier --ignore-unknown --write

echo "Readd them to staging area"
echo "$FILES" | xargs git add

exit 0